const castle = require('./replace-castling');

module.exports = (pgn) => {
  if (typeof pgn === 'string') {
    return castle(pgn.trim());
  }

  if (Array.isArray(pgn)) {
    return castle(pgn.join('\n').trim());
  }

  throw new Error('Unsupported PGN type');
};
