const prettify = require('./prettify');
const shape = require('./shape');

module.exports = ({
  depth,
  move,
  fen,
  comment,
  suffix,
  glyph,
  from,
  to,
  headers,
}) => {
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
  if (suffix) {
    moment.suffix = suffix;
  }
  if (glyph) {
    moment.glyph = glyph;
  }
  if (headers) {
    moment.headers = headers;
  }

  return moment;
};
