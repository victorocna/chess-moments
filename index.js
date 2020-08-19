const { Chess } = require('./chess');
const { fen, parser, pgn, split } = require('./functions');

module.exports = (sloppyPgn) => {
  const normalizedPgn = pgn.normalize(sloppyPgn);

  // load PGN and check headers for existing FEN
  const chess = new Chess();
  chess.load_pgn(normalizedPgn);
  const header = chess.header();

  const store = {
    fen: fen.normalize(header.FEN) || fen.initial, // current FEN
    depth: 1, // current depth
  };

  const history = new Map();
  const variations = split(normalizedPgn).map(({ moves, depth }) => {
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
