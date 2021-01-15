const Chess = require('../chess');
const fen = require('./fen');
const parser = require('./parser');
const pgn = require('./pgn');
const split = require('./split');

const make = (sloppyPgn) => {
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
      store.fen = fen.previous(history, moves, depth, store.depth);
    }
    store.depth = depth;

    // parse current moves with the computed FEN
    const moments = parser(moves, store.fen, depth);

    // set history for the current depth
    history.set(depth, fen.history(moments, history, depth));

    return moments;
  });

  return variations;
};

module.exports = make;
