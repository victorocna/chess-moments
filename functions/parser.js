const { Chess } = require('chess.js');
const { initial } = require('./fen');
const pgn = require('./pgn');
const prettify = require('./prettify');
const shape = require('./shape');

module.exports = (moves, fen = initial, depth = 1) => {
  const chess = new Chess();
  const loaded = chess.load_pgn(pgn.build(moves, fen));
  if (!loaded) {
    return [];
  }

  const history = chess.history();
  while (chess.undo()) {
    chess.undo();
  }

  const first = {
    depth,
    fen: chess.fen(),
    comment: prettify(chess.get_comment()),
    shapes: shape(chess.get_comment()),
  };
  const moments = history.map((move) => {
    chess.move(move);
    const comment = chess.get_comment();

    const moment = {
      move,
      depth,
      fen: chess.fen(),
      comment: prettify(comment),
      shapes: shape(comment),
    };

    return moment;
  });

  // finally, add the first chess "moment" when needed
  const header = chess.header();
  const { comment, shapes } = first;
  if (header.FEN || fen === initial || comment || shapes.length > 0) {
    moments.unshift(first);
  }

  return moments;
};
