/**
 * Prepares a moment object for insertion into the tree.
 * It ensures the moment has the correct properties and depth based on its position.
 * @param {*} tree
 * @param {*} point
 * @param {*} newMoment
 * @returns
 */
const prepareMoment = (tree, point, newMoment) => {
  let targetDepth = newMoment.depth || 1;

  if (point) {
    if (point.type === 'sameLine' && point.lineIndex !== undefined) {
      // Use the depth of the line we're inserting into
      targetDepth = tree[point.lineIndex]?.[0]?.depth || 1;
    } else if (point.type === 'newLine') {
      // For new sidelines, increment the depth from where we're branching
      const branchingLine = tree[point.afterLineIndex];
      const branchingMoment = branchingLine?.[point.branchMomentIndex];
      const branchingDepth = branchingMoment?.depth || 1;
      targetDepth = branchingDepth + 1;
    }
  }

  return {
    depth: targetDepth,
    fen: newMoment.after,
    move: newMoment.san,
    from: newMoment.from,
    to: newMoment.to,
  };
};

module.exports = prepareMoment;
