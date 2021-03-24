import React, { useState, useEffect, useRef, useReducer } from 'react';
import ReactDom from 'react-dom';

import { DraggableCore } from 'react-draggable';

const PARSED_JSON = './parsed/parsed01.json';
const IMG_WIDTH = 900;

const Wrapper = () => {
  const [allData, setAllData] = useState(null);
  useEffect(() => {
    fetch(PARSED_JSON)
      .then(r => r.json())
      .then(d => setAllData(d));
    return () => {};
  }, [setAllData]);

  return allData ? <App allData={allData} /> : <h1>Loading JSON...</h1>;
};

const App = ({ allData }) => {
  const [page, setPage] = useState(2);
  let paddedPage = ('' + page).padStart(3, '0');
  let curPage = `p${paddedPage}.json`;
  let curImg = `images/p${paddedPage}.png`;

  function onUpdate(newData) {
    console.log(JSON.stringify(newData));
  }

  return (
    <div>
      <h1>Manual editor</h1>
      {allData && (
        <Page initialData={allData[curPage]} img={curImg} onUpdate={onUpdate} />
      )}
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
      default:
        return d;
    }
  }, initialData);
  useEffect(() => {
    onUpdate(data);
    return () => {};
  }, [data]);

  function imageLoaded() {
    setScale(IMG_WIDTH / imageRef.current.naturalWidth);
  }

  return (
    <div style={{ position: 'relative' }}>
      <img src={img} onLoad={imageLoaded} width={IMG_WIDTH} ref={imageRef} />
      {data.map((d, i) => (
        <Text
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
      ))}
    </div>
  );
};

const fontSize = 80;

const Text = ({ text, x, y, scale, onDrag, onChangeText }) => {
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

ReactDom.render(<Wrapper />, document.getElementById('app'));
