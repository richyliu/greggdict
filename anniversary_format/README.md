# Image parsing process

## Image extraction

Images are extracted from the pdf using pdfimages

```bash
pdfimages -png input.pdf out
```

## Google Cloud Vision OCR

Upload the images to a Google Storage Bucket and use the Cloud Vision API (see
`cloud_vision_batch` file) to scan the text with OCR.


