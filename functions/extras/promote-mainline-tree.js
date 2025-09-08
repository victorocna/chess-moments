const { flatten } = require('lodash');
const promoteMainline = require('./promote-mainline');
const { makeTree } = require('../helpers');

const promoteMainlineTree = (moments, current) => {
  try {
    const isNested = moments.length > 0 && Array.isArray(moments[0]);
    if (!isNested) {
      return moments;
    }

    // Flatten nested array
    const flatMoments = flatten(moments);
    const newMoments = promoteMainline(flatMoments, current);

    // Group by consecutive depth sequences
    return makeTree(newMoments);
  } catch {
    // In case of any error, return the original moments array
    return moments;
  }
};

module.exports = promoteMainlineTree;
