const { train } = require('..');
const { expect } = require('chai');

/**
 * Move trainer is a special type of chess moments
 * All white sidelines should be cleared from the chess moments tree
 *
 * After the specified move
 */

describe('basic move trainer', () => {
  it('clears all sidelines from the tree', () => {
    // Arrange
    const pgn = '1. e4 e5 2. Nf3 (2. Bc4) 2... Nc6 3. Bb5 *';

    // Act
    const moments = train(pgn);

    // Assert
    const momentsWithMoves = moments.filter((moment) => moment.move);
    expect(momentsWithMoves.length).to.equal(5);
  });

  it('clear all sidelines after the specified move', () => {
    // Arrange
    const pgn = '1. e4 e5 2. Nf3 (2. Bc4) 2... Nc6 3. Bb5 a6 4. Ba4 (4. Bxc6) *';

    // Act
    const moveIndex = 8; // 3. Bb5
    const moments = train(pgn, moveIndex);

    // Assert
    const momentsWithMoves = moments.filter((moment) => moment.move);
    expect(momentsWithMoves.length).to.equal(8);
  });

  it('clear all sidelines from the correct depth', () => {
    // Arrange
    const pgn = '1. e4 (1. d4 d5 2. c4 e6 (2... c6) 3. Nc3 Nf6) *';

    // Act
    const moveIndex = 6; // 2. c4
    const moments = train(pgn, moveIndex);

    // Assert
    const momentsWithMoves = moments.filter((moment) => moment.move);
    expect(momentsWithMoves.length).to.equal(7);
  });

  it('clear all sidelines from the correct depth for both players', () => {
    // Arrange
    const pgn = '1. e4 (1. d4 d5 2. c4 e6 (2... c6) 3. Nc3 (3. Nf3) 3... Nf6) *';

    // Act
    const moveIndex = 6; // 2. c4
    const moments = train(pgn, moveIndex);

    // Assert
    const momentsWithMoves = moments.filter((moment) => moment.move);
    expect(momentsWithMoves.length).to.equal(7);
  });
});
