const matchesFen = require('./matches-fen');

/**
 * Find previous FEN from history
 *
 * @param {Map} history
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

    const index = (previousDepth - currentDepth) % 2;
    const candidate = history.get(currentDepth)[index];
    if (matchesFen(moves, candidate)) {
      return candidate;
    }

    return previousFen(history, moves, currentDepth - 1, previousDepth);
  } catch (err) {
    return false;
  }
};

module.exports = previousFen;
