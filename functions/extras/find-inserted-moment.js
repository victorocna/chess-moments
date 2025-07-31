/**
 * Finds the most recently inserted moment in the tree.
 * @param {*} tree - The current tree structure.
 * @returns {Object|null} - The inserted moment or null if none found.
 */
const findInsertedMoment = (tree) => {
  for (const line of tree) {
    for (const moment of line) {
      if (moment.new) {
        return moment;
      }
    }
  }
  return null;
};

module.exports = findInsertedMoment;
