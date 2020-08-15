module.exports = (comment) => {
  try {
    return comment.split(']').filter((it) => it.indexOf('[') !== 0)[0];
  } catch (err) {
    return undefined;
  }
};
