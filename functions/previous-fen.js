/**
 * Find previous FEN from history
 *
 * @param {Map} history
 * @param {Number} currentDepth
 * @param {Number} previousDepth
 */
module.exports = (history, currentDepth, previousDepth) => {
  try {
    if (currentDepth > previousDepth) {
      return history.get(previousDepth)[0];
    }

    return history.get(currentDepth)[1];
  } catch (err) {
    return '8/8/8/8/8/8/8/8 w - - 0 1';
  }
};
