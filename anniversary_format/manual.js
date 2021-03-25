import React, { useState, useEffect, useRef, useReducer } from 'react';
import ReactDom from 'react-dom';

import { DraggableCore } from 'react-draggable';
import * as localForage from 'localforage';

const PARSED_JSON = './parsed/parsed01.json';
// adjust this so it fits your screen
const IMG_WIDTH = 1000;

const LOCAL_DATA_KEY = 'gregg_dict_editor_01';

const Wrapper = () => {
  const [allData, setAllData] = useState(null);
  const originalData = useRef(null);

  useEffect(() => {
    let canceled = false;

    // load from locally stored, or from external JSON
    localForage.getItem(LOCAL_DATA_KEY, (err, local) => {
      if (local) {
        console.log('[INFO] Loaded local data');
        setAllData(local);
      }
      fetch(PARSED_JSON)
        .then(r => r.json())
        .then(d => {
          if (!canceled) {
            originalData.current = d;
            if (!local) {
              setAllData(d);
              console.log('[INFO] Fetched data from JSON');
            }
          }
        });
    });
    return () => (canceled = true);
  }, [setAllData]);

  // log diff between current and fetched JSON on ctrl-o
  useEffect(() => {
    function onKeyDown(e) {
      if (!e.ctrlKey) return;
      if (e.key !== 'o') return;

      e.preventDefault();
      localForage.getItem(LOCAL_DATA_KEY, (err, modified) => {
        let diff = objectDiff(originalData.current, modified);
        console.log('[INFO] Diff between local and remote JSON', diff);
      });
    }
    document.body.addEventListener('keypress', onKeyDown);
    return () => document.body.removeEventListener('keypress', onKeyDown);
  });

  return allData ? <App initialData={allData} /> : <h1>Loading JSON...</h1>;
};

const App = ({ initialData }) => {
  // get initial page from search param
  let params = new URLSearchParams(document.location.search.substring(1));
  let initialPage = parseInt(params.get('page') || '1', 10);
  const [page, setPage] = useState(initialPage);
  let paddedPage = ('' + page).padStart(3, '0');
  let curPage = `p${paddedPage}.json`;
  let curImg = `images/p${paddedPage}.png`;

  // tracks the current data state
  const modifiedData = useRef(JSON.parse(JSON.stringify(initialData)));

  function saveData() {
    console.log('[INFO] Saving data...');
    localForage.getItem(LOCAL_DATA_KEY, (err, local) => {
      if (local) {
        let diff = objectDiff(local, modifiedData.current);
        console.log('[INFO] Diff between state and locally stored', diff);
      }
      localForage.setItem(LOCAL_DATA_KEY, modifiedData.current, () => {
        console.log('[INFO] Saved data locally');
      });
    });
  }

  function showDiff() {
    localForage.getItem(LOCAL_DATA_KEY, (err, local) => {
      if (local) {
        let diff = objectDiff(local, modifiedData.current);
        console.log('[INFO] Diff between state and locally stored', diff);
      }
    });
  }

  // keybindings for switching pages or saving/showing data
  useEffect(() => {
    function onKeyDown(e) {
      if (!e.ctrlKey) return;
      switch (e.key) {
        case 'x':
          if (page < Object.keys(initialData).length) setPage(page + 1);
          e.preventDefault();
          return;
        case 'z':
          if (page > 0) setPage(page - 1);
          e.preventDefault();
          return;
        case 'c':
          saveData();
          e.preventDefault();
          return;
        case 's':
          showDiff();
          e.preventDefault();
          return;
      }
    }
    document.body.addEventListener('keypress', onKeyDown);
    return () => document.body.removeEventListener('keypress', onKeyDown);
  });

  // url for downloading the data
  let encoded = encodeURIComponent(JSON.stringify(modifiedData.current));
  let dataUrl = `data:text/json;charset=utf-8,${encoded}`;

  // upload JSON to overwrite the current locally stored
  function onFileUpload(e) {
    const fr = new FileReader();
    fr.addEventListener('load', () => {
      console.log('[INFO] Loaded user uploaded JSON file');
      let loaded = JSON.parse(fr.result);
      let diff = objectDiff(modifiedData.current, loaded);
      console.log('[INFO] Diff between uploaded JSON and current state', diff);
      localForage.setItem(LOCAL_DATA_KEY, loaded, () => {
        console.log(
          '[INFO] Overwrote locally stored data. Please refresh the page.'
        );
      });
    });
    fr.readAsText(e.target.files[0]);
  }

  return (
    <div
      style={{
        height: 'calc(100vh - 16px)',
        overflowY: 'hidden',
        marginLeft: '10px',
      }}
    >
      <details>
        <h1>Manual editor</h1>
        <summary>Usage</summary>
        <p>Modes shortcuts (use ctrl key, even on MacOS):</p>
        <ul>
          <li>editing (edit words): ctrl-a</li>
          <li>outline (show bounding box only and drag words): ctrl-q</li>
          <li>remove (delete words): ctrl-w</li>
          <li>add (add new words): ctrl-t</li>
        </ul>
        <p>Other shortcuts</p>
        <ul>
          <li>go back a page: ctrl-z</li>
          <li>go forward a page: ctrl-x</li>
          <li>save data: ctrl-c</li>
          <li>diff current state with locally stored data: ctrl-s</li>
          <li>diff locally stored data with original JSON data: ctrl-o</li>
        </ul>
        <p>
          <a href={dataUrl} download="data.json">
            Download data
          </a>
        </p>
        <p>
          Upload data: <input type="file" onChange={onFileUpload} />
        </p>
      </details>
      <Page
        initialData={modifiedData.current[curPage]}
        key={page}
        img={curImg}
        onUpdate={d => (modifiedData.current[curPage] = d)}
      />
    </div>
  );
};

