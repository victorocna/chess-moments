const { flat } = require('..');
const { expect } = require('chai');

describe('Chess glyphs: Basic examples', () => {
  it('Has basic glyphs', () => {
    // Arrange
    const originalPgn = '1. e4 $7 a6 2. d4 $22 b5 *';

    // Act
    const moments = flat(originalPgn);

    // Assert
    expect(moments[1]?.glyph).to.equal('$7');
    expect(moments[3]?.glyph).to.equal('$22');
  });

  it('Has multiple different glyphs', () => {
    // Arrange
    const originalPgn = '1. e4 $10 a6 2. d4 $13 b5 3. Nf3 $14 c5 4. c3 $16 *';

    // Act
    const moments = flat(originalPgn);

    // Assert
    expect(moments[1]?.glyph).to.equal('$10');
    expect(moments[3]?.glyph).to.equal('$13');
    expect(moments[5]?.glyph).to.equal('$14');
    expect(moments[7]?.glyph).to.equal('$16');
  });

  it('Works with both suffix and glyph on same move', () => {
    // Arrange
    const originalPgn = '1. e4! $7 a6?! $22 *';

    // Act
    const moments = flat(originalPgn);

    // Assert
    expect(moments[1]?.suffix).to.equal('!');
    expect(moments[1]?.glyph).to.equal('$7');
    expect(moments[2]?.suffix).to.equal('?!');
    expect(moments[2]?.glyph).to.equal('$22');
  });
});
