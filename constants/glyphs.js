const glyphs = {
  $7: '□', // Only move
  $22: '⨀', // Zugzwang
  $10: '=', // Equal position
  $13: '∞', // Unclear position
  $14: '⩲', // White is slightly better
  $15: '⩱', // Black is slightly better
  $16: '±', // White is better
  $17: '∓', // Black is better
  $18: '+−', // White is winning
  $19: '-+', // Black is winning
  $146: 'N', // Novelty
  $32: '↑↑', // Development
  $36: '↑', // Initiative
  $40: '→', // Attack
  $132: '⇆', // Counterplay
  $138: '⊕', // Time trouble
  $44: '=∞', // With compensation
  $140: '∆', // With the idea
};

module.exports = glyphs;