const Page = ({ initialData, img, onUpdate }) => {
  const imageRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [data, dispatch] = useReducer((d, { type, val }) => {
    switch (type) {
      case 'updatePos':
        return d.map((c, i) =>
          i === val.index ? { ...c, x: val.x, y: val.y } : c
        );
      case 'updateText':
        return d.map((c, i) =>
          i === val.index ? { ...c, text: val.text } : c
        );
      case 'remove':
        return d.filter((_, i) => i !== val.index);
      case 'add':
        return [...d, val];
      default:
        return d;
    }
  }, initialData);
  useEffect(() => onUpdate(data), [data]);

  const [editorState, setEditorState] = useState('edit');

  // show text types based on editor state
  function curEditor() {
    switch (editorState) {
      case 'edit':
        return data.map((d, i) => (
          <EditText
            key={i}
            scale={scale}
            onDrag={a =>
              dispatch({ type: 'updatePos', val: { index: i, x: a.x, y: a.y } })
            }
            onChangeText={a =>
              dispatch({ type: 'updateText', val: { index: i, text: a.text } })
            }
            {...d}
          />
        ));
      case 'remove':
        return data.map((d, i) => (
          <RemoveText
            key={i}
            scale={scale}
            onRemove={a => dispatch({ type: 'remove', val: { index: i } })}
            {...d}
          />
        ));
      case 'outline':
        // outline shows only the outline and does not allow editing (dragging only)
        return data.map((d, i) => (
          <EditText
            key={i}
            scale={scale}
            onDrag={a =>
              dispatch({ type: 'updatePos', val: { index: i, x: a.x, y: a.y } })
            }
            onChangeText={a =>
              dispatch({ type: 'updateText', val: { index: i, text: a.text } })
            }
            outline={true}
            {...d}
          />
        ));
      case 'add':
        return (
          <AddText
            scale={scale}
            onAdd={a =>
              dispatch({
                type: 'add',
                val: { text: a.text, x: a.x, y: a.y },
              })
            }
          />
        );
      default:
        return <h2>Error: unknown editor state: {editorState}</h2>;
    }
  }

  // keybindings for switching between editor modes
  useEffect(() => {
    function onKeyDown(e) {
      if (!e.ctrlKey) return;
      switch (e.key) {
        case 'q':
          setEditorState('outline');
          e.preventDefault();
          return;
        case 'w':
          setEditorState('remove');
          e.preventDefault();
          return;
        case 'a':
          setEditorState('edit');
          e.stopImmediatePropagation();
          e.preventDefault();
          return;
        case 't':
          setEditorState('add');
          e.preventDefault();
          return;
      }
    }
    document.body.addEventListener('keypress', onKeyDown);
    return () => document.body.removeEventListener('keypress', onKeyDown);
  });

  return (
    <div>
      <p
        style={{
          margin: 5,
          fontSize: 20,
          background: data.length == 75 ? 'transparent' : 'orange',
        }}
      >
        Page: {img}, n = {data.length}, current mode: {editorState}
      </p>
      <div
        style={{
          position: 'relative',
          border: '1px solid black',
          display: 'inline-block',
        }}
      >
        <img
          src={img}
          ref={imageRef}
          onLoad={() => setScale(IMG_WIDTH / imageRef.current.naturalWidth)}
          style={{ width: IMG_WIDTH }}
        />
        {curEditor()}
      </div>
    </div>
  );
};

