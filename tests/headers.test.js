const { flat } = require('..');
const { expect } = require('chai');

describe('PGN headers in first moment', () => {
  it('should include headers in first moment for basic PGN', () => {
    // Arrange
    const pgn = '1. e4 e5 *';

    // Act
    const moments = flat(pgn);

    // Assert
    expect(moments[0].headers).to.exist;
    expect(moments[0].headers).to.be.an('object');
  });

  it('should include headers with event information', () => {
    // Arrange
    const pgn = [
      '[Event "World Championship"]',
      '[Site "Reykjavik"]',
      '[Date "1972.07.11"]',
      '[Round "1"]',
      '[White "Spassky, Boris"]',
      '[Black "Fischer, Robert J"]',
      '[Result "1-0"]',
      '',
      '1. e4 e5 2. Nf3 1-0',
    ];

    // Act
    const moments = flat(pgn);

    // Assert
    expect(moments[0].headers).to.exist;
    expect(moments[0].headers.Event).to.equal('World Championship');
    expect(moments[0].headers.Site).to.equal('Reykjavik');
    expect(moments[0].headers.Date).to.equal('1972.07.11');
    expect(moments[0].headers.Round).to.equal('1');
    expect(moments[0].headers.White).to.equal('Spassky, Boris');
    expect(moments[0].headers.Black).to.equal('Fischer, Robert J');
    expect(moments[0].headers.Result).to.equal('1-0');
  });

  it('should include headers with custom FEN position', () => {
    // Arrange
    const pgn = [
      '[SetUp "1"]',
      '[FEN "r4rk1/pp1qnpbp/2np2p1/2pNp1B1/2P1P3/3P1N2/PP3PPP/R2Q1RK1 w - - 0 1"]',
      '',
      '1. Nxe7+ *',
    ];

    // Act
    const moments = flat(pgn);

    // Assert
    expect(moments[0].headers).to.exist;
    expect(moments[0].headers.SetUp).to.equal('1');
    expect(moments[0].headers.FEN).to.equal(
      'r4rk1/pp1qnpbp/2np2p1/2pNp1B1/2P1P3/3P1N2/PP3PPP/R2Q1RK1 w - - 0 1'
    );
  });

  it('should not include headers in variation moments', () => {
    // Arrange
    const pgn = [
      '[White "Player A"]',
      '[Black "Player B"]',
      '',
      '1. e4 e5 (1... c5) 2. Nf3 *',
    ];

    // Act
    const moments = flat(pgn);

    // Assert
    expect(moments[0].headers).to.exist;
    expect(moments[0].headers.White).to.equal('Player A');
    expect(moments[0].headers.Black).to.equal('Player B');

    // Check variation moment (depth 2) does not have headers
    const variationMoment = moments.find((m) => m.depth === 2 && m.move);
    expect(variationMoment).to.exist;
    expect(variationMoment.headers).to.be.undefined;
  });

  it('should include headers with study information', () => {
    // Arrange
    const pgn = [
      '[Event "Starter pack (prototype): English Attack (TRAINABLE)"]',
      '[Result "*"]',
      '[Variant "Standard"]',
      '[ECO "B07"]',
      '[Opening "Pirc Defense"]',
      '[StudyName "Starter pack (prototype)"]',
      '[ChapterName "English Attack (TRAINABLE)"]',
      '[UTCDate "2025.04.15"]',
      '[UTCTime "19:07:51"]',
      '[Annotator "https://lichess.org/@/RoyalFlushDraw"]',
      '[ChapterURL "https://lichess.org/study/8tMJrAWn/p0OYoqUs"]',
      '',
      '{ Sorry I lied, there is one last thing you need to know before the fun begins! } { [%csl Gd2] }',
      '1. d4 Nf6 { [%cal Gb1c3] } 2. Nc3 g6 { [%cal Ge2e4] } 3. e4 3... d6 4. f3 4... Bg7 { [%csl Gc1] } *',
    ];

    // Act
    const moments = flat(pgn);

    // Assert
    expect(moments[0].headers).to.exist;
    expect(moments[0].headers.Event).to.equal(
      'Starter pack (prototype): English Attack (TRAINABLE)'
    );
    expect(moments[0].headers.Result).to.equal('*');
    expect(moments[0].headers.Variant).to.equal('Standard');
    expect(moments[0].headers.ECO).to.equal('B07');
    expect(moments[0].headers.Opening).to.equal('Pirc Defense');
    expect(moments[0].headers.StudyName).to.equal('Starter pack (prototype)');
  });
});
