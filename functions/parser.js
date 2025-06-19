const { initial } = require('./fen');
const pgn = require('./pgn');
const moment = require('./moment');

module.exports = (chess, moves, fen = initial, depth = 1) => {
  const loaded = chess.load_pgn(pgn.build(moves, fen));
  if (!loaded) {
    return [];
  }

  const history = chess.history({ verbose: true });
  while (chess.undo()) {
    chess.undo();
  }

  const comment = chess.get_comment();
  const first = moment.build({ depth, comment, fen: chess.fen() });

  const moments = history.map((item) => {
    chess.move(item.san);

    return moment.build({
      depth,
      move: item.san,
      from: item.from,
      to: item.to,
      comment: chess.get_comment(),
      fen: chess.fen(),
    });
  });

  // finally, add the first chess "moment" when needed
  const header = chess.header();
  if (header.FEN || fen === initial || first.comment || first.shapes) {
    moments.unshift(first);
  }

  return moments;
};
