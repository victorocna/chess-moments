const { flat, deleteUntil } = require('..');
const { expect } = require('chai');

describe('Delete until', () => {
  it('Delete until: Only mainline moves', () => {
    // Arrange
    const pgn = '1. e4 e5 2. Nf3 Nc6 *';
    const moments = flat(pgn);
    const current = moments.find((m) => m.move === 'Nf3');

    // Act
    const newMoments = deleteUntil(moments, current);

    // Assert
    expect(newMoments[1]?.move).to.equal('Nf3');
    expect(newMoments[2]?.move).to.equal('Nc6');
  });
});
