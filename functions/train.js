const flat = require('./flat');

const train = (sloppyPgn, moveIndex) => {
  const moments = flat(sloppyPgn);

  // Remove sidelines (depth > 1) when no move index is specified
  if (!moveIndex) {
    return moments.filter((moment) => moment.depth === 1);
  }

  // Split the moments into two groups
  const before = moments.slice(0, moveIndex);
  const after = moments.slice(moveIndex);

  // Remove sidelines after the specified move index with the move index depth
  const filtered = after.filter((moment) => moment.depth <= moments[moveIndex].depth);

  return before.concat(filtered);
};

module.exports = train;
