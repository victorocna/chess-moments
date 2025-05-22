const { Chess } = require('chess.js');
const { initial } = require('./fen');
const pgn = require('./pgn');
const moment = require('./moment');

module.exports = (moves, fen = initial, depth = 1) => {
  const chess = new Chess();
  chess.loadPgn(pgn.build(moves, fen)); // can throw if PGN is invalid

  const history = chess.history();
  while (chess.undo()) {
    chess.undo();
  }

  const comment = chess.getComment();
  const first = moment.build({ depth, comment, fen: chess.fen() });

  const moments = history.map((move) => {
    chess.move(move);

    return moment.build({
      depth,
      move,
      comment: chess.getComment(),
      fen: chess.fen(),
    });
  });

  // finally, add the first chess "moment" when needed
  const headers = chess.getHeaders();
  if (headers.FEN || fen === initial || first.comment || first.shapes) {
    moments.unshift(first);
  }

  return moments;
};
