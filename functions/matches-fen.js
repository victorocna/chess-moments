/**
 * Checks the first move in the PGN string to match the FEN
 *
 * @param {String} pgn Any PGN string
 * @param {String} fen Any FEN string
 */
module.exports = (pgn, fen) => {
  const fenParts = fen.split(' ');
  const fenNextColor = fenParts[1];
  const fenMoveCount = fenParts[5];

  const pgnParts = pgn.split(' ')[0];
  const pgnNextColor = pgnParts.includes('...') ? 'b' : 'w';
  const pgnMoveCount = pgnParts.match(/[0-9]+/)[0];

  return fenNextColor === pgnNextColor && fenMoveCount === pgnMoveCount;
};
