const { flatten } = require('lodash');
const { insertMomentIntoTree } = require('../helpers');

const addMomentToTree = (tree, newMoment) => {
  if (!newMoment || !newMoment.san || !newMoment.before) {
    return tree;
  }

  const flat = flatten(tree);
  // Check if moment FEN already exists in the tree
  if (flat.some((moment) => moment.fen === newMoment.after)) {
    return tree;
  }

  // Find the appropriate position to insert the moment
  let point = null;

  // Look for the position where this moment should be inserted
  // by finding the moment with matching "before" FEN at any depth
  for (let lineIndex = 0; lineIndex < tree.length; lineIndex++) {
    const line = tree[lineIndex];

    for (let momentIndex = 0; momentIndex < line.length; momentIndex++) {
      const existingMoment = line[momentIndex];

      // If we find a moment with the same "before" FEN, this is where we branch
      if (existingMoment.fen === newMoment.before) {
        // Check if there's already a move after this position in the same line
        const nextMomentInLine = line[momentIndex + 1];

        if (nextMomentInLine && nextMomentInLine.move) {
          // There's already a move after this position, so create a new sideline
          point = {
            type: 'newLine',
            afterLineIndex: lineIndex,
            branchMomentIndex: momentIndex,
          };
        } else {
          // No move after this position, so continue in the same line
          point = { type: 'sameLine', lineIndex, momentIndex: momentIndex + 1 };
        }
        break;
      }
    }

    // If we found an insertion point, no need to continue searching
    if (point) {
      break;
    }
  }

  // Insert the moment into the tree
  const newTree = insertMomentIntoTree(tree, point, newMoment);

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
