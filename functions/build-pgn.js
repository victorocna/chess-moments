module.exports = (moves, fen) => {
  let decodedMoves = decodeURIComponent(moves);
  if (decodedMoves.indexOf('\n') > -1) {
    decodedMoves.split('\n').join('');
  }

  const pgn = [
    `[FEN "${fen}"]`, // mandatory header info
    '[SetUp "1"]', // mandatory header info
    '', // line break between PGN header and moves
    decodedMoves,
  ];

  if (decodedMoves.indexOf('*') === -1) {
    pgn.push('*');
  }

  return pgn.join('\n');
};
