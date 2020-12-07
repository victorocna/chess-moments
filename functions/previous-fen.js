/**
 * Find previous FEN from history
 *
 * @param {Map} history
 * @param {Number} currentDepth
 * @param {Number} previousDepth
 */
module.exports = (history, currentDepth, previousDepth) => {
  try {
    const sameLevel = currentDepth === previousDepth;
    const fromMainline = currentDepth > previousDepth;
    const fromSubvariant = currentDepth < previousDepth;

    if (sameLevel) {
      return history.get(previousDepth - 1)[0];
    }
    if (fromMainline) {
      return history.get(previousDepth)[0];
    }
    if (fromSubvariant) {
      return history.get(currentDepth)[1];
    }

    throw new Error('Cannot find previous FEN');
  } catch (err) {
    return '8/8/8/8/8/8/8/8 w - - 0 1';
  }
};
