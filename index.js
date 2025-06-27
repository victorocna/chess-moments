const { fen, pgn, flat, train, tree } = require('./functions');
const {
  getNextMoments,
  getPrevMoment,
  momentsToPgn,
} = require('./functions/extras');

module.exports = {
  fen,
  pgn,
  flat,
  train,
  tree,
  getNextMoments,
  getPrevMoment,
  momentsToPgn,
};
