const matchesFen = require('./matches-fen');

/**
 * Find previous FEN from history
 *
 * @param {Map} history
 * @param {String} moves
 * @param {Number} currentDepth
 * @param {Number} previousDepth
 */
const previousFen = (history, moves, currentDepth, previousDepth) => {
  try {
    const sameLevel = currentDepth === previousDepth;
    const fromMainline = currentDepth > previousDepth;

    if (sameLevel) {
      return history.get(previousDepth - 1)[0];
    }
    if (fromMainline) {
      return history.get(previousDepth)[0];
    }

    const currentHistory = history.get(currentDepth);
    if (Array.isArray(currentHistory) && currentHistory.length > 0) {
      // try the first candidate from the current depth
      const candidate = currentHistory[0];
      if (matchesFen(moves, candidate)) {
        return candidate;
      }

      // try the second candidate from the current depth
      const second = currentHistory[1];
      if (matchesFen(moves, second)) {
        return second;
      }
    }

    return previousFen(history, moves, currentDepth - 1, previousDepth);
  } catch (err) {
    return '';
  }
};

module.exports = previousFen;
