const { flat, getNextMoments, promoteMainline } = require('..');
const { expect } = require('chai');

describe('Promote mainline', () => {
  it('Promote mainline: Only mainline moves', () => {
    // Arrange
    const pgn = '1. e4 e5 2. Nf3 Nc6 *';
    const moments = flat(pgn);
    const current = moments.find((m) => m.move === 'Nf3');

    // Act
    const newMoments = promoteMainline(moments, current);

    // Assert
    expect(newMoments[3]?.move).to.equal('Nf3');
  });
});
