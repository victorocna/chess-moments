/**
 * Converts a flat array of moments into a tree structure.
 */
const makeTree = (moments) => {
  if (!Array.isArray(moments) || moments.length === 0) {
    return [];
  }

  const tree = [];
  for (const item of moments) {
    // Check if the current object does NOT have the 'move' property.
    const isSplitPoint = !('move' in item);

    if (isSplitPoint) {
      // If it's a split point, we start a new sub-array.
      tree.push([item]);
    } else {
      if (tree.length === 0) {
        tree.push([]);
      }
      // Add the item to the last sub-array in the result.
      tree[tree.length - 1].push(item);
    }
  }

  return tree;
};

module.exports = makeTree;
