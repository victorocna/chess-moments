const findMoment = (moments, move) => {
  const isNested = moments.length > 0 && Array.isArray(moments[0]);
  if (!isNested) {
    return moments.find((m) => m.move === move);
  }

  for (const group of moments) {
    const found = group.find((m) => m.move === move);
    if (found) {
      return found;
    }
  }

  return undefined;
};

module.exports = findMoment;
