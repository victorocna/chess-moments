/**
 * Convert PGN color code to brush color name
 */
const getBrushColor = (letter) => {
  const brushes = {
    R: 'red',
    Y: 'yellow',
    G: 'green',
    B: 'blue',
  };

  return brushes[letter] || 'green';
};

module.exports = getBrushColor;
