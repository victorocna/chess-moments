const brush = require('./brush');
module.exports = (comment) => {
  try {
    const draw = [];
    const shapeComments = comment
      .split(']')
      .map((it) => it.trim())
      .filter((it) => it.indexOf('[') === 0);

    for (const shapeComment of shapeComments) {
      // transform "[%csl Ya7" into "Ya7"
      const shapes = shapeComment.split(' ').pop();

      for (const target of shapes.split(',')) {
        draw.push({
          brush: brush(target.substr(0, 1)),
          orig: target.substr(1, 2),
          dest: target.substr(3, 2),
        });
      }
    }

    return draw;
  } catch (err) {
    return [];
  }
};
