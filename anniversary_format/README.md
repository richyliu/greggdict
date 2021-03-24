# Image parsing process

## Image extraction

Images are extracted from the pdf using pdfimages

```bash
pdfimages -png input.pdf out
```

## Google Cloud Vision OCR

Upload the images to a Google Storage Bucket and use the Cloud Vision API (see
`cloud_vision_batch` file) to scan the text with OCR.

## Automated parsing

Automated parsing is done with the `parseData` function in `index.js`. This
function is called by `viewer.js` for the browser (run `npm run start`) and
`nodeRunner.js` for NodeJS.

## Manual parsing

After the manual parsing, use `manual.js` to manually correct the JSON (built
with React)
