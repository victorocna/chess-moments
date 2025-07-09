const makeMoments = require('./make-moments');

const mainline = (sloppyPgn) => {
  const moments = makeMoments(sloppyPgn);

  let index = 0;
  for (const lines of moments) {
    for (const moment of lines) {
      moment.index = index;
      index++;
    }
  }

  // Only return the mainline moments
  const mainlineMoments = moments.filter((move) => {
    return move.depth === 1 && (move.move || move.index === 0);
  });

  return mainlineMoments;
};

module.exports = mainline;
