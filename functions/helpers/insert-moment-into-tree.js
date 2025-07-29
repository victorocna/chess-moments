const prepareMoment = require('./prepare-moment');

/**
 * Inserts a new moment into the tree at the specified point.
 * This function handles both inserting into existing lines and creating new sidelines.
 * @param {Array} tree - The current tree structure.
 * @param {Object} point - The point in the tree where the moment will be inserted.
 * @param {Object} newMoment - The new moment to be inserted, containing properties like san, fen, from, to.
 * @returns {Array} Updated tree with the new moment inserted
 */
const insertMomentIntoTree = (tree, point, newMoment) => {
  // Prepare the moment to be inserted with only the properties that match normal moments
  const momentToInsert = prepareMoment(tree, point, newMoment);

  // If no matching position found, always create a new line
  if (!point) {
    tree.push([momentToInsert]);
    return tree;
  }

  // Insert into existing line
  if (point.type === 'sameLine') {
    tree[point.lineIndex].splice(point.momentIndex, 0, momentToInsert);
    return tree;
  }

  // Create new sideline
  if (point.type === 'newLine') {
    // Check if we need to split the mainline to create proper structure
    const originalMainline = tree[point.afterLineIndex];
    const branchMomentIndex = point.branchMomentIndex;

    // Find where to split: look for moves that come after the branch point sequence
    let splitIndex = branchMomentIndex + 1;

    // Skip the immediate next move(s) that continue from the branch point
    // and find moves that should be in a separate continuation
    while (splitIndex < originalMainline.length) {
      const currentMoment = originalMainline[splitIndex];
      if (currentMoment.move) {
        // For now, assume the next move continues the sequence
        // and the move after that should be separated
        let nextMoveIndex = splitIndex + 1;
        while (
          nextMoveIndex < originalMainline.length &&
          !originalMainline[nextMoveIndex].move
        ) {
          nextMoveIndex++;
        }

        if (nextMoveIndex < originalMainline.length) {
          // There's another move after this one, split here for continuation
          splitIndex = nextMoveIndex;
          break;
        }
      }
      splitIndex++;
    }

    if (splitIndex < originalMainline.length) {
      // Split the mainline
      const beforeSplit = originalMainline.slice(0, splitIndex);
      const afterSplit = originalMainline.slice(splitIndex);

      // Update the original mainline to keep the sequence up to the split
      tree[point.afterLineIndex] = beforeSplit;

      // Insert the sideline after the mainline
      const sidelinePositionMarker = {
        depth: momentToInsert.depth,
        fen: newMoment.before,
      };
      const sidelineLine = [sidelinePositionMarker, momentToInsert];
      tree.splice(point.afterLineIndex + 1, 0, sidelineLine);

      // Insert the continuation line after the sideline
      const continuationPositionMarker = {
        depth: beforeSplit[0]?.depth || 1, // Use the depth of the line being continued
        fen: beforeSplit[beforeSplit.length - 1].fen,
      };
      const continuationLine = [continuationPositionMarker, ...afterSplit];
      tree.splice(point.afterLineIndex + 2, 0, continuationLine);
    } else {
      // No continuation needed, just add the sideline
      const sidelinePositionMarker = {
        depth: momentToInsert.depth,
        fen: newMoment.before,
      };
      const sidelineLine = [sidelinePositionMarker, momentToInsert];
      tree.splice(point.afterLineIndex + 1, 0, sidelineLine);
    }
  }

  return tree;
};

module.exports = insertMomentIntoTree;
