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
    expect(moments[4].move).to.equal('e5');
    expect(moments[4].depth).to.equal(1);
  });

  it('with second move variation', () => {
    // Arrange
    const pgn = '1. e4 e5 2. Nf3 (2. Bc4) Nc6 *';

    // Act
    const moments = parser(pgn);
    const depths = moments
      .filter(({ depth }) => depth)
      .map(({ depth }) => depth);
    const expected = [1, 1, 1, 1, 2, 1];

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
    const expected = [1, 1, 1, 2, 1, 2, 1];

    // Assert
    expect(moments[5].depth).to.equal(2);
    expect(isEqual(expected, depths)).to.equal(true);
  });

  it('with variations and comments', () => {
    // Arrange
    const pgn = '1. e4 c5 (1... e6 {the french defence}) 2. Nf3 *';

    // Act
    const moments = parser(pgn);

    // Assert
    expect(moments[3].move).to.equal('e6');
    expect(moments[3].comment).to.equal('the french defence');
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
    expect(moments[14].move).to.equal('h6');
    expect(moments[14].shapes[0].brush).to.equal('red');
    expect(moments[14].shapes[0].orig).to.equal('e4');
    expect(moments[16].move).to.equal('Qxf6');
    expect(moments[16].shapes[1].brush).to.equal('green');
    expect(moments[16].shapes[1].orig).to.equal('f8');
    expect(moments[16].comment).to.equal(
      ' negrul ramane cu perechea de nebuni'
    );
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
});
