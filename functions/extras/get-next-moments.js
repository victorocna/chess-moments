const { isNextFen } = require('../helpers');

/**
 * Always returns an array because there can be more than one next moment
 */
const getNextMoments = (moments, current) => {
  try {
    const next = [];

    // Get next moments for further processing
    const nextIndex = moments.indexOf(current) + 1;
    const nextMoment = moments[nextIndex];
    const nextNextMoment = moments[nextIndex + 1];

    // Early returns for edge cases
    if (!nextMoment) {
      return [];
    }

    // Last move of a sideline should not have any next moves
    if (!nextMoment?.move && current.depth >= nextMoment.depth) {
      return [];
    }

    // Return early if there are two consecutive moves at the same depth or if the next next move does not exist
    if (
      current.move &&
      current.depth === nextMoment.depth &&
      (!nextNextMoment || current.depth === nextNextMoment.depth)
    ) {
      return [nextMoment];
    }

    // Remove all moves before the current moment
    moments = moments.filter((moment) => moment.index > current.index);

    // Remove all moments after the first moment that have a lower depth than the current moment
    let filteredMoments = [];
    for (const moment of moments) {
      if (moment.depth < current.depth) {
        break;
      }
      filteredMoments.push(moment);
    }

    // If next moment does not have a move, remove all moments with the depth higher than current depth
    if (!nextMoment.move) {
      filteredMoments = filteredMoments.filter(
        (moment) => moment.depth <= current.depth
      );
    }

    // Finally check for next moments from filtered moments
    for (const moment of filteredMoments) {
      if (moment.move && isNextFen(current.fen, moment.fen)) {
        next.push(moment);
      }
    }

    return next;
  } catch {
    return [];
  }
};

module.exports = getNextMoments;
