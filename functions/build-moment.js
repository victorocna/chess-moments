const prettify = require('./prettify');
const shape = require('./shape');

module.exports = ({ depth, move, fen, comment }) => {
  const moment = { depth, fen };
  if (move) {
    moment.move = move;
  }
  if (comment) {
    const pretty = prettify(comment);
    if (pretty) {
      moment.comment = pretty;
    }
    const shapes = shape(comment);
    if (shapes) {
      moment.shapes = shapes;
    }
  }

  return moment;
};
