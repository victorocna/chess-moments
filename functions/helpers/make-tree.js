const buildMoment = require('../build-moment');

/**
 * Groups an array of moments by consecutive depth sequences.
 * When the depth changes from one moment to the next, a new group is started.
 * Additionally, adds position marker objects (without move key) when depth changes.
 */
const makeTree = (moments) => {
  if (!Array.isArray(moments) || moments.length === 0) {
    return [];
  }

  const grouped = [];
  let currentGroup = [];
  let lastDepth = 1; // Always start with depth 1

  for (const moment of moments) {
    if (moment.depth !== lastDepth) {
      // Depth changed, start a new group
      if (currentGroup.length > 0) {
        grouped.push(currentGroup);
      }

      // Add position marker when depth changes, but only if there's a moment with a "move" key
      if (moment.move) {
        const positionMarker = buildMoment({
          depth: moment.depth,
          fen: moment.fen,
          comment: moment.comment || '',
        });
        currentGroup = [positionMarker, moment];
      } else {
        currentGroup = [moment];
      }
    } else {
      // Same depth or first moment, add to current group
      currentGroup.push(moment);
    }
    lastDepth = moment.depth;
  }

  // Add the last group if it has items
  if (currentGroup.length > 0) {
    grouped.push(currentGroup);
  }

  return grouped;
};

module.exports = makeTree;
