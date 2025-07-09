const flat = require('./flat');

const mainline = (sloppyPgn) => {
  const flatMoments = flat(sloppyPgn);

  // Only return the mainline moments
  const mainlineMoments = flatMoments.filter((move) => {
    return move.depth === 1 && (move.move || move.index === 0);
  });

  return mainlineMoments;
};

module.exports = mainline;