const fontSize = 79;

const EditText = ({ text, x, y, scale, onDrag, onChangeText, outline }) => {
  const [hasChanged, setHasChanged] = useState(false);
  const editableTextRef = useRef(null);

  // show special styles if there are non ascii or non alpha characters
  let alphaOnly = /^[a-zA-Z]+$/.test(text);
  let hasNonAscii = text
    .split('')
    .some(c => c.codePointAt(0) < 32 || c.codePointAt(0) > 126);
  let styles = outline
    ? {
        // the y-coordinates represents the center of the text
        top: y * scale - (fontSize / 2) * scale,
        left: x * scale,
        fontSize: fontSize * scale,
        color: 'transparent',
        // box-shadow to have border on the inside of the bounding box
        boxShadow: 'inset 0px 0px 0px 2px red',
        position: 'absolute',
        cursor: 'move',
      }
    : {
        top: y * scale - (fontSize / 2) * scale,
        left: x * scale,
        fontSize: fontSize * scale,
        background: alphaOnly ? 'khaki' : hasNonAscii ? 'aqua' : 'lightgreen',
        color: hasChanged ? 'red' : 'black',
        position: 'absolute',
      };
  function dragged(_e, d) {
    // don't allow dragging unless in outline mode
    if (!outline) return;
    if (d.x === 0 && d.y === 0) return;
    let newX = Math.floor(x + d.deltaX / scale);
    let newY = Math.floor(y + d.deltaY / scale);
    onDrag({ x: newX, y: newY });
    setHasChanged(true);
  }

  function changeText() {
    onChangeText({ text: editableTextRef.current.innerText.trim() });
    setHasChanged(true);
  }

  // set initial text in span so it's only set once
  useEffect(() => {
    let canceled = false;
    if (editableTextRef.current && !canceled)
      editableTextRef.current.innerHTML = text;
    return () => (canceled = true);
  }, [editableTextRef]);

  return (
    <DraggableCore onDrag={dragged}>
      <span
        style={styles}
        ref={editableTextRef}
        onInput={changeText}
        contentEditable={!outline}
        suppressContentEditableWarning
      ></span>
    </DraggableCore>
  );
};

const RemoveText = ({ text, x, y, scale, onRemove }) => {
  let styles = {
    top: y * scale - (fontSize / 2) * scale,
    left: x * scale,
    fontSize: fontSize * scale,
    background: 'salmon',
    color: 'black',
    position: 'absolute',
    cursor: 'pointer',
  };

  return (
    <span style={styles} onClick={onRemove}>
      {text}
    </span>
  );
};

// click anywhere to add a text box
const AddText = ({ scale, onAdd }) => {
  let styles = {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: '2px dotted red',
    position: 'absolute',
    cursor: 'pointer',
  };

  function onClick(e) {
    let x = Math.floor(e.nativeEvent.offsetX / scale);
    let y = Math.floor(e.nativeEvent.offsetY / scale);
    onAdd({ text: '__UNNAMED__', x, y });
    alert(`Added text at ${x}, ${y}`);
  }

  return (
    <div style={styles} onClick={onClick}>
      addition mode
    </div>
  );
};

/**
 * Diffs two objects of lists of objects. Only detects what has been added and
 * what has been removed. Changes are shown as as both added and removed.
 */
function objectDiff(oldObj, newObj) {
  let diff = {};

  // the keys for each object must match
  for (let [key, cur] of Object.entries(newObj)) {
    let oldItems = oldObj[key].map(a => JSON.stringify(a));
    let newItems = cur.map(a => JSON.stringify(a));

    // diff the list of items
    let removed = [];
    let added = [];
    for (let oldItem of oldItems) {
      if (!newItems.includes(oldItem)) removed.push(JSON.parse(oldItem));
    }
    for (let newItem of newItems) {
      if (!oldItems.includes(newItem)) added.push(JSON.parse(newItem));
    }

    // add it to the overall diff if there is something different
    if (removed.length > 0 || added.length > 0) diff[key] = { removed, added };
  }

  return diff;
}

ReactDom.render(<Wrapper />, document.getElementById('app'));
