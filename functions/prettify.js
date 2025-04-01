module.exports = (comment) => {
  try {
    // Remove any shape comments like [%cal Ya7,Ya6], [%csl Ya7,Ya6]
    // and clock comments like [%clk 3:00:00]
    return comment.replace(/\s*\[(?:%c(?:al|sl)|%clk) [^\]]+\]/g, '').trim();
  } catch (err) {
    return undefined;
  }
};
