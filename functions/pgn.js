const buildPgn = require('./build-pgn');
const normalizePgn = require('./normalize-pgn');

module.exports = {
  build: buildPgn,
  normalize: normalizePgn,
};
