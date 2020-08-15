const endsInZero = require('./ends-in-zero');
const replaceLastZero = require('./replace-last-zero');

module.exports = (fen) => {
  if (endsInZero(fen)) {
    return replaceLastZero(fen);
  }

  return fen;
};
