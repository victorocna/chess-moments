const { flatten } = require('lodash');
const splitByMoveIndex = require('./split-by-move');
const tree = require('./tree');

const train = (sloppyPgn, fen) => {
  // Tree is an array of array depths
  const moments = tree(sloppyPgn);

  // Similar structure to the tree, but with only the training data
  const training = [];

  // Remove sidelines (depth > 1) when no move index is specified
  if (!fen) {
    for (const innerArray of moments) {
      const hasDepth = innerArray.filter((moment) => moment.depth === 1);
      if (hasDepth.length) {
        training.push(innerArray);
      }
    }
    return training;
  }

  // Get the current move from the move index
  const current = flatten(moments).find((moment) => moment.fen === fen);

  // Split the moments into two groups
  const { before, after } = splitByMoveIndex(moments, current);
  for (const innerArray of before) {
    training.push(innerArray);
  }

  // Only future moves remaining
  for (const innerArray of after) {
    // Remove every inner array with a depth not equal than the depth of the move index
    const filtered = innerArray.filter((moment) => {
      return moment.depth === current.depth;
    });

    // Add hidden prop to filtered moves with index greater than the move index
    filtered.forEach((moment) => {
      if (moment.index > current.index) {
        moment.hidden = true;
        // Also remove comments and shapes for hidden moves
        delete moment.comment;
        delete moment.shapes;
      }
    });

    training.push(filtered);
  }

  return training;
};

module.exports = train;
