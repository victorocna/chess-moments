module.exports = (pgn) => {
  if (typeof pgn === 'string') {
    return pgn.trim();
  }

  if (Array.isArray(pgn)) {
    return pgn.join('\n').trim();
  }

  throw new Error('Unsupported PGN type');
};
