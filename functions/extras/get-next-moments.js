const { getMoveNumber } = require('../helpers');

/**
 * Always returns an array because there can be more than one next moment
 */
const getNextMoments = (moments, current) => {
  try {
    const next = [];

    // If it's the first moment without move, add the next moment
    if (current.index === 0 && !current.move) {
      return [moments[1]];
    }

    // Get next moments for further processing
    const nextIndex = moments.indexOf(current) + 1;
    const nextMoment = moments[nextIndex];
    const nextNextMoment = moments[nextIndex + 1];

    // Early returns for edge cases
    if (!nextMoment) {
      return [];
    }

    // Last move of a sideline should not have any next moves
    if (
      !nextMoment?.move &&
      current.depth >= nextMoment.depth &&
      getMoveNumber(nextMoment.fen) <= getMoveNumber(current.fen)
    ) {
      return [];
    }

    // Add the next moment if it has a move and is at the same depth
    if (nextMoment.move && current.depth === nextMoment.depth) {
      next.push(nextMoment);
    }

    // Return early if we have consecutive moves or no next next moment
    if (!nextNextMoment || (nextMoment?.move && nextNextMoment?.move)) {
      return next;
    }

    // Second to last move of a sideline should not have any next moves
    if (
      nextMoment?.move &&
      !nextNextMoment?.move &&
      current.depth >= nextNextMoment.depth &&
      getMoveNumber(nextNextMoment.fen) <= getMoveNumber(current.fen)
    ) {
      return next;
    }

    // Remove all next moments until depth equals current.depth when next moment does not have a move
    if (!nextMoment?.move) {
      const filteredMoments = moments.filter((moment, index) => {
        return index <= nextIndex || moment.depth === current.depth;
      });
      moments = filteredMoments;
    }

    // Add fullmove number to the current moment
    current.fullmove = Number(current.fen.split(' ')[5]);

    // Active color after current move (who moves next)
    const activeColorAfterCurrent = current.fen.split(' ')[1];

    // Process moments in order and stop when we leave the current branch
    for (const moment of moments) {
      // Skip moments that are at or before the current moment's index
      if (moment.index <= current.index + 1) {
        continue;
      }
      // Stop if we hit a moment with lower depth (we've left this branch)
      if (moment.depth < current.depth) {
        break;
      }
      // Skip moments without moves
      if (!moment.move) {
        continue;
      }
      // Only consider moments at current depth or one level deeper
      if (moment.depth > current.depth + 1) {
        continue;
      }

      const activeColorAfterMoment = moment.fen.split(' ')[1];
      const fullmove = Number(moment.fen.split(' ')[5]);

      // Only consider moments within the valid move range
      if (fullmove > current.fullmove + 1) {
        continue;
      }

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
