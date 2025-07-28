const { flatten } = require('lodash');
const { prepareMoment } = require('../helpers');

const addMomentToTree = (tree, newMoment) => {
  if (!newMoment || !newMoment.san || !newMoment.before) {
    return tree;
  }

  const flat = flatten(tree);
  // Check if moment FEN already exists in the tree
  if (flat.some((moment) => moment.fen === newMoment.after)) {
    return tree;
  }

  // Create a new tree (don't mutate the original) - deep copy
  const newTree = tree.map((line) => line.map((m) => ({ ...m })));

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
        // Insert after this moment in the same line, with the same depth
        insertionPoint = { lineIndex, momentIndex: momentIndex + 1 };
        break;
      }
    }

    if (insertionPoint) break;
  }

  // Prepare the moment to be inserted with only the properties that match normal moments
  const momentToInsert = prepareMoment(newMoment, insertionPoint, newTree);

  if (insertionPoint) {
    // Insert into existing line
    newTree[insertionPoint.lineIndex].splice(
      insertionPoint.momentIndex,
      0,
      momentToInsert
    );
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
