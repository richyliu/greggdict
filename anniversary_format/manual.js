import React, { useState, useEffect, useRef, useReducer } from 'react';
import ReactDom from 'react-dom';

import { DraggableCore } from 'react-draggable';

const PARSED_JSON = './parsed/parsed01.json';
const IMG_WIDTH = 900;

const Wrapper = () => {
  const [allData, setAllData] = useState(null);
  useEffect(() => {
    let canceled = false;
    fetch(PARSED_JSON)
      .then(r => r.json())
      .then(d => !canceled && setAllData(d));
    return () => (canceled = true);
  }, [setAllData]);

  return allData ? <App allData={allData} /> : <h1>Loading JSON...</h1>;
};

const App = ({ allData }) => {
  const [page, setPage] = useState(2);
  let paddedPage = ('' + page).padStart(3, '0');
  let curPage = `p${paddedPage}.json`;
  let curImg = `images/p${paddedPage}.png`;

  function onUpdate(newData) {
    console.log('[INFO] Data changed');
  }

  return (
    <div>
      <h1 style={{ margin: 10 }}>Manual editor</h1>
      <p>Modes shortcuts (use ctrl key, even on MacOS):</p>
      <ul>
        <li>editing (default, change and move words): ctrl-a</li>
        <li>none (hide words): ctrl-q</li>
        <li>remove (delete words): ctrl-d</li>
      </ul>
      <div>
        <Page initialData={allData[curPage]} img={curImg} onUpdate={onUpdate} />
      </div>
    </div>
  );
};

/**
 * Supported functionalities:
 *  Drag text location
 *  Change text content
 *
 *  Delete text
 *  Add text
 */

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
      default:
        return d;
    }
  }, initialData);
  useEffect(() => onUpdate(data), [data]);

  const [editorState, setEditorState] = useState('edit');

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
      case 'hidden':
        return;
      default:
        return <h2>Error: unknowk editor state: {editorState}</h2>;
    }
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (!e.ctrlKey) return;
      switch (e.key) {
        case 'q':
          setEditorState('hidden');
          e.preventDefault();
          return;
        case 'd':
          setEditorState('remove');
          e.preventDefault();
          return;
        case 'a':
          setEditorState('edit');
          e.preventDefault();
          return;
      }
    }
    document.body.addEventListener('keypress', onKeyDown);
    return () => document.body.removeEventListener('keypress', onKeyDown);
  });

  return (
    <div>
      <p>Current editor mode: {editorState}</p>
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

const fontSize = 80;

const EditText = ({ text, x, y, scale, onDrag, onChangeText }) => {
  const [hasChanged, setHasChanged] = useState(false);
  const editableTextRef = useRef(null);

  let hasNonAscii = text.split('').some(c => c.charCodeAt(0) > 127);
  let styles = {
    top: y * scale - (fontSize / 2) * scale,
    left: x * scale,
    fontSize: fontSize * scale,
    background: hasNonAscii ? 'aqua' : 'khaki',
    color: hasChanged ? 'red' : 'black',
    position: 'absolute',
    cursor: 'default',
  };
  function dragged(_e, d) {
    if (d.x === 0 && d.y === 0) return;
    let newX = Math.floor(x + d.deltaX / scale);
    let newY = Math.floor(y + d.deltaY / scale);
    onDrag({ x: newX, y: newY });
    setHasChanged(true);
  }

  function changeText() {
    onChangeText({ text: editableTextRef.current.innerHTML });
    setHasChanged(true);
  }

  // set initial text in span
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
        contentEditable
        suppressContentEditableWarning
      ></span>
    </DraggableCore>
  );
};

const RemoveText = ({ text, x, y, scale, onRemove }) => {
  let hasNonAscii = text.split('').some(c => c.charCodeAt(0) > 127);
  let styles = {
    top: y * scale - (fontSize / 2) * scale,
    left: x * scale,
    fontSize: fontSize * scale,
    background: hasNonAscii ? 'aqua' : 'salmon',
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

ReactDom.render(<Wrapper />, document.getElementById('app'));
