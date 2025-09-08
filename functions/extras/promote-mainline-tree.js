const { groupBy, flatten } = require('lodash');
const promoteMainline = require('./promote-mainline');

const promoteMainlineTree = (moments, current) => {
  try {
    const isNested = moments.length > 0 && Array.isArray(moments[0]);
    if (!isNested) {
      return moments;
    }

    // Flatten nested array
    const flatMoments = flatten(moments);
    const newMoments = promoteMainline(flatMoments, current);

    // Regroup by depth into a nested array
    const grouped = groupBy(newMoments, 'depth');
    return Object.values(grouped);
  } catch {
    // In case of any error, return the original moments array
    return moments;
  }
};

module.exports = promoteMainlineTree;
