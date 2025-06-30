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
    let moves = moments.slice(currentIndex + 1).filter((m) => m.move);

    // If the immediate next moment has increased depth, filter out all moments until depth returns to current
    if (moves.length > 0 && moves[0].depth > current.depth) {
      let foundReturnToCurrentDepth = false;
      moves = moves.filter((moment) => {
        if (foundReturnToCurrentDepth) {
          return true; // Keep all moments after we return to current depth
        }
        if (moment.depth === current.depth) {
          foundReturnToCurrentDepth = true;
          return true; // Keep this moment and all following
        }
        return false; // Skip moments with increased depth
      });
    }

    // Add fullmove number to the current moment
    current.fullmove = Number(current.fen.split(' ')[5]);

    // Active color after current move (who moves next)
    const activeColorAfterCurrent = current.fen.split(' ')[1];

    for (const moment of moves) {
      // Only process main line and immediate variations
      if (moment.depth > current.depth + 1) {
        continue;
      }

      const activeColorAfterMoment = moment.fen.split(' ')[1];
      const fullmove = Number(moment.fen.split(' ')[5]);

      // Check if this is a valid next move based on color and fullmove
      const isValidWhiteMove =
        activeColorAfterCurrent === 'w' &&
        activeColorAfterMoment === 'b' &&
        fullmove === current.fullmove;

      const isValidBlackMove =
        activeColorAfterCurrent === 'b' &&
        activeColorAfterMoment === 'w' &&
        fullmove === current.fullmove + 1;

      // If the move is valid, add it to the next moments
      if (isValidWhiteMove || isValidBlackMove) {
        next.push(moment);
      }
    }

    return next;
  } catch {
    return [];
  }
};

module.exports = getNextMoments;
