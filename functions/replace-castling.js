/**
 * Replace wrong notation for castling
 * @param {String} pgn
 */
module.exports = (pgn) => {
  if (~pgn.indexOf('0-0-0')) {
    pgn = pgn.split('0-0-0').join('O-O-O');
  }
  if (~pgn.indexOf('0-0')) {
    pgn = pgn.split('0-0').join('O-O');
  }

  return pgn;
};
