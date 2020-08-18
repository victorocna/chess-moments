const { Chess } = require('./chess');
const { fen, parser, split } = require('./functions');

module.exports = (pgn) => {
  const input = Array.isArray(pgn) ? pgn.join('\n') : pgn;

  // load PGN and check headers for existing FEN
  const chess = new Chess();
  chess.load_pgn(input);
  const header = chess.header();

  const store = {
    fen: fen.normalize(header.FEN) || fen.initial, // current FEN
    depth: 1, // current depth
  };

  const history = new Map();
  const variations = split(input).map(({ moves, depth }) => {
    // find previous FEN
    if (history.get(store.depth)) {
      store.fen = fen.previous(history, depth, store.depth);
    }
    store.depth = depth;

    // parse current moves with the computed FEN
    const moments = parser(moves, store.fen, depth);

    // set history for the current depth
    history.set(depth, fen.history(moments, history, depth));

    return moments;
  });

  // flatten array and add index for every moment
  return [].concat.apply([], variations).map((moment, index) => {
    moment.index = index;
    return moment;
  });
};
