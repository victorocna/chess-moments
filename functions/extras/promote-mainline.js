const promoteMainline = (moments, current) => {
  if (current.depth === 1) {
    return moments;
  }

  const currentDepth = current.depth;
  const targetDepth = currentDepth - 1; // Promote to one level higher

  // Find the position moment that starts the current sideline
  let sidelinePositionIndex = -1;
  for (let i = 0; i < current.index; i++) {
    if (moments[i].depth === currentDepth && !moments[i].move) {
      sidelinePositionIndex = i;
      break;
    }
  }

  if (sidelinePositionIndex === -1) {
    return moments;
  }

  // Find the move at target depth that should be replaced
  let moveToReplace = -1;
  for (let i = sidelinePositionIndex - 1; i >= 0; i--) {
    if (moments[i].depth === targetDepth && moments[i].move) {
      moveToReplace = i;
      break;
    }
  }

  if (moveToReplace === -1) {
    return moments;
  }

  const result = [];

  for (let i = 0; i < moments.length; i++) {
    if (i === moveToReplace) {
      // Replace the target depth move with the promoted sideline move
      result.push({ ...current, depth: targetDepth });
    } else if (i === sidelinePositionIndex) {
      // Keep the sideline position unchanged
      result.push({ ...moments[i] });
    } else if (i === current.index) {
      // Replace the original sideline move with the demoted target depth move
      result.push({ ...moments[moveToReplace], depth: currentDepth });
    } else if (
      i > moveToReplace &&
      moments[i].depth === targetDepth &&
      moments[i].move
    ) {
      // All subsequent moves at target depth should be demoted to current depth
      result.push({ ...moments[i], depth: currentDepth });
    } else if (
      i > moveToReplace &&
      moments[i].depth === targetDepth &&
      !moments[i].move
    ) {
      // Skip position moments at target depth that come after the replaced move
      // as they should now be part of the sideline
      continue;
    } else {
      result.push({ ...moments[i] });
    }
  }

  result.forEach((moment, index) => {
    moment.index = index;
  });

  return result;
};

module.exports = promoteMainline;
