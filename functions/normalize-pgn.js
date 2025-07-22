const castle = require('./replace-castling');

module.exports = (pgn) => {
  let processedPgn = null;

  if (typeof pgn === 'string') {
    processedPgn = castle(pgn.trim());
  } else if (Array.isArray(pgn)) {
    processedPgn = castle(pgn.join('\n').trim());
  } else {
    throw new Error('Unsupported PGN type');
  }

  // Remove newlines from comments delimited by curly braces
  processedPgn = processedPgn.replace(/\{[^}]*\}/g, (match) => {
    return match.replace(/\n/g, '\\n');
  });

  // Merge adjacent comments delimited by {}
  processedPgn = processedPgn.replace(/(\}\s*\{)+/g, ' ');

  return processedPgn;
};
