/**
 * Replace last character of a string with the character "1"
 * @param {String} string
 */
module.exports = (string) => {
  try {
    return string.substring(0, string.length - 1) + '1';
  } catch (err) {
    return string;
  }
};
