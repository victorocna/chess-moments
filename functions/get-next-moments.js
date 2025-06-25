/**
 * Always returns an array because there can be more than one next moment
 */
const getNextMoments = (moments, current) => {
  try {
    const next = [];
    const sameDepth = moments[moments.indexOf(current) + 1];
    if (sameDepth.move && sameDepth.depth === current.depth) {
      next.push(sameDepth);
    }

    // If it's the first moment without move, add the next moment
    if (current.index === 0 && !current.move) {
      next.push(moments[1]);
    }

    // Split moments after the current index
    const currentIndex = moments.indexOf(current);
    const moves = moments.slice(currentIndex + 1).filter((m) => m.move);

    // Add fullmove number to the current moment
    current.fullmove = Number(current.fen.split(' ')[5]);

    // Active color is white
    if (current.fen.split(' ')[1] === 'w') {
      for (const moment of moves) {
        const activeColor = moment.fen.split(' ')[1];
        const fullmove = Number(moment.fen.split(' ')[5]);

        // Check if the next moment is a valid move for white
        if (
          moment.depth === current.depth + 1 &&
          activeColor === 'b' &&
          fullmove === current.fullmove
        ) {
          next.push(moment);
        }
      }
    }

    // Active color is black
    if (current.fen.split(' ')[1] === 'b') {
      for (const moment of moves) {
        const activeColor = moment.fen.split(' ')[1];
        const fullmove = Number(moment.fen.split(' ')[5]);

        // Check if the next moment is a valid move for black
        if (
          moment.depth === current.depth + 1 &&
          activeColor === 'w' &&
          fullmove === current.fullmove + 1
        ) {
          next.push(moment);
        }
      }
    }

    // If no next moment is found, return an empty array
    return next;
  } catch {
    return [];
  }
};

module.exports = getNextMoments;
