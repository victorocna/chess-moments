const parser = require('./index');
const expect = require('chai').expect;
const isEqual = require('lodash').isEqual;

describe('basic examples', () => {
  it('basic PGN with one move', () => {
    // Arrange
    const pgn = '1. e4 *';

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments.length).to.equal(2);
    expect(moments[1].move).to.equal('e4');
    expect(moments[1].fen).to.equal(
      'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
    );
  });

  it('basic PGN with two moves', () => {
    // Arrange
    const pgn = '1. e4 e5 *';

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments.length).to.equal(3);
    expect(moments[2].move).to.equal('e5');
    expect(moments[2].fen).to.equal(
      'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2'
    );
  });

  it('basic PGN with one move and a defined result', () => {
    // Arrange
    const pgn = '1. e4 1-0';

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments.length).to.equal(2);
    expect(moments[1].move).to.equal('e4');
    expect(moments[1].fen).to.equal(
      'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
    );
  });

  it('basic PGN as an array of moves', () => {
    // Arrange
    const pgn = [
      '1. e4 e5 *', // array instead of string
    ];

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments.length).to.equal(3);
    expect(moments[2].move).to.equal('e5');
    expect(moments[2].fen).to.equal(
      'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2'
    );
  });

  it('basic PGN as an array of moves with header information', () => {
    // Arrange
    const pgn = [
      '[White "Boris Spassky"]',
      '[Black "Robert Fisher"]',
      '',
      '1. e4 e5 *',
    ];

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments.length).to.equal(3);
    expect(moments[2].move).to.equal('e5');
    expect(moments[2].fen).to.equal(
      'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2'
    );
  });

  it('basic PGN as an array of moves with header information and final newlines', () => {
    // Arrange
    const pgn = [
      '[White "Boris Spassky"]',
      '[Black "Robert Fisher"]',
      '',
      '1. e4 e5 *',
      '',
      '',
    ];

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments.length).to.equal(3);
    expect(moments[2].move).to.equal('e5');
    expect(moments[2].fen).to.equal(
      'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2'
    );
  });
});

describe('invalid PGN', () => {
  it('first move is invalid in the PGN', () => {
    // Arrange
    const pgn = '1. e5 *';

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments.length).to.equal(0);
  });
});

describe('with comments', () => {
  it('comment after the first move', () => {
    // Arrange
    const pgn = '1. e4 {one of the most popular openings for white} *';

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments[1].move).to.equal('e4');
    expect(moments[1].comment).to.equal(
      'one of the most popular openings for white'
    );
  });

  it('comment before the first move', () => {
    // Arrange
    const pgn = '{one of the most popular openings for white} 1. e4 e5 *';

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments[0].move).to.equal(undefined);
    expect(moments[0].fen).to.equal(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    );
    expect(moments[0].comment).to.equal(
      'one of the most popular openings for white'
    );
  });

  it('comment with smiley face', () => {
    // Arrange
    const pgn = '1. e4 e5 {one of the most popular openings :)} *';

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments[2].move).to.equal('e5');
    expect(moments[2].comment).to.equal('one of the most popular openings :)');
  });

  it('comment with result', () => {
    // Arrange
    const pgn = '1. f4 e6 {with the idea 2. g4 Qh4# 0-1} *';

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments[2].move).to.equal('e6');
    expect(moments[2].comment).to.equal('with the idea 2. g4 Qh4# 0-1');
  });

  it('comment unknown commands like "%evp"', () => {
    // Arrange
    const pgn = '{[%evp 0,1,29999,-30000]} 1. e4 *';

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments[0].comment).to.be.undefined;
    expect(moments[1].move).to.equal('e4');
  });
});

