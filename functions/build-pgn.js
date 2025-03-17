const decodeMoves = require('./decode-moves');

module.exports = (moves, fen) => {
  const decodedMoves = decodeMoves(moves);
  const pgn = [
    `[FEN "${fen}"]`, // mandatory header info
    '[SetUp "1"]', // mandatory header info
    '', // line break between PGN header and moves
    decodedMoves,
  ];

  const possibilities = ['1-0', '0-1', '1/2-1/2', '*'];
  const result = decodedMoves.split('\n').join(' ').split(' ').pop();

  if (!possibilities.includes(result)) {
    pgn.push('*');
  }

  return pgn.join('\n');
};
