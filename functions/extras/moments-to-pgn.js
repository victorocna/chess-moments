const fen = require('../fen');

/**
 * Converts chess moments back to PGN format
 * @param {Array} moments - Array of chess moment objects
 * @returns {String} PGN string
 */
const momentsToPgn = (moments) => {
  if (!Array.isArray(moments) || moments.length === 0) {
    return '';
  }

  let pgn = '';
  let currentDepth = 1;
  let variationStack = [];

  // Check if we need to add FEN headers for non-standard starting position
  const initialMoment = moments[0];
  if (initialMoment && initialMoment.fen && initialMoment.fen !== fen.initial) {
    pgn += `[SetUp "1"]\n`;
    pgn += `[FEN "${initialMoment.fen}"]\n\n`;
  }

  for (let i = 0; i < moments.length; i++) {
    const moment = moments[i];

    // Skip moments without moves (initial position or variation breaks)
    if (!moment.move) {
      // Add initial comment if present
      if (moment.comment) {
        pgn += `{${moment.comment}} `;
      }
      continue;
    }

    const depth = moment.depth || 1;

    // Determine who made this move and what move number it is from the FEN
    const fenParts = moment.fen.split(' ');
    const activeColorAfterMove = fenParts[1]; // 'w' or 'b' - who moves next
    const fullmoveNumber = parseInt(fenParts[5]);

    // If black is to move after this move, then white made this move
    const moveWasByWhite = activeColorAfterMove === 'b';
    // For white moves, the move number is the fullmove number
    // For black moves, the move number is fullmove number - 1 (since fullmove increments after black's move)
    const moveNumber = moveWasByWhite ? fullmoveNumber : fullmoveNumber - 1;

    // Handle depth changes (variations)
    if (depth > currentDepth) {
      // Starting a new variation
      variationStack.push(currentDepth);
      pgn += ' (';
      currentDepth = depth;
    } else if (depth < currentDepth) {
      // Ending variation(s) - close as many as needed to get to the right depth
      while (currentDepth > depth) {
        variationStack.pop();
        pgn += ')';
        currentDepth--;
      }
      if (pgn.endsWith(')')) {
        pgn += ' ';
      }
    }

    // Add move number for white moves or when starting a variation
    if (moveWasByWhite || (depth > 1 && pgn.endsWith('('))) {
      pgn += `${moveNumber}.`;
      if (!moveWasByWhite) {
        pgn += '..';
      }
      pgn += ' ';
    }

    // Add the move
    pgn += moment.move;

    // Add comment if present
    if (moment.comment) {
      pgn += ` {${moment.comment}}`;
    }

    // Add shapes if present
    if (moment.shapes && moment.shapes.length > 0) {
      let shapesComment = '';
      const squareHighlights = moment.shapes.filter(
        (s) => !s.dest || s.dest === ']'
      );
      const arrows = moment.shapes.filter((s) => s.dest && s.dest !== ']');

      if (squareHighlights.length > 0) {
        const coloredSquares = squareHighlights
          .map((s) => {
            const colorCode = getBrushCode(s.brush);
            return `${colorCode}${s.orig}`;
          })
          .join(',');
        shapesComment += `[%csl ${coloredSquares}]`;
      }

      if (arrows.length > 0) {
        const coloredArrows = arrows
          .map((s) => {
            const colorCode = getBrushCode(s.brush);
            return `${colorCode}${s.orig}${s.dest}`;
          })
          .join(',');
        if (shapesComment) shapesComment += ' ';
        shapesComment += `[%cal ${coloredArrows}]`;
      }

      if (shapesComment) {
        if (moment.comment) {
          // If there's already a comment, add shapes to it
          pgn = pgn.replace(/\{([^}]*)\}$/, `{$1 ${shapesComment}}`);
        } else {
          pgn += ` {${shapesComment}}`;
        }
      }
    }

    // Add space after move if not the last move
    if (i < moments.length - 1) {
      const nextMoment = moments[i + 1];
      if (nextMoment && nextMoment.move) {
        pgn += ' ';
      }
    }
  }

  // Close any remaining variations
  while (variationStack.length > 0) {
    variationStack.pop();
    pgn += ')';
  }

  // Add default result
  pgn += ' *';

  return pgn.trim();
};

/**
 * Convert brush color name to PGN color code
 */
function getBrushCode(brush) {
  const brushCodes = {
    green: 'G',
    red: 'R',
    blue: 'B',
    yellow: 'Y',
  };
  return brushCodes[brush] || 'G';
}

module.exports = momentsToPgn;
