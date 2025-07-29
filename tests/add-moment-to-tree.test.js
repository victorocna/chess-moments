const { tree, addMomentToTree } = require('..');
const { expect } = require('chai');
const { formatMoment } = require('./functions');
const { flatten } = require('lodash');

describe('addMomentToTree - Mainlines', () => {
  it('New moment does not have a SAN or before FEN', () => {
    // Arrange
    const pgn = '1. e4 e5 *';
    const newMove = {
      san: null,
      before: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
      after: 'rnbqkb1r/pppppppp/8/4P3/8/8/PPPP1PPP/RNBQKB1R b KQkq - 0 1',
    };

    // Act
    const moments = tree(pgn);
    const updatedTree = addMomentToTree(moments, newMove);
    const flatTree = flatten(updatedTree);

    // Assert
    expect(flatTree).to.have.length(3);
    expect(flatTree[1].move).to.equal('e4');
  });

  it('Add new moment to the end of the tree if the new moment is the last one', () => {
    // Arrange
    const pgn = '1. e4 *';
    const move = {
      san: 'e5',
      fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
    };

    // Act
    const moments = tree(pgn);
    const newMove = formatMoment(move);
    const updatedTree = addMomentToTree(moments, newMove);
    const flatTree = flatten(updatedTree);

    // Assert
    expect(flatTree).to.have.length(3);
    expect(flatTree[2].move).to.equal('e5');
  });

  it('Return early if the new moment already exists in the tree', () => {
    // Arrange
    const pgn = '1. e4 e5 *';
    const move = {
      san: 'e5',
      fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
    };

    // Act
    const moments = tree(pgn);
    const newMove = formatMoment(move);
    const updatedTree = addMomentToTree(moments, newMove);
    const flatTree = flatten(updatedTree);

    // Assert
    expect(flatTree).to.have.length(3);
    expect(flatTree[2].move).to.equal('e5');
  });

  it('Return early if the new moment already exists in the sideline', () => {
    // Arrange
    const pgn = '1. e4 e5 (1... c5) 2. Nf3 *';
    const move = {
      san: 'c5',
      fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
    };

    // Act
    const moments = tree(pgn);
    const newMove = formatMoment(move);
    const updatedTree = addMomentToTree(moments, newMove);
    const flatTree = flatten(updatedTree);

    // Assert
    expect(flatTree).to.have.length(7);
    expect(flatTree[4].move).to.equal('c5');
  });
});

describe('addMomentToTree - Sidelines', () => {
  it('Add new moment to the end of the tree as a sideline if the new moment is the last one', () => {
    // Arrange
    const pgn = '1. e4 e5 (1... c5) 2. Nc3 *';
    const move = {
      san: 'Nf3',
      fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
    };

    // Act
    const moments = tree(pgn);
    const newMove = formatMoment(move);
    const updatedTree = addMomentToTree(moments, newMove);
    const flatTree = flatten(updatedTree);

    // Assert
    expect(flatTree).to.have.length(8);
    expect(flatTree[5].move).to.equal('Nf3');
  });

  it('Add new moment as a sideline if the new moment is not on the mainline', () => {
    // Arrange
    const pgn = '1. e4 e5 2. Nf3 *';
    const move = {
      san: 'c5',
      fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
    };

    // Act
    const moments = tree(pgn);
    const newMove = formatMoment(move);
    const updatedTree = addMomentToTree(moments, newMove);
    const flatTree = flatten(updatedTree);

    // Assert
    expect(flatTree).to.have.length(7);
    expect(flatTree[4].move).to.equal('c5');
  });

  it('Add new moment as a sideline and increase the depth', () => {
    // Arrange
    const pgn = '1. d4 d5 (1... Nf6 2. Nc3 g6 3. e4) 2. Nf3 *'
    const move = {
      san: 'd5',
      fen: 'rnbqkb1r/pppppppp/5n2/8/3P4/2N5/PPP1PPPP/R1BQKBNR b KQkq - 2 2',
    };

    // Act
    const moments = tree(pgn);
    const newMove = formatMoment(move);
    const updatedTree = addMomentToTree(moments, newMove);
    const flatTree = flatten(updatedTree);

    // Assert
    expect(flatTree[8].move).to.equal('d5');
    expect(flatTree[8].depth).to.equal(3); // increased depth
    expect(flatTree[9]).to.not.have.property('move');
  });
});
