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

  it('Promote mainline: One sideline', () => {
    // Arrange
    const pgn = '1. e4 e5 (1... c5) 2. Nf3 Nc6 *';
    const moments = flat(pgn);
    const current = moments.find((m) => m.move === 'c5');

    // Act
    const newMoments = promoteMainline(moments, current);

    // Assert
    // Expected result: 1. e4 c5 (1.. e5 2. Nf3 Nc6)
    expect(newMoments[2]?.move).to.equal('c5');
    expect(newMoments[2]?.depth).to.equal(1);
    expect(newMoments[4]?.move).to.equal('e5');
    expect(newMoments[4]?.depth).to.equal(2);
  });
});
