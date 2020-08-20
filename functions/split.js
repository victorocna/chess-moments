const encode = require('./encode');

/**
 * Returns one-dimensional array of variations and corresponding depth
 * @param {string} pgn
 */
module.exports = (pgn) => {
  let depth = 0;
  const moves = pgn.split('\n\n').pop();
  const encoded = encode(moves);
  const variations = encoded.split('(').map((mixedMoves) => {
    depth++;
    return mixedMoves.split(')').map((moves, i) => {
      i > 0 && depth--;
      return { depth, moves: moves.trim() };
    });
  });

  // flatten array and exclude variations without moves
  const flatten = [].concat.apply([], variations);

  return flatten.filter(({ moves }) => moves);
};
