const { flat, deleteFrom } = require('..');
const { expect } = require('chai');

describe('Delete from', () => {
  it('Delete from: Only mainline moves', () => {
    // Arrange
    const pgn = '1. e4 e5 2. Nf3 Nc6 *';
    const moments = flat(pgn);
    const current = moments.find((m) => m.move === 'Nf3');

    // Act
    const newMoments = deleteFrom(moments, current);

    // Assert
    expect(newMoments[3]?.move).to.equal('Nf3');
    expect(newMoments[4]?.move).to.be.undefined;
  });
});
