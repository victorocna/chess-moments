const makeMoments = require('./make-moments');

const tree = (sloppyPgn) => {
  try {
    const moments = makeMoments(sloppyPgn);

    let index = 0;
    for (const lines of moments) {
      for (const moment of lines) {
        moment.index = index;
        index++;
      }
    }

    return moments;
  } catch {
    return [];
  }
};

module.exports = tree;
