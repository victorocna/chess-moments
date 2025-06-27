/**
 * Convert brush color name to PGN color code
 */
const getBrushCode = (brush) => {
  const brushCodes = {
    green: 'G',
    red: 'R',
    blue: 'B',
    yellow: 'Y',
  };
  return brushCodes[brush] || 'G';
};

module.exports = getBrushCode;
