const fenHistory = require('./fen-history');
const normalizeFen = require('./normalize-fen');
const previousFen = require('./previous-fen');

module.exports = {
  initial: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  empty: '8/8/8/8/8/8/8/8 w - - 0 1',
  history: fenHistory,
  normalize: normalizeFen,
  previous: previousFen,
};
