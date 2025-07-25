const { flatten } = require('lodash');

const addMomentToTree = (tree, newMoment) => {
  if (!newMoment || !newMoment.san || !newMoment.before) {
    return tree;
  }

  const flat = flatten(tree);
  // Check if moment FEN already exists in the tree
  if (flat.some((moment) => moment.fen === newMoment.after)) {
    // If the moment already exists, return the tree unchanged
    return tree;
  }

  // Create a new tree (don't mutate the original) - deep copy
  const newTree = tree.map((line) => line.map((m) => ({ ...m })));

  // Default depth to 1 if not specified
  const targetDepth = newMoment.depth || 1;

  // Find the appropriate position to insert the moment
  let insertionPoint = null;

  // Look for the position where this moment should be inserted
  // by finding the moment with matching "before" FEN at any depth
  for (let lineIndex = 0; lineIndex < newTree.length; lineIndex++) {
    const line = newTree[lineIndex];

    for (let momentIndex = 0; momentIndex < line.length; momentIndex++) {
      const existingMoment = line[momentIndex];

      // If we find a moment with the same "before" FEN, this is where we branch
      if (existingMoment.fen === newMoment.before) {
        // Check if we're adding to the same line (same depth) or creating a new variation
        if (targetDepth === existingMoment.depth) {
          // Insert after this moment in the same line
          insertionPoint = { lineIndex, momentIndex: momentIndex + 1 };
          break;
        } else if (targetDepth > existingMoment.depth) {
          // Create a new variation line starting from this position
          insertionPoint = { lineIndex: -1, momentIndex: 0 }; // New line
          break;
        }
      }
    }

    if (insertionPoint) break;
  }

  // Prepare the moment to be inserted
  const momentToInsert = {
    ...newMoment,
    depth: targetDepth,
    fen: newMoment.after, // The FEN after the move
    move: newMoment.san, // The move in SAN format
  };

  if (insertionPoint) {
    if (insertionPoint.lineIndex === -1) {
      // Create a new variation line
      newTree.push([momentToInsert]);
    } else {
      // Insert into existing line
      newTree[insertionPoint.lineIndex].splice(
        insertionPoint.momentIndex,
        0,
        momentToInsert
      );
    }
  } else {
    // If no matching position found, always create a new line
    // This ensures we don't accidentally add to an unrelated existing line
    newTree.push([momentToInsert]);
  }

  // Reindex all moments
  let globalIndex = 0;
  for (const line of newTree) {
    for (const moment of line) {
      moment.index = globalIndex++;
    }
  }

  return newTree;
};

module.exports = addMomentToTree;
