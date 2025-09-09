const { flat } = require('..');
const { expect } = require('chai');
const { makeTree } = require('../functions/helpers');

describe('Make tree', () => {
  it('Make tree: Only mainline moves', () => {
    // Arrange
    const pgn = '1. e4 e5 2. Nf3 Nc6 *';
    const moments = flat(pgn);

    // Act
    const tree = makeTree(moments);

    // Assert
    expect(tree[0]).to.be.an('array').that.has.lengthOf(5);
    expect(tree[0][1]?.move).to.equal('e4');
    expect(tree[0][2]?.move).to.equal('e5');
  });

  it('Make tree: One sideline', () => {
    // Arrange
    const pgn = '1. e4 e5 (1... c5) 2. Nf3 Nc6 *';
    const moments = flat(pgn);

    // Act
    const tree = makeTree(moments);

    // Assert
    expect(tree[1]).to.be.an('array').that.has.lengthOf(2);
    expect(tree[1][1]?.move).to.equal('c5');
    expect(tree[2]).to.be.an('array').that.has.lengthOf(3);
    expect(tree[2][1]?.move).to.equal('Nf3');
    expect(tree[2][2]?.move).to.equal('Nc6');
  });

  it('Make tree: Two sidelines', () => {
    // Arrange
    const pgn = '1. e4 e5 (1... c5) (1... e6) 2. Nf3 Nc6 *';
    const moments = flat(pgn);

    // Act
    const tree = makeTree(moments);

    // Assert
    expect(tree[1]).to.be.an('array').that.has.lengthOf(2);
    expect(tree[1][1]?.move).to.equal('c5');
    expect(tree[3]).to.be.an('array').that.has.lengthOf(3);
    expect(tree[3][1]?.move).to.equal('Nf3');
    expect(tree[3][2]?.move).to.equal('Nc6');
  });

  it('Make tree: Pawn promotion', () => {
    // Arrange
    const pgn = [
      '[FEN "8/4PK1k/8/R7/8/8/8/8 w - - 0 1"]',
      '[SetUp "1"]',
      '',
      '1. e8=Q (1. e8=R Kh6 2. Rh8#) 1... Kh6 2. Qh8# *',
    ];
    const moments = flat(pgn);

    // Act
    const tree = makeTree(moments);

    // Assert
    expect(tree[1]).to.be.an('array').that.has.lengthOf(4);
    expect(tree[1][1]?.move).to.equal('e8=R');
    expect(tree[2]).to.be.an('array').that.has.lengthOf(3);
    expect(tree[2][2]?.move).to.equal('Qh8#');
  });
});
