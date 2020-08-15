const chess = {};

chess.isValidMove = (move) => {
  const regex = new RegExp(/^([NBRQK]?x?[a-h][1-8]=?[NBRQ]?[\\+\\#]?)$/);
  return regex.test(move);
};

module.exports = chess;
