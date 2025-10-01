const { isEmpty } = require('lodash');
const fen = require('../fen');
const { getBrushCode } = require('../helpers');

/**
 * Converts chess moments back to PGN format
 * @param {Array} moments - Array of chess moment objects
 * @returns {String} PGN string
 */
const momentsToPgn = (moments) => {
  let pgn = '';

  // Return empty PGN if no moments are provided
  if (isEmpty(moments)) {
    pgn += `[SetUp "1"]\n`;
    pgn += `[FEN "${fen.initial}"]\n\n`;
    pgn += '*';
    return pgn;
  }

  let currentDepth = 1;
  let variationStack = [];

  const headers = moments[0].headers;
  const standardHeaders = [
    'Event',
    'Site',
    'Date',
    'Round',
    'White',
    'Black',
    'Result',
  ];

  if (headers) {
    // Add standard headers (excluding placeholder values)
    for (const key of standardHeaders) {
      if (
        headers[key] &&
        headers[key] !== '?' &&
        headers[key] !== '????.??.??'
      ) {
        pgn += `[${key} "${headers[key]}"]\n`;
      }
    }

    // Add custom headers
    for (const key in headers) {
      if (!standardHeaders.includes(key) && key !== 'FEN' && key !== 'SetUp') {
        pgn += `[${key} "${headers[key]}"]\n`;
      }
    }
  }

  // Add SetUp and FEN headers
  const setUp = headers?.SetUp || '1';
  const fenString = headers?.FEN || moments[0].fen;

  pgn += `[SetUp "${setUp}"]\n`;
  pgn += `[FEN "${fenString}"]\n\n`;

  for (let i = 0; i < moments.length; i++) {
    const moment = moments[i];
    const depth = moment.depth || 1;

    // Handle moments without moves (initial position or variation breaks)
    if (!moment.move) {
      // If this is a variation marker (depth > 1) and not the initial position
      if (depth > 1 && i > 0) {
        // First, close any deeper variations if we're going to a shallower depth
        while (currentDepth > depth) {
          variationStack.pop();
          pgn += ')';
          currentDepth--;
        }

        // Check if we need to start a new variation at the same depth
        if (depth === currentDepth) {
          // Close current variation and start a new one at the same level
          pgn += ') (';
        } else if (depth > currentDepth) {
          // Starting a new variation at a deeper level
          variationStack.push(currentDepth);
          pgn += ' (';
          currentDepth = depth;
        }
      }

      // Add initial comment if present
      if (moment.comment) {
        pgn += `{${moment.comment}} `;
      }
      continue;
    }

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

    // Add suffix if present
    if (moment.suffix) {
      pgn += moment.suffix;
    }

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

  // Add result from headers if available, otherwise default to *
  pgn += ` ${headers?.Result || '*'}`;

  return pgn.trim();
};

module.exports = momentsToPgn;
