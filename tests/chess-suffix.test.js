const { flat } = require('..');
const { expect } = require('chai');

describe('Chess symbols: Basic examples', () => {
  it('Has basic symbols', () => {
    // Arrange
    const originalPgn = '1. e4 a6?! 2. d4! b5 *';

    // Act
    const moments = flat(originalPgn);

    // Assert
    expect(moments[2]?.suffix).to.equal('?!');
    expect(moments[3]?.suffix).to.equal('!');
  });
});
