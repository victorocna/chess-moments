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
    expect(newMoments[5]?.move).to.equal('Nf3');
    expect(newMoments[5]?.depth).to.equal(2);
    expect(newMoments[6]?.move).to.equal('Nc6');
    expect(newMoments[6]?.depth).to.equal(2);
  });

  it('Promote mainline: Sub-sideline promotion', () => {
    // Arrange
    const pgn = '1. e3 e5 2. c3 d5 (2... c6 (2... c5)) 3. h4 h5 *';
    const moments = flat(pgn);
    const current = moments.find((m) => m.move === 'c5');

    // Act
    const newMoments = promoteMainline(moments, current);

    // Assert
    // Expected result: 1. e3 e5 2. c3 d5 (2... c5 (2... c6)) 3. h4 h5
    expect(newMoments[6]?.move).to.equal('c5');
    expect(newMoments[6]?.depth).to.equal(2);
    expect(newMoments[8]?.move).to.equal('c6');
    expect(newMoments[8]?.depth).to.equal(3);
    // Verify mainline moves remain unchanged
    expect(newMoments[4]?.move).to.equal('d5');
    expect(newMoments[4]?.depth).to.equal(1);
    expect(newMoments[10]?.move).to.equal('h4');
    expect(newMoments[10]?.depth).to.equal(1);
    expect(newMoments[11]?.move).to.equal('h5');
    expect(newMoments[11]?.depth).to.equal(1);
  });
});
