const { tree, promoteMainlineTree } = require('..');
const { expect } = require('chai');
const { findMoment } = require('./functions');

describe('Promote tree mainline', () => {
  it('Promote tree mainline: Only mainline moves', () => {
    // Arrange
    const pgn = '1. e4 e5 2. Nf3 Nc6 *';
    const moments = tree(pgn);
    const current = findMoment(moments, 'Nf3');

    // Act
    const newMoments = promoteMainlineTree(moments, current);

    // Assert
    expect(newMoments[0]).to.be.an('array').that.has.lengthOf(5);
    expect(newMoments[0][3]?.move).to.equal('Nf3');
  });

  it('Promote tree mainline: One sideline', () => {
    // Arrange
    const pgn = '1. e4 e5 (1... c5) 2. Nf3 Nc6 *';
    const moments = tree(pgn);
    const current = findMoment(moments, 'c5');

    // Act
    const newMoments = promoteMainlineTree(moments, current);

    // Assert
    // Expected result: 1. e4 c5 (1.. e5 2. Nf3 Nc6)
    expect(newMoments[0]).to.be.an('array').that.has.lengthOf(3);
    expect(newMoments[0][2]?.move).to.equal('c5');
    expect(newMoments[0][2]?.depth).to.equal(1);
    expect(newMoments[1]).to.be.an('array').that.has.lengthOf(4);
    expect(newMoments[1][1]?.move).to.equal('e5');
    expect(newMoments[1][1]?.depth).to.equal(2);
  });

  it('Promote tree mainline: Two sidelines', () => {
    // Arrange
    const pgn = '1. e4 e5 (1... c5) (1... e6) 2. Nf3 Nc6 *';
    const moments = tree(pgn);
    const current = findMoment(moments, 'c5');

    // Act
    const newMoments = promoteMainlineTree(moments, current);

    // Assert
    // Expected result: 1. e4 c5 (1.. e5 2. Nf3 Nc6) (1... e6) *
    expect(newMoments[0]).to.be.an('array').that.has.lengthOf(3);
    expect(newMoments[0][2]?.move).to.equal('c5');
    expect(newMoments[0][2]?.depth).to.equal(1);
    expect(newMoments[1]).to.be.an('array').that.has.lengthOf(4);
    expect(newMoments[1][1]?.move).to.equal('e5');
    expect(newMoments[1][1]?.depth).to.equal(2);
    expect(newMoments[2]).to.be.an('array').that.has.lengthOf(2);
    expect(newMoments[2][1]?.move).to.equal('e6');
    expect(newMoments[2][1]?.depth).to.equal(2);
  });

  it('Promote tree mainline: Pawn promotion', () => {
    // Arrange
    const pgn = [
      '[FEN "8/4PK1k/8/R7/8/8/8/8 w - - 0 1"]',
      '[SetUp "1"]',
      '',
      '1. e8=Q (1. e8=R Kh6 2. Rh8#) 1... Kh6 2. Qh8# *',
    ];
    const moments = tree(pgn);
    const current = findMoment(moments, 'e8=R');

    // Act
    const newMoments = promoteMainlineTree(moments, current);

    // Assert
    expect(newMoments[0]).to.be.an('array').that.has.lengthOf(2);
    expect(newMoments[0][1]?.move).to.equal('e8=R');
    expect(newMoments[1]).to.be.an('array').that.has.lengthOf(4);
    expect(newMoments[1][1]?.move).to.equal('e8=Q');
  });
});
