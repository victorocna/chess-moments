/**
 * Does a string end in zero or not
 * @param {String} string
 */
module.exports = (string) => {
  try {
    return string.lastIndexOf('0') === string.length - 1;
  } catch (err) {
    return false;
  }
};
