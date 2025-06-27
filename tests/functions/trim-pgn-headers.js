/**
 * Helper function to trim PGN headers and return only the moves
 * @param {string} pgn - The PGN string with potential headers
 * @returns {string} - The PGN string with only moves (no headers)
 */
function trimPgnHeaders(pgn) {
  let lines;
  if (typeof pgn === 'string') {
    lines = pgn.split('\n');
  } else if (Array.isArray(pgn)) {
    lines = pgn;
  } else {
    throw new Error('Unsupported PGN type');
  }

  // Split the PGN into lines
  const moveLines = [];
  let inMoveSection = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip empty lines before moves start
    if (!trimmedLine && !inMoveSection) {
      continue;
    }

    // Skip header lines (lines that start with [ and end with ])
    if (trimmedLine.startsWith('[') && trimmedLine.endsWith(']')) {
      continue;
    }

    // If we encounter a non-header, non-empty line, we're in the move section
    if (trimmedLine && !trimmedLine.startsWith('[')) {
      inMoveSection = true;
      moveLines.push(trimmedLine);
    }

    // If we're in the move section and encounter an empty line, keep it
    if (inMoveSection && !trimmedLine) {
      moveLines.push('');
    }
  }

  // Join the move lines and clean up extra whitespace
  return moveLines.join(' ').replace(/\s+/g, ' ').trim();
}

module.exports = trimPgnHeaders;
