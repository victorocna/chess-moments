const { flatten } = require('lodash');
const splitByMoveIndex = require('./split-by-move-index');
const tree = require('./tree');

const train = (sloppyPgn, moveIndex) => {
  // Tree is an array of array depths
  const moments = tree(sloppyPgn);

  // Similar structure to the tree, but with only the training data
  const training = [];

  // Remove sidelines (depth > 1) when no move index is specified
  if (!moveIndex) {
    for (const innerArray of moments) {
      const hasDepth = innerArray.filter((moment) => moment.depth === 1);
      if (hasDepth.length) {
        training.push(innerArray);
      }
    }
    return training;
  }

  // Split the moments into two groups
  const { before, after } = splitByMoveIndex(moments, moveIndex);
  for (const innerArray of before) {
    training.push(innerArray);
  }

  // Get the current move from the move index
  const current = flatten(moments).find((moment) => moment.index === moveIndex);

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
      }
    });

    training.push(filtered);
  }

  return training;
};

module.exports = train;
