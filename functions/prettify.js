module.exports = (comment) => {
  try {
    return comment
      .split(']')
      .map((it) => it.trim())
      .filter((it) => it.indexOf('[') !== 0)[0];
  } catch (err) {
    return undefined;
  }
};
