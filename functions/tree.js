const makeMoments = require('./make-moments');

const tree = (sloppyPgn) => {
  const moments = makeMoments(sloppyPgn);

  let index = 0;
  for (const lines of moments) {
    for (const moment of lines) {
      moment.index = index;
      index++;
    }
  }

  return moments;
};

module.exports = tree;
