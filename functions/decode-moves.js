module.exports = (moves) => {
  try {
    return decodeURIComponent(moves);
  } catch {
    return moves;
  }
};
