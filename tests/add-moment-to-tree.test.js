const { tree, addMomentToTree } = require('..');
const { expect } = require('chai');
const { formatMoment } = require('./functions');
const { flatten } = require('lodash');

describe('addMomentToTree', () => {
  it('Add new moment to the end of the tree if the new moment is the last one', () => {
    // Arrange
    const pgn = '1. e4 *';
    const move = {
      san: 'e5',
      fen: 'rnbqkb1r/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKB1R w KQkq - 0 1',
    };

    // Act
    const moments = tree(pgn);
    const newMove = formatMoment(move);
    const updatedTree = addMomentToTree(moments, newMove);
    const flatTree = flatten(updatedTree);

    // Assert
    expect(flatTree).to.have.length(3);
    expect(flatTree[2].san).to.equal('e5');
  });

  it.only('Return early if the new moment already exists in the tree', () => {
    // Arrange
    const pgn = '1. e4 e5 *';
    const move = {
      san: 'e5',
      fen: 'rnbqkb1r/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKB1R w KQkq - 0 1',
    };

    // Act
    const moments = tree(pgn);
    const newMove = formatMoment(move);
    const updatedTree = addMomentToTree(moments, newMove);
    const flatTree = flatten(updatedTree);

    // Assert
    expect(flatTree).to.have.length(3);
    expect(flatTree[2].san).to.equal('e5');
  });
});
