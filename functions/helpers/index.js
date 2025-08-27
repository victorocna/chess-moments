const getBrushCode = require('./get-brush-code');
const getBrushColor = require('./get-brush-color');
const getMoveNumber = require('./get-move-number');
const insertMomentIntoTree = require('./insert-moment-into-tree');
const isNextFen = require('./is-next-fen');
const prepareMoment = require('./prepare-moment');

module.exports = {
  getBrushCode,
  getBrushColor,
  getMoveNumber,
  insertMomentIntoTree,
  isNextFen,
  prepareMoment,
};
