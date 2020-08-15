module.exports = (pgn) => {
  try {
    const withEncodedComments = pgn.replace(/\{.*\}/, encodeURIComponent);
    const lines = withEncodedComments.replace('(', ')').split(')');

    return lines.map(decodeURIComponent);
  } catch (err) {
    return [pgn];
  }
};
