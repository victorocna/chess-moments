function splitByMoveIndex(inputData, moveIndex) {
  const before = [];
  const after = [];

  inputData.forEach((innerArray) => {
    // Check if every element in the inner array has an index less than moveIndex
    if (innerArray.every((item) => item.index < moveIndex)) {
      if (innerArray.length) {
        before.push(innerArray);
      }
    } else {
      if (innerArray.length) {
        after.push(innerArray);
      }
    }
  });

  return { before, after };
}

module.exports = splitByMoveIndex;
