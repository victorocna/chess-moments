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
      const possibilities = ['[%cal', '[%csl'];
      const [type, shapes] = shapeComment.split(' ');
      if (!possibilities.includes(type)) {
        return false;
      }

      for (const target of shapes.split(',')) {
        draw.push({
          brush: brush(target.substr(0, 1)),
          orig: target.substr(1, 2),
          dest: target.substr(3, 2),
        });
      }
    }

    if (!draw.length) {
      return undefined;
    }

    return draw;
  } catch (err) {
    return undefined;
  }
};
