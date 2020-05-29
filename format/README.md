# Shorthand Dictionary

## OCR process outline

The process for getting the words and their positions from the raw photos is
quite complicated. Here is an outline of that process in brief

### Step 0: Clean the images

I didn't do this initially, but this would greatly improve OCR results. Whiten
the images and increase the contrast and sharpness using a tool like imagemagick

### Step 1: Scan with Google Cloud Vision

Use Google Cloud Vision's asynchronous batch image processing to get the text of
all the images. Use `TEXT_DECTECTION` recognition, since there is sparse text on
the pages

### Step 2: Exploratory analysis

Visualize the data with `index.js`, which depends on `main.js`. Open up
`index.html`, which draws the page and the text box overlays on a canvas. This
can be used to determine how best to extract the useful text.

### Step 3: Extraction into preliminary JSON (format 2)

Run `run.js`, making sure to run the `moveToFormat2` function to convert the
raw scanned JSON into more usable JSON. This contains the position (just one
pair of coordinates) of each word in the dictionary as well as some of its best
effort error correction.

#### Know errors

There are several annoying errors in the raw scanned JSON. The first is that
some letters are scanned as Cyrillic characters, which appear identical to
English letters with the exception that their char code point is extremely large
(> 150). This is corrected by using a lookup table (`confusables.json`), which
is from UNICODE. Another error is that there is extraneous "junk" at the end of
a word. This is dealt with in step 5

#### Error correction

Error correction is done by removing letters from the start of the word until it
fits in alphabetically with the surrounding words.

### Step 4: Manual error correction

The format 2 JSON files are loaded and errors are manually corrected using
`corrector.html` (and the corresponding `corrector.js`). Periodically save and
back up the `format.json` file while going through the corrections.

Some words may be missing, in which case manually add them to the output JSON.

### Step 5: Word spelling error detection

All the files are in `format3/`. First the words are extracted into `wordlist`.
Then they are checked against a local dictionary (which may not be complete).
Only lowercase alpha words are checked, and the ones that do not pass are put
into `notindict`. The words that are not checked are put into `nonloweralpha`.
Those unchecked words are checked against the dictionary if they contain only
alpha characters (lower and uppercase). The ones that do not pass are put into
`notindict_upperalpha` and the ones that are contain non alpha characters are
put into `nonalpha`. At this stage there are three files that contain words that
are not spelled correctly: `nonalpha`, `notindict_upperalpha`, and `notindict`
(for lower alpha).

There are a lot of words which end in "junk" punctuation. Those have been split
into `nonalpha_endsinpunc` while the rest are in `nonalpha_endsnotpunc`. (This
is from `nonalpha`)

The spelling of words is checked using an online lookup tool (PhraseFinder.com).
The file for doing this is `phrasechecker.js`. It is run for each of the 4
files: `nonalpha_endsinpunc`, `nonalpha_endsnotpunc`, `nonalpha`,
`notindict_upperalpha`, `notindict` and the result goes into another file with
`pf_` as the prefix. Non ASCII words are automatically assumed to be non English
phrases.

The words in `nonalpha_endsinpunc` are fixed by removing the ending
"punctuation" (really anything besides `a-z` that the word ends in). There are
still a few words after which still are not valid. There are a few words with
end in `-` that need to be fixed manually.

### Step 6: Manual fixing

There are about 250 words that need to be fixed manually. This is done using
`fixer.html` and `fixer.js`. It is structured similarly to corrector. The
relevant files are in `format4/`

### Step 7: Final clean up

The file numbers are corrected (to match the actual page number). The output is
in `format5/`, which includes the images renamed as well.
