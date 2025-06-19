const prettify = require('./prettify');
const shape = require('./shape');

module.exports = ({ depth, move, fen, comment, from, to }) => {
  const moment = { depth, fen };
  if (move) {
    moment.move = move;
  }
  if (from && to) {
    moment.from = from;
    moment.to = to;
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
