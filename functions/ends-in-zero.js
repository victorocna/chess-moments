/**
 * Does a FEN end in zero or not
 * @param {String} fen
 */
module.exports = (fen) => {
  try {
    return fen.split(' ').pop() === '0';
  } catch (err) {
    return false;
  }
};
