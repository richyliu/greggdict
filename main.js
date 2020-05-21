(function(exports) {
  const PAGE_WIDTH = 1250;

  // remove extraneous text and do correction on the text
  // optionally draw lines if given canvas context
  function histFilter(textAnnotations, context) {
    // remove the first entry and remove the page number
    textAnnotations = textAnnotations
      .slice(1)
      .filter(a => !/^\d{2,3}$/.test(a.description));

    // remove text that are too small
    textAnnotations = textAnnotations.filter(t => t.description.length > 1);

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
      .slice(0, 3);

    const RIGHT_OFFSET = 30;

    if (context) {
      context.save();
      topThree.forEach(t => {
        context.strokeStyle = 'green';
        line(t.pos, 0, t.pos, 1947);
        line(
          t.pos + PAGE_WIDTH / BUCKETS,
          0,
          t.pos + PAGE_WIDTH / BUCKETS,
          1947
        );
        context.strokeStyle = 'blue';
        line(t.pos - RIGHT_OFFSET, 0, t.pos - RIGHT_OFFSET, 1947);
        line(t.pos + RIGHT_OFFSET, 0, t.pos + RIGHT_OFFSET, 1947);
      });
      context.restore();
    }

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
          v[2].x > pos + RIGHT_OFFSET && v[3].x < pos + RIGHT_OFFSET
      );
      // try to fix words that surpass the RIGHT_OFFSET to the left
      done
        .sort(
          (a, b) => a.boundingPoly.vertices[0].y - b.boundingPoly.vertices[0].y
        )
        .forEach(({ boundingPoly: { vertices: v }, description: text }, i) => {
          if (v[2].x > pos - RIGHT_OFFSET && v[3].x < pos - RIGHT_OFFSET) {
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
                done[i + 1].boundingPoly.vertices[2].x > pos - RIGHT_OFFSET &&
                done[i + 1].boundingPoly.vertices[3].x < pos - RIGHT_OFFSET &&
                i < done.length - 2
              )
                next = done[i + 2].description;
              else next = done[i + 1].description;
            }

            errors.push(tryFix(text, prev, next));
          }
        });
      return done;
    });

    return { filtered, errors };
  }

  // try to fix the error by removing extra letters before the string until it fits lexicographically
  function tryFix(text, before, after) {
    // don't even bother try fixing if it is the first or last word on the page
    if (before === undefined || after === undefined) {
      return {
        original: text,
        unfixed: 'Unfixed because it is the first or last word on the page',
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

    // console.log(text, cur, before, after);
    // if it is still not in order
    if (!(cur.localeCompare(before) === 1 && cur.localeCompare(after) === -1)) {
      return { original: text, unfixed: 'Unfixed because unable to fix it' };
    }

    return { original: text, fixed: cur };
  }

  exports.histFilter = histFilter;
})(typeof exports === 'undefined' ? window : exports);
