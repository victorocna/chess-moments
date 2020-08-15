module.exports = (pgn) => {
  try {
    return pgn.split(']').pop().trim();
  } catch (err) {
    return undefined;
  }
};
