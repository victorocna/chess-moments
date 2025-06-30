const { fen, pgn, flat, tree } = require('./functions');
const {
  getNextMoments,
  getPrevMoment,
  momentsToPgn,
  moveTrainer,
} = require('./functions/extras');

module.exports = {
  fen,
  pgn,
  flat,
  tree,
  getNextMoments,
  getPrevMoment,
  momentsToPgn,
  moveTrainer,
};
