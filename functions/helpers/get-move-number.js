const getMoveNumber = (fen) => {
  // FEN format: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
  // The fullmove number is the sixth part of the FEN string
  const parts = fen.split(' ');
  return Number(parts[5]);
};

module.exports = getMoveNumber;
