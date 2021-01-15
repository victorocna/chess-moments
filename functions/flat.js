const makeMoments = require('./make-moments');

const flat = (sloppyPgn) => {
  const moments = makeMoments(sloppyPgn);

  // flatten array and add index for every moment
  const flatten = [].concat.apply([], moments);

  let index = 0;
  for (const moment of flatten) {
    moment.index = index;
    index++;
  }

  return flatten;
};

module.exports = flat;
