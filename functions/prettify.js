module.exports = (comment) => {
  try {
    // Remove shape, clock, and eval comments
    const commentRegex = /\s*\[%(?:cal|csl|clk|eval|evp) [^\]]+\]/g;
    return comment.replace(commentRegex, '').trim();
  } catch (err) {
    return undefined;
  }
};