describe('with shapes', () => {
  it('e4 field with green highlight', () => {
    // Arrange
    const pgn = '1. e4 {[%csl Ge4]} *';

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments[1].shapes[0].brush).to.equal('green');
    expect(moments[1].shapes[0].orig).to.equal('e4');
  });

  it('d5 & f5 fields with yellow highlight', () => {
    // Arrange
    const pgn = '1. e4 {[%csl Yd5,Yf5]} *';

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments[1].shapes[0].brush).to.equal('yellow');
    expect(moments[1].shapes[0].orig).to.equal('d5');
    expect(moments[1].shapes[1].brush).to.equal('yellow');
    expect(moments[1].shapes[1].orig).to.equal('f5');
  });

  it('d1-h5 diagonal with red highlight', () => {
    // Arrange
    const pgn = '1. e4 {[%cal Rd1h5]} *';

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments[1].shapes[0].brush).to.equal('red');
    expect(moments[1].shapes[0].orig).to.equal('d1');
    expect(moments[1].shapes[0].dest).to.equal('h5');
  });

  it('with multiple shapes after the first move', () => {
    // Arrange
    const pgn = '1. e4 {[%csl Ge4] [%csl Yd1h5] [%csl Rf1a6]} *';

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments[1].shapes[0].brush).to.equal('green');
    expect(moments[1].shapes[1].brush).to.equal('yellow');
    expect(moments[1].shapes[2].brush).to.equal('red');
  });

  it('with multiline comment with shapes', () => {
    const pgn = [
      '{[%cal Ya1a8,Yb1b8,Yc1c8,Yd1d8,Ye1e8,Yf1f8,Yg1g8,',
      'Yh1h8,Ra8h8,Ra7h7,Ra6h6,Ra5h5,Ra4h4,Ra3h3,Ra2h2,Ra1h1]} *',
    ];

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments[0].shapes[0].brush).to.equal('yellow');
    expect(moments[0].shapes[11].brush).to.equal('red');
  });
});

describe('with variations', () => {
  it('with first move variation', () => {
    // Arrange
    const pgn = '1. e4 (1. d4) e5 *';

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments[1].move).to.equal('e4');
    expect(moments[1].depth).to.equal(1);
    expect(moments[3].move).to.equal('d4');
    expect(moments[3].depth).to.equal(2);
    expect(moments[5].move).to.equal('e5');
    expect(moments[5].depth).to.equal(1);
  });

  it('with second move variation', () => {
    // Arrange
    const pgn = '1. e4 e5 2. Nf3 (2. Bc4) Nc6 *';

    // Act
    const moments = parser(pgn);
    const depths = moments
      .filter(({ depth }) => depth)
      .map(({ depth }) => depth);
    const expected = [1, 1, 1, 1, 2, 2, 1, 1];

    // Assert
    expect(moments[4].depth).to.equal(2);
    expect(isEqual(expected, depths)).to.equal(true);
  });

  it('with multiple variations', () => {
    // Arrange
    const pgn = '1. e4 e5 (1... c5) 2. Nf3 (2. Bc4) Nc6 *';

    // Act
    const moments = parser(pgn);
    const depths = moments
      .filter(({ depth }) => depth)
      .map(({ depth }) => depth);
    const expected = [1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1];

    // Assert
    expect(moments[3].depth).to.equal(2);
    expect(isEqual(expected, depths)).to.equal(true);
  });

  it('with variations and comments', () => {
    // Arrange
    const pgn = '1. e4 c5 (1... e6 {the french defence}) 2. Nf3 *';

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments[4].move).to.equal('e6');
    expect(moments[4].comment).to.equal('the french defence');
  });
});

describe('with comments and variations', () => {
  it('comment before the first move of a variation', () => {
    // Arrange
    const pgn = '1. e4 e5 ({the scandinavian defence} 1... d5) *';

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments[3].comment).to.equal('the scandinavian defence');
  });
});

describe('with consecutive variations', () => {
  it("consecutive variantions after white's first move", () => {
    // Arrange
    const pgn = '1. e4 e5 (1... d5) (1... c5) 2. Nf3 *';

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments[2].move).to.equal('e5');
    expect(moments[4].move).to.equal('d5');
    expect(moments[6].move).to.equal('c5');
  });
});

