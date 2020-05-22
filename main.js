(function(exports) {
  const PAGE_WIDTH = 1250;

  // remove extraneous text and do correction on the text
  // optionally draw lines if given canvas context
  function histFilter(textAnnotations, context, confusables) {
    // remove the first entry and remove the page number
    textAnnotations = textAnnotations
      .slice(1)
      .filter(a => !/^\d{2,3}$/.test(a.description));

    // remove text that are too small
    textAnnotations = textAnnotations.filter(t => t.description.length > 1);

    // remove text that has way too big of a bounding box
    textAnnotations = textAnnotations.filter(
      t => t.boundingPoly.vertices[2].y - t.boundingPoly.vertices[1].y < 200
    );

    // get list of x coordinates of bottom left corners
    const vals = textAnnotations.map(t => t.boundingPoly.vertices[3].x);

    // number of histogram subdivisions
    const BUCKETS = 100;
    const hist = Array(BUCKETS).fill(0);

    // calculate the histogram
    vals.forEach(v => hist[Math.floor((v / PAGE_WIDTH) * BUCKETS)]++);

    // get the top three and their x positions
    const topThree = hist
      .map((a, i) => ({ pos: (i * PAGE_WIDTH) / BUCKETS, n: a }))
      .sort((a, b) => b.n - a.n)
      .slice(0, 3)
      .sort((a, b) => a.pos - b.pos);

    const RIGHT_OFFSET = 30;
    const RIGHT_OFFSET_2 = 45;

    if (context) {
      context.save();
      topThree.forEach(t => {
        context.strokeStyle = 'green';
        context.strokeRect(t.pos, 0, PAGE_WIDTH / BUCKETS, 1947);
        context.strokeStyle = 'blue';
        context.strokeRect(t.pos - RIGHT_OFFSET, 0, 2 * RIGHT_OFFSET, 1947);
        context.strokeRect(t.pos + RIGHT_OFFSET_2, 0, 1, 1947);
      });
      context.restore();
    }

    // see what letter this page is with a histogram
    let letterHist = {};
    textAnnotations.forEach(({ description: text }) => {
      if (letterHist[text[0].toLowerCase()] === undefined)
        letterHist[text[0].toLowerCase()] = 1;
      else letterHist[text[0].toLowerCase()]++;
    });
    // sort the histogram by count of the letter and get the top
    // letter that most (all) of the words start with
    const letter = Object.entries(letterHist).sort((a, b) => b[1] - a[1])[0][0];

    let topThreeCount = [0, 0, 0];

    /**
     * Filter all the text for ones that have a lower line (made up of the bottom
     * 2 corners of the bounding box) that intersects one of the 3 lines.
     * The 3 lines are the 3 columns of the text.
     * RIGHT_OFFSET is added to the x position to shift it left slightly.
     */
    let errors = [];
    const filtered = topThree.flatMap(({ pos }, i) => {
      const done = textAnnotations.filter(
        ({ boundingPoly: { vertices: v } }) =>
          (v[2].x > pos + RIGHT_OFFSET && v[3].x < pos + RIGHT_OFFSET) ||
          (v[2].x > pos + RIGHT_OFFSET_2 && v[3].x < pos + RIGHT_OFFSET_2)
      );
      topThreeCount[i] = done.length;
      // try to fix words that surpass the RIGHT_OFFSET to the left
      done
        .sort(
          (a, b) => a.boundingPoly.vertices[0].y - b.boundingPoly.vertices[0].y
        )
        .forEach(({ boundingPoly: { vertices: v }, description: text }, i) => {
          if (text === undefined) return;
          if (confusables) {
            text = text
              .split('')
              .map(l => {
                if (l.charCodeAt(0) > 125) {
                  let b16 = l
                    .charCodeAt(0)
                    .toString(16)
                    .padStart(4, '0')
                    .toUpperCase();
                  if (b16 in confusables) {
                    return String.fromCharCode(parseInt(confusables[b16], 16));
                  } else {
                    // console.log('err: ', b16, l, l.charCodeAt(0), text);
                    return l;
                  }
                } else return l;
              })
              .join('');
            done[i].description = text;
          }

          if (
            (v[2].x > pos - RIGHT_OFFSET && v[3].x < pos - RIGHT_OFFSET) ||
            text[0].toLowerCase() !== letter
          ) {
            let prev, next;
            if (i > 0) {
              // if prev also an error, use prev of that
              if (
                errors.map(e => e.original).includes(done[i - 1].description) &&
                i > 1
              )
                prev = done[i - 2].description;
              else prev = done[i - 1].description;
            }
            if (i < done.length - 1) {
              // if next also an error, use next of that
              if (
                i < done.length - 2 &&
                ((done[i + 1].boundingPoly.vertices[2].x > pos - RIGHT_OFFSET &&
                  done[i + 1].boundingPoly.vertices[3].x <
                    pos - RIGHT_OFFSET) ||
                  done[i + 1].description[0].toLowerCase() !== letter)
              )
                next = done[i + 2].description;
              else next = done[i + 1].description;
            }

            const fixResult = tryFix(text, prev, next);
            errors.push(fixResult);
            if (fixResult.fixed) done[i].description = fixResult.fixed;
            done[i].error = fixResult;

            if (context) {
              context.save();
              // fixed it, display green box; unable to fix it, display a red box
              context.strokeStyle =
                fixResult.fixed === undefined ? 'red' : 'green';
              context.lineWidth = 5;
              context.beginPath();
              context.moveTo(v[0].x - 10, v[0].y - 10);
              context.lineTo(v[1].x + 10, v[1].y - 10);
              context.lineTo(v[2].x + 10, v[2].y + 10);
              context.lineTo(v[3].x - 10, v[3].y + 10);
              context.closePath();
              // TODO: not a todo, but this can be changed to stroke for just an outline
              context.stroke();
              context.restore();
            }
          }
        });
      return done.map(d => ({
        ...d,
        processed: {
          ...(d.error ? { error: d.error } : {}),
          text: d.description,
          x: pos,
          y:
            d.boundingPoly.vertices.map(v => v.y).reduce((a, b) => a + b) /
            d.boundingPoly.vertices.length,
        },
      }));
    });

    return { filtered, errors, columns: topThreeCount };
  }

  // try to fix the error by removing extra letters before the string until it fits lexicographically
  function tryFix(text, before, after) {
    // don't even bother try fixing if it is the first or last word on the page
    if (before === undefined || after === undefined) {
      return {
        original: text,
        unfixed: 'first or last word',
      };
    }

    let cur = text;
    // while the substring is not yet in order
    while (
      !(cur.localeCompare(before) === 1 && cur.localeCompare(after) === -1) &&
      cur.length > 0
    )
      // remove another letter from the start of the string
      cur = cur.slice(1);

    // if it is still not in order
    if (!(cur.localeCompare(before) === 1 && cur.localeCompare(after) === -1)) {
      return { original: text, unfixed: 'unable to fix' };
    }

    return { original: text, fixed: cur };
  }

  exports.histFilter = histFilter;
})(typeof exports === 'undefined' ? window : exports);
