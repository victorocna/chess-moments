/**
 * FEN history for the given depth
 *
 * @param {Array} moments
 * @param {Map} history
 * @param {Number} depth
 */
module.exports = (moments, history, depth) => {
  const fens = moments
    .slice(Math.max(moments.length - 2, 0))
    .map(({ fen }) => fen);

  if (fens.length === 2) {
    return fens;
  }

  // add first item from a lower depth
  const one = history.get(depth - 1);
  if (one && one.length > 0) {
    fens.unshift(one[0]);
  }

  const two = history.get(depth);
  if (two && two.length > 0) {
    fens.unshift(two[1]);
  }

  return fens;
};
