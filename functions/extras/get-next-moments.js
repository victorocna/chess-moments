/**
 * Always returns an array because there can be more than one next moment
 */
const getNextMoments = (moments, current) => {
  try {
    const next = [];

    // If it's the first moment without move, add the next moment
    if (current.index === 0 && !current.move) {
      return moments[1];
    }

    // Split moments after the current index
    const currentIndex = moments.indexOf(current);
    const moves = moments.slice(currentIndex + 1).filter((m) => m.move);

    // Add fullmove number to the current moment
    current.fullmove = Number(current.fen.split(' ')[5]);

    // Active color after current move (who moves next)
    const activeColorAfterCurrent = current.fen.split(' ')[1];

    for (const moment of moves) {
      const activeColorAfterMoment = moment.fen.split(' ')[1];
      const fullmove = Number(moment.fen.split(' ')[5]);

      // Main line continuation (same depth)
      if (moment.depth === current.depth) {
        // If current move results in white to move, find the next white move
        if (activeColorAfterCurrent === 'w') {
          // Look for white's move: after white moves, it's black's turn
          if (activeColorAfterMoment === 'b' && fullmove === current.fullmove) {
            next.push(moment);
          }
        }
        // If current move results in black to move, find the next black move
        else if (activeColorAfterCurrent === 'b') {
          // Look for black's move: after black moves, it's white's turn and fullmove increments
          if (activeColorAfterMoment === 'w' && fullmove === current.fullmove + 1) {
            next.push(moment);
          }
        }
      }

      // Variations (depth + 1)
      else if (moment.depth === current.depth + 1) {
        // If current move results in white to move, find variations for white
        if (activeColorAfterCurrent === 'w') {
          // Look for white's variation: after white moves, it's black's turn
          if (activeColorAfterMoment === 'b' && fullmove === current.fullmove) {
            next.push(moment);
          }
        }
        // If current move results in black to move, find variations for black
        else if (activeColorAfterCurrent === 'b') {
          // Look for black's variation: after black moves, it's white's turn and fullmove increments
          if (activeColorAfterMoment === 'w' && fullmove === current.fullmove + 1) {
            next.push(moment);
          }
        }
      }
    }

    return next;
  } catch {
    return [];
  }
};

module.exports = getNextMoments;
