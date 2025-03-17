module.exports = (comment) => {
  try {
    // Remove any shape comments like [%cal Ya7,Ya6] or [%csl Ya7,Ya6]
    return comment.replace(/\s*\[%c(?:al|sl) [^\]]+\]/g, '').trim();
  } catch (err) {
    return undefined;
  }
};
