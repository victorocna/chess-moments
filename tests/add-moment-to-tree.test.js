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
    const pgn = '1. d4 d5 (1... Nf6 2. Nc3 g6 3. e4) 2. Nf3 *';
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

describe.only('addMomentToTree - Real chess games', () => {
  it('addMomentToTree: English Attack - Rapport-Jobava System', () => {
    // Arrange
    const pgn = [
      '[Event "Starter pack prototype: English Attack"]',
      '[Site "lichess.org"]',
      '[Date "2025.04.15"]',
      '[Result "*"]',
      '[Annotator "https://lichess.org/@/RoyalFlushDraw"]',
      '[GameId "2166990815494144"]',
      '[Variant "Standard"]',
      '[ECO "D01"]',
      '[Opening "Rapport-Jobava System"]',
      '[StudyName "Starter pack (prototype)"]',
      '[ChapterName "BIG QUIZ (TRAINABLE)"]',
      '[ChapterURL "https://lichess.org/study/8tMJrAWn/i6tF7p93"]',
      '',
      '1. d4 d5 (1... Nf6 2. Nc3 g6 3. e4 d6 4. f3 Bg7 5. Be3 O-O 6. Qd2 Nbd7 7. O-O-O',
      'b6 8. Bh6 Bb7 9. h4) 2. Nc3 Nf6 3. Bf4 e6 (3... c6 4. e3 e6 5. Bd3 Be7 6. Nf3',
      'O-O 7. O-O Nbd7 8. e4 dxe4 9. Nxe4 Nxe4 10. Bxe4 Nf6 11. Bd3) (3... Bf5 4. f3',
      'e6 5. g4 Bg6 6. h4 h6 (6... h5 7. g5 Nfd7 8. e3 Nc6 9. Bd3 Bxd3 10. Qxd3 g6',
      '11. O-O-O Bd6 12. Nge2) 7. e3 Nc6 8. Bd3 Bxd3 9. Qxd3 Bd6 10. Nge2 Bxf4',
      '11. Nxf4 Qe7 12. O-O-O) 4. e3 Bb4 (4... Bd6 5. Bd3 Bxf4 6. exf4 O-O 7. Nf3',
      'Nc6 8. O-O Bd7 9. Ne2 a6 10. c3 b5 11. Ng3) 5. Bd3 Bxc3+ 6. bxc3 O-O 7. Nf3',
      'Nc6 8. O-O Re8 9. c4 a6 10. cxd5 exd5 (10... Nxd5 11. Bg3 Ndb4 12. Be2) 11. c4',
      '$14 *',
      '',
    ];
    const move = {
      san: 'Bg7',
      fen: 'rnbqkb1r/pppppp1p/5np1/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 0 3',
    };

    // Act
    const moments = tree(pgn);
    const newMove = formatMoment(move);
    const updatedTree = addMomentToTree(moments, newMove);
    const flatTree = flatten(updatedTree);

    // Assert
    expect(flatTree[9]).to.not.have.property('move');
    expect(flatTree[10].move).to.equal('Bg7');
    expect(flatTree[10].depth).to.equal(3); // increased depth
    expect(flatTree[11]).to.not.have.property('move');
  });
});
