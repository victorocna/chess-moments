/**
 * Encode everything inside brackets, including parenthesis
 * @param {string} text
 */
module.exports = (string = '') => {
  const isOdd = (number) => {
    return number % 2 !== 0;
  };
  const extendedEncodeURI = (string) => {
    // extends encodeURIComponent, which does not encode "(" or ")"
    return encodeURIComponent(string)
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29');
  };

  try {
    return string
      .replace(/\{/g, '}')
      .split('}')
      .map((substring, index) => {
        if (isOdd(index)) {
          return `{${extendedEncodeURI(substring)}}`;
        }
        return substring;
      })
      .join('');
  } catch (err) {
    return string;
  }
};
