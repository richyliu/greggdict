// Ignore the first and last page for each letter for now because they might
// not have exactly 75 words
const ignorePages = [
  'p001.json', // A
  'p017.json',
  'p018.json', // B
  'p025.json',
  'p026.json', // C
  'p048.json',
  'p049.json', // D
  'p063.json',
  'p064.json', // E
  'p076.json',
  'p077.json', // F
  'p085.json',
  'p086.json', // G
  'p091.json',
  'p092.json', // H
  'p100.json',
  'p101.json', // I
  'p117.json',
  'p118.json', // J
  'p119.json',
  'p120.json', // K
  'p120.json',
  'p121.json', // L
  'p129.json',
  'p130.json', // M
  'p142.json',
  'p143.json', // N
  'p148.json',
  'p149.json', // O
  'p155.json',
  'p156.json', // P
  'p178.json',
  'p179.json', // Q
  'p180.json',
  'p181.json', // R
  'p196.json',
  'p197.json', // S
  'p225.json',
  'p226.json', // T
  'p239.json',
  'p240.json', // U
  'p247.json',
  'p248.json', // V
  'p253.json',
  'p254.json', // W
  'p259.json',
  'p260.json', // X,Y,Z
];

module.exports = ignorePages;
