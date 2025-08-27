/**
 * Determines if nextFen comes immediately after currentFen in a chess game
 *
 * @param {String} currentFen - The current FEN position
 * @param {String} nextFen - The potential next FEN position
 * @returns {Boolean} - True if nextFen comes immediately after currentFen
 */
const isNextFen = (currentFen, nextFen) => {
  try {
    // Parse FEN components
    const currentParts = currentFen.split(' ');
    const nextParts = nextFen.split(' ');

    // Validate FEN format (should have 6 parts each)
    if (currentParts.length !== 6 || nextParts.length !== 6) {
      return false;
    }

    const currentActiveColor = currentParts[1]; // 'w' or 'b' - who moves in current position
    const currentFullmove = Number(currentParts[5]);

    const nextActiveColor = nextParts[1]; // 'w' or 'b' - who moves in next position
    const nextFullmove = Number(nextParts[5]);

    // Check if the active color and fullmove number progression is valid
    if (currentActiveColor === 'w') {
      // If white is to move in current position, then after white's move:
      // - Black should be to move in next position
      // - Fullmove number should remain the same
      return nextActiveColor === 'b' && nextFullmove === currentFullmove;
    } else {
      // If black is to move in current position, then after black's move:
      // - White should be to move in next position
      // - Fullmove number should increment by 1
      return nextActiveColor === 'w' && nextFullmove === currentFullmove + 1;
    }
  } catch (error) {
    return false;
  }
};

module.exports = isNextFen;
