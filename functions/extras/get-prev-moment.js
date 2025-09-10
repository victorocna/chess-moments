/**
 * Always returns an object because there can be only one previous moment
 */
const getPrevMoment = (moments, current) => {
  try {
    const currentIndex = moments.findIndex((item) => item.fen === current.fen);

    const sameDepth = moments[currentIndex - 1];
    if (sameDepth.move && sameDepth.depth === current.depth) {
      return sameDepth;
    }

    // If it's the first moment with move, return the previous moment (starting position)
    if (current.index === 1 && current.move) {
      return moments[0];
    }

    // If previous moment does not have a move and it's the initial position, return it
    const prevMoments = moments[currentIndex - 1];
    if (!prevMoments?.move && prevMoments.fen === moments[0].fen) {
      return moments[0];
    }

    // Split moments until the current index
    const moves = moments.slice(0, currentIndex).filter((m) => m.move);

    // Add fullmove number to the current moment
    current.fullmove = Number(current.fen.split(' ')[5]);

    // Active color is white
    if (current.fen.split(' ')[1] === 'w') {
      // Traverse moves in reverse order to optimize search
      for (let i = moves.length - 1; i >= 0; i--) {
        const moment = moves[i];
        const activeColor = moment.fen.split(' ')[1];
        const fullmove = Number(moment.fen.split(' ')[5]);

        if (
          (moment.depth === current.depth - 1 ||
            moment.depth === current.depth) &&
          activeColor === 'b' &&
          fullmove === current.fullmove - 1
        ) {
          return moment;
        }
      }
    }

    // Active color is black
    if (current.fen.split(' ')[1] === 'b') {
      // Traverse moves in reverse order to optimize search
      for (let i = moves.length - 1; i >= 0; i--) {
        const moment = moves[i];
        const activeColor = moment.fen.split(' ')[1];
        const fullmove = Number(moment.fen.split(' ')[5]);

        if (
          (moment.depth === current.depth - 1 ||
            moment.depth === current.depth) &&
          activeColor === 'w' &&
          fullmove === current.fullmove
        ) {
          return moment;
        }
      }
    }

    // If no previous moment is found, return an empty object
    return {};
  } catch {
    return {};
  }
};

module.exports = getPrevMoment;
