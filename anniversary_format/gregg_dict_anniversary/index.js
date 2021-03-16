const pixelWidth = require('string-pixel-width');

function parseData(rawData) {
  let data = getTextAnnotations(rawData);
  let filtered = filterJunk(data);
  return filtered;
}

// Data format is in a list of objects
// Each object has a "text" key with the text, a "vertices" key with a list of
// objects with keys "x" and "y" containing the coordinates of the 4 vertices
// of the bounding box (top left, top right, bottom right, bottom left)

/**
 * Convert raw data into the above described data format
 */
function getTextAnnotations(rawData) {
  // remove first data point because it contains bounding box of all the text
  let data = rawData.responses[0].textAnnotations.slice(1);

  // convert object shape to a more convenient one
  data = data.map(d => ({
    text: d.description,
    vertices: d.boundingPoly.vertices,
  }));

  // verifies that the vertices are in the right order
  data = data.map(d => {
    if (d.vertices.length !== 4) {
      console.warn('WARNING: not 4 vertices in:', d);
      return;
    }
    let topLeft = d.vertices[0];
    let topRight = d.vertices[1];
    let bottomRight = d.vertices[2];
    let bottomLeft = d.vertices[3];

    if (
      topLeft.y < bottomLeft.y &&
      topLeft.y < bottomRight.y &&
      topLeft.x < topRight.x &&
      topLeft.x < bottomRight.x &&
      topRight.y < bottomLeft.y &&
      topRight.y < bottomRight.y &&
      topRight.x > bottomLeft.x &&
      bottomLeft.x < bottomRight.x
    ) {
      return d;
    }

    // normalize vertices
    console.warn('WARNING: normalized vertices in:', d);
    let v1 = d.vertices[0];
    let v2 = d.vertices[1];
    let v3 = d.vertices[2];
    let v4 = d.vertices[3];

    let topLeftX = Math.min(v1.x, v2.x, v3.x, v4.x);
    let topLeftY = Math.min(v1.y, v2.y, v3.y, v4.y);
    let bottomRightX = Math.max(v1.x, v2.x, v3.x, v4.x);
    let bottomRightY = Math.max(v1.y, v2.y, v3.y, v4.y);
    let topRightX = bottomRightX;
    let topRightY = topLeftY;
    let bottomLeftX = topLeftX;
    let bottomLeftY = bottomRightY;

    return {
      ...d,
      vertices: [
        { x: topLeftX, y: topLeftY },
        { x: topRightX, y: topRightY },
        { x: bottomRightX, y: bottomRightY },
        { x: bottomLeftX, y: bottomLeftY },
      ],
    };
  });

  return data;
}

// source: https://github.com/codebox/homoglyph/blob/master/raw_data/chars.txt
const TABLE = {
  с: 'c',
};

// Returns the ASCII character the char looks like (if non ASCII)
function toHomoglyph(char) {
  if (char.charCodeAt(0) <= 127) return char;

  console.log(char.charCodeAt(0));
  if (TABLE[char]) return TABLE[char];

  console.warn(
    `Unable to find homoglyph for char ${char} (code: ${char.charCodeAt(0)})`
  );
  return char;
}

/**
 * Filter out all the data that is junk (useless)
 */
function filterJunk(data) {
  return data.filter(isUseful);
}

/**
 * Identifies whether a piece of scanned text is useful text solely on the
 * basis of the bounding box proportions and the text itself
 */
function isUseful({ text, vertices }) {
  // junk is typically at most 4 letters long
  if (text.length > 4) return true;

  // one char is definitely junk
  if (text.length <= 1) return false;

  let textPixelWidth = pixelWidth(text, { font: 'Georgia', size: 66 });
  let rectWidth = vertWidth(vertices);
  let diff = Math.floor(Math.abs(rectWidth - textPixelWidth) * 100) / 100;
  let diffPercent = diff / textPixelWidth;
  console.log(`diffPercent: ${diffPercent.toFixed(3)}, word: "${text}"`);

  // difference between bounding box width and text width has to be less than 1%
  if (diffPercent < 0.1) return true;

  // otherwise the text cannot be considered useful
  return false;
}

/**
 * Get width of the smallest rectangle that covers the 4 vertices
 */
function vertWidth(vertices) {
  let topLeft = vertices[0].x;
  let topRight = vertices[1].x;
  let bottomRight = vertices[2].x;
  let bottomLeft = vertices[3].x;

  let left = Math.min(topLeft, bottomLeft);
  let right = Math.max(topRight, bottomRight);
  return right - left;
}

module.exports = parseData;
