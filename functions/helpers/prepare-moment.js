const prepareMoment = (newMoment, insertionPoint, newTree) => {
  const targetDepth =
    newMoment.depth ||
    (insertionPoint && newTree[insertionPoint.lineIndex]?.[0]?.depth) ||
    1;

  return {
    depth: targetDepth,
    fen: newMoment.after,
    move: newMoment.san,
    from: newMoment.from,
    to: newMoment.to,
  };
};

module.exports = prepareMoment;
