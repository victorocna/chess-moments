const promoteMainline = (moments, current) => {
  if (!current || current.depth === 1) return moments;

  const currentDepth = current.depth;
  const targetDepth = currentDepth - 1;

  // Find sideline position marker
  let sidelinePositionIndex = -1;
  for (let i = 0; i < current.index; i++) {
    if (moments[i].depth === currentDepth && !moments[i].move) {
      sidelinePositionIndex = i;
      break;
    }
  }
  if (sidelinePositionIndex === -1) return moments;

  // Find end of sideline window (end of a window = next position at the same depth OR first lower depth)
  let sidelineEndIndex = moments.length;
  for (let i = sidelinePositionIndex + 1; i < moments.length; i++) {
    if (
      (moments[i].depth === currentDepth && !moments[i].move) ||
      moments[i].depth < currentDepth
    ) {
      sidelineEndIndex = i;
      break;
    }
  }

  // Find mainline move to replace
  let targetMoveIndex = -1;
  for (let i = sidelinePositionIndex - 1; i >= 0; i--) {
    if (moments[i].depth === targetDepth && moments[i].move) {
      targetMoveIndex = i;
      break;
    }
  }
  if (targetMoveIndex === -1) return moments;

  // Find end of mainline segment to demote
  let targetSegmentEndIndex = moments.length;
  let seenTargetDepthMove = false;
  for (let i = targetMoveIndex + 1; i < moments.length; i++) {
    const moment = moments[i];

    if (moment.depth === targetDepth && moment.move) {
      seenTargetDepthMove = true;
    }

    if (moment.depth < targetDepth) {
      targetSegmentEndIndex = i;
      break;
    }

    if (moment.depth === targetDepth && !moment.move && seenTargetDepthMove) {
      targetSegmentEndIndex = i;
      break;
    }
  }

  const demotedIndices = new Set([targetMoveIndex]);
  const demotedMoves = [{ ...moments[targetMoveIndex], depth: currentDepth }];

  for (let i = targetMoveIndex + 1; i < targetSegmentEndIndex; i++) {
    if (moments[i].depth === targetDepth && moments[i].move) {
      demotedIndices.add(i);
      demotedMoves.push({ ...moments[i], depth: currentDepth });
    }
  }

  // Rebuild the moments array by promoting the current move to the mainline depth,
  // demoting the old mainline sequence into the sideline, preserving order of
  // unaffected moves, and adjusting depths/indices accordingly.
  const result = [];

  for (let i = 0; i < targetMoveIndex; i++) {
    result.push({ ...moments[i] });
  }

  result.push({ ...moments[current.index], depth: targetDepth });

  for (let i = targetMoveIndex + 1; i < sidelinePositionIndex; i++) {
    if (!demotedIndices.has(i)) {
      result.push({ ...moments[i] });
    }
  }

  result.push({ ...moments[sidelinePositionIndex] });
  for (const move of demotedMoves) {
    result.push(move);
  }

  for (let i = sidelinePositionIndex + 1; i < sidelineEndIndex; i++) {
    if (i === current.index) continue;

    const moment = moments[i];
    if (moment.depth === currentDepth && moment.move) {
      result.push({ ...moment, depth: targetDepth });
    } else {
      result.push({ ...moment });
    }
  }

  for (let i = sidelineEndIndex; i < moments.length; i++) {
    if (!demotedIndices.has(i)) {
      result.push({ ...moments[i] });
    }
  }

  // Reassign indices
  result.forEach((m, i) => {
    m.index = i;
  });

  return result;
};

module.exports = promoteMainline;
