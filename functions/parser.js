const { Chess } = require('chess.js');
const { initial } = require('./fen');
const pgn = require('./pgn');
const moment = require('./moment');

module.exports = (moves, fen = initial, depth = 1, headers = null) => {
  const chess = new Chess();
  chess.loadPgn(pgn.build(moves, fen)); // can throw if PGN is invalid

  const history = chess.history({ verbose: true });
  while (chess.undo()) {
    chess.undo();
  }

  // First moment does not have a move
  const first = moment.build({
    depth,
    comment: chess.getComment(),
    fen: chess.fen(),
    headers,
  });

  const moments = history.map((item) => {
    chess.move(item.san);

    return moment.build({
      depth,
      move: item.san,
      from: item.from,
      to: item.to,
      comment: chess.getComment(),
      suffix: chess.getSuffixAnnotation(),
      fen: chess.fen(),
    });
  });

  // finally, add the first chess "moment" when needed
  const pgnHeaders = chess.getHeaders();
  if (pgnHeaders.FEN || fen === initial || first.comment || first.shapes) {
    moments.unshift(first);
  }

  return moments;
};