describe('everything put together', () => {
  it('chess match GM Georgescu Tiberiu', () => {
    // Arrange
    const pgn = [
      '{Facusem deja 3 remize consecutive si castigasem o partida(+1) in prima runda} 1. d4',
      '{Badev e un jucator de initiativa, de atac. De obicei joaca e4.} Nf6 2. Bg5 {Trompowsky - o',
      'arma mai rar intalnita in zilele noastre la marii maestrii} e6 {dupa parerea mea cea mai buna',
      'mutare si cu siguranta cea care lupta pentru tot punctul.} ({o alternativa interesanta este',
      'recomandarea lui Andrew Martin:} 2... d5 {precum in partida Baratosi-Georgescu.dar albul la',
      'un joc corect pastreaza += solid} 3. Bxf6 exf6 4. e3 c6 5. Bd3 g6 {Baratosi,D-Georgescu,T',
      '0-1  /CN Echipe juniori B20 2007}) 3. e4 h6 {[%csl Re4]} 4. Bxf6 Qxf6 {[%csl Gc8,Gf8] negrul',
      'ramane cu perechea de nebuni} *',
    ];

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments[0].comment).to.equal(
      'Facusem deja 3 remize consecutive si castigasem o partida(+1) in prima runda'
    );
    expect(moments[1].move).to.equal('d4');
    expect(moments[1].comment).to.equal(
      'Badev e un jucator de initiativa, de atac. De obicei joaca e4.'
    );
    expect(moments[2].move).to.equal('Nf6');
    expect(moments[4].move).to.equal('e6');
    expect(moments[5].comment).to.equal(
      'o alternativa interesanta este recomandarea lui Andrew Martin:'
    );
    expect(moments[6].move).to.equal('d5');
    expect(moments[6].comment).to.equal(
      'precum in partida Baratosi-Georgescu.dar albul la un joc corect pastreaza += solid'
    );
    expect(moments[7].move).to.equal('Bxf6');
    expect(moments[15].move).to.equal('h6');
    expect(moments[15].shapes[0].brush).to.equal('red');
    expect(moments[15].shapes[0].orig).to.equal('e4');
    expect(moments[17].move).to.equal('Qxf6');
    expect(moments[17].shapes[1].brush).to.equal('green');
    expect(moments[17].shapes[1].orig).to.equal('f8');
    expect(moments[17].comment).to.equal('negrul ramane cu perechea de nebuni');
  });

  it('chess diagram with many shapes', () => {
    // Arrange
    const pgn = [
      '[SetUp "1"]',
      '[FEN "8/8/8/8/2k5/1R6/R7/5K2 w - - 0 0"]',
      '',
      '{[%cal Rc4b3,Gb3h3,Ga2g2]} 1. Rh3 Kb4 2. Rg2 Kc4 {[%cal Gg2g4,Gh3h5,Gg4g6, ',
      'Gh5h7,Gg6g8]} 3. Rg4+ Kd5 4. Rh5+ Ke6 5. Rg6+ Kf7 {[%cal Yf7g6]} 6. Ra6 Kg7 ',
      '{[%cal Rg7h7]} 7. Rb5 Kh7 8. Rb7+ Kg8 9. Ra8# *',
    ];

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments[0].shapes[0].brush).to.equal('red');
    expect(moments[4].shapes[0].brush).to.equal('green');
    expect(moments[10].shapes[0].brush).to.equal('yellow');
  });

  it('chess diagram with starting position', () => {
    // Arrange
    const pgn = [
      '[Annotator "Tiberiu Georgescu"]',
      '[SetUp "1"]',
      '[FEN "r4rk1/pp1qnpbp/2np2p1/2pNp1B1/2P1P3/3P1N2/PP3PPP/R2Q1RK1 w - - 0 1"]',
      '[PlyCount "11"]',
      '',
      '1. Nxe7+ Nxe7 2. Bxe7 Qxe7 {[%cal Gf3e1,Gf3d2]} 3. Nd2 (3. Ne1 $2 f5 4. Nc2 Bh6',
      '$11) 3... f5 4. Nb1 $14 {[%cal Gb1c3,Gc3d5] de exemplu} Rf7 (4... fxe4 5. dxe4',
      'Rad8 6. Nc3 Qe6 7. Nd5 {[%csl Gd5,Rg7]}) 5. Nc3 Raf8 6. Nd5 {[%csl Gd5,Rg7]} *',
      '',
      '',
    ];

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments[0].fen).to.equal(
      'r4rk1/pp1qnpbp/2np2p1/2pNp1B1/2P1P3/3P1N2/PP3PPP/R2Q1RK1 w - - 0 1'
    );
    expect(moments[1].move).to.equal('Nxe7+');
  });
});

describe('special cases', () => {
  it('wrong castling symbol', () => {
    // Arrange
    const pgn = '1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. 0-0 *';

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments[7].move).to.equal('O-O');
  });

  it('multiple subvariants with more than one move', () => {
    // Arrange
    const pgn =
      '1. e4 e5 2. Nf3 Nc6 (2... d6 3. d4 f6) (2... Bc5) (2... h5) 3. Bb5 1-0';

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments[10].move).to.equal('Bc5');
  });
});
