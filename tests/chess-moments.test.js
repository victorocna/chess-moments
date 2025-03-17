const { flat, tree } = require('..');
const { expect } = require('chai');
const { isEqual } = require('lodash');

describe('basic examples', () => {
  it('basic PGN with one move', () => {
    // Arrange
    const pgn = '1. e4 *';

    // Act
    const moments = flat(pgn);

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
    const moments = flat(pgn);

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
    const moments = flat(pgn);

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
    const moments = flat(pgn);

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
    const moments = flat(pgn);

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
    const moments = flat(pgn);

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
    const moments = flat(pgn);

    // Assert
    expect(moments.length).to.equal(0);
  });
});

describe('with comments', () => {
  it('comment after the first move', () => {
    // Arrange
    const pgn = '1. e4 {one of the most popular openings for white} *';

    // Act
    const moments = flat(pgn);

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
    const moments = flat(pgn);

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
    const moments = flat(pgn);

    // Assert
    expect(moments[2].move).to.equal('e5');
    expect(moments[2].comment).to.equal('one of the most popular openings :)');
  });

  it('comment with result', () => {
    // Arrange
    const pgn = '1. f4 e6 {with the idea 2. g4 Qh4# 0-1} *';

    // Act
    const moments = flat(pgn);

    // Assert
    expect(moments[2].move).to.equal('e6');
    expect(moments[2].comment).to.equal('with the idea 2. g4 Qh4# 0-1');
  });

  it('comment unknown commands like "%evp"', () => {
    // Arrange
    const pgn = '{[%evp 0,1,29999,-30000]} 1. e4 *';

    // Act
    const moments = flat(pgn);

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
    const moments = flat(pgn);

    // Assert
    expect(moments[1].shapes[0].brush).to.equal('green');
    expect(moments[1].shapes[0].orig).to.equal('e4');
  });

  it('d5 & f5 fields with yellow highlight', () => {
    // Arrange
    const pgn = '1. e4 {[%csl Yd5,Yf5]} *';

    // Act
    const moments = flat(pgn);

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
    const moments = flat(pgn);

    // Assert
    expect(moments[1].shapes[0].brush).to.equal('red');
    expect(moments[1].shapes[0].orig).to.equal('d1');
    expect(moments[1].shapes[0].dest).to.equal('h5');
  });

  it('with multiple shapes after the first move', () => {
    // Arrange
    const pgn = '1. e4 {[%csl Ge4] [%csl Yd1h5] [%csl Rf1a6]} *';

    // Act
    const moments = flat(pgn);

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
    const moments = flat(pgn);

    // Assert
    expect(moments[0].shapes[0].brush).to.equal('yellow');
    expect(moments[0].shapes[11].brush).to.equal('red');
  });
});

describe('with variations', () => {
  it('with first move variation', () => {
    // Arrange
    const pgn = '1. e4 (1. d4) 1... e5 *';

    // Act
    const moments = flat(pgn);

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
    const pgn = '1. e4 e5 2. Nf3 (2. Bc4) 2... Nc6 *';

    // Act
    const moments = flat(pgn);
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
    const pgn = '1. e4 e5 (1... c5) 2. Nf3 (2. Bc4) 2... Nc6 *';

    // Act
    const moments = flat(pgn);
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
    const moments = flat(pgn);

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
    const moments = flat(pgn);

    // Assert
    expect(moments[3].comment).to.equal('the scandinavian defence');
  });
});

describe('with consecutive variations', () => {
  it("consecutive variations after white's first move", () => {
    // Arrange
    const pgn = '1. e4 e5 (1... d5) (1... c5) 2. Nf3 *';

    // Act
    const moments = flat(pgn);

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
    const moments = flat(pgn);

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

    expect(moments[5].comment).to.include('o alternativa interesanta');
    expect(moments[6].move).to.equal('d5');
    expect(moments[6].comment).to.include(
      'precum in partida Baratosi-Georgescu'
    );
    expect(moments[7].move).to.equal('Bxf6');
    expect(moments[15].move).to.equal('h6');
    expect(moments[15].shapes[0].brush).to.equal('red');
    expect(moments[15].shapes[0].orig).to.equal('e4');
    expect(moments[17].move).to.equal('Qxf6');
    expect(moments[17].shapes[1].brush).to.equal('green');
    expect(moments[17].shapes[1].orig).to.equal('f8');
    expect(moments[17].comment).to.include('ramane cu perechea de nebuni');
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
    const moments = flat(pgn);

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
    const moments = flat(pgn);

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
    const moments = flat(pgn);

    // Assert
    expect(moments[7].move).to.equal('O-O');
  });

  it('multiple subvariants with more than one move', () => {
    // Arrange
    const pgn =
      '1. e4 e5 2. Nf3 Nc6 (2... d6 3. d4 f6) (2... Bc5) (2... h5) 3. Bb5 1-0';

    // Act
    const moments = flat(pgn);

    // Assert
    expect(moments[10].move).to.equal('Bc5');
  });

  it('multiple subvariants with deep first subvariant', () => {
    // Arrange
    const pgn =
      '1. e4 e5 2. Nf3 Nc6 (2... d6 3. d4 f6 (3... Nf6) (3... h6)) (2... Bc5) (2... h5) 1-0';

    // Act
    const moments = flat(pgn);

    // Assert
    expect(moments[14].move).to.equal('Bc5');
    expect(moments.length).to.equal(17);
  });
});

describe('real chess games', () => {
  it('Fischer vs. Andersson', () => {
    // Arrange
    const pgn = [
      '[Event "Siegen exh"]',
      '[White "Fischer, Robert James"]',
      '[Black "Andersson, Ulf"]',
      '[Result "1-0"]',
      '[SetUp "1"]',
      '[FEN "r2qrbk1/1pp3pp/2n1bp2/p2np3/8/PP1PPN2/1BQNBPPP/R4RK1 w - - 0 13"]',
      '[PlyCount "32"]',
      '',
      '13. Kh1 $1 {!} (13. d4 exd4 14. Nxd4 Nxd4 15. Bxd4 c5 16. Bxc5 (16. Bb2 Qd7 (',
      '16... f5 17. Bd3 Qg5 18. Nf3 Qh5) 17. Bd3 f5 18. Nc4) 16... Rc8 17. b4 b6)',
      '13... Qd7 14. Rg1 $36 Rad8 15. Ne4 Qf7 16. g4 g6 17. Rg3 $16 Bg7 (17... Nb6 18.',
      'g5 $1 $40) 18. Rag1 Nb6 19. Nc5 Bc8 20. Nh4 (20. g5 f5) 20... Nd7 $6 (20... Kh8',
      '$5) 21. Ne4 Nf8 22. Nf5 $1 {!} Be6 (22... Bxf5 23. gxf5 g5 24. Nxg5 fxg5 25.',
      'Rxg5 $18 {[%cal Re2h5]}) (22... gxf5 23. gxf5 Bxf5 (23... Kh8 24. Rxg7 Qxg7 25.',
      'Rxg7 Kxg7 26. Bg4 {[%cal Rf2f4]}) 24. Rxg7+ Qxg7 25. Nxf6+) 23. Nc5 Ne7',
      '$6 (23... Bc8 $5) 24. Nxg7 Kxg7 25. g5 $40 Nf5 (25... fxg5 26. Rf3 Nf5 27. e4 (',
      '27. Bxe5+ Kg8 28. Ne4 $5 Nd7 29. Nxg5 $18)) 26. Rf3 b6 27. gxf6+ $1 {!} Kh8 (',
      '27... Qxf6 28. Ne4 $18) 28. Nxe6 Rxe6 {and White won after couple of moves.}',
      '1-0',
      '',
    ];

    // Act
    const moments = flat(pgn);

    // Assert
    expect(moments[111].move).to.equal('Rxe6');
    expect(moments.length).to.equal(112);
  });

  it('Selezniev vs. Alekhine', () => {
    // Arrange
    const pgn = [
      '[Event "Triberg-A"]',
      '[Site "Triberg"]',
      '[Date "1921.07.09"]',
      '[Round "3"]',
      '[White "Selezniev, Alexey Sergeevich"]',
      '[Black "Alekhine, Alexander"]',
      '[Result "0-1"]',
      '[SetUp "1"]',
      '[FEN "1r3rk1/2qnppb1/b2p2pp/p1pP4/P1P5/3B1NP1/2QBPP1P/1R3RK1 b - - 0 20"]',
      '[PlyCount "16"]',
      '[EventDate "1921.07.07"]',
      '',
      '20... Rb4 $1 {[%csl Rc4][%cal Gg7b2] !} 21. Bxb4 cxb4 22. Nd2 Nc5 (22... Rc8)',
      '23. Nb3 Nd7 $2 {?} (23... Nxa4 $6 24. Ra1 Nc5 25. Nxa5 Bxa1 26. Rxa1 Kg7 27.',
      'Nc6) (23... Rc8 $1 24. Nxc5 Qxc5 25. Rfc1 Bc3 26. Qb3 Bxc4 27. Bxc4 Qxc4 28.',
      'Qxc4 Rxc4 $17) 24. c5 $1 {!} Bxd3 25. exd3 $1 {!} (25. Qxd3 dxc5) 25... dxc5',
      '26. Rfe1 (26. Qc4 Qd6 27. Nxa5 Ne5 28. Qb3 Ra8) 26... Ne5 27. Re3 (27. Qxc5',
      'Nf3+ 28. Kf1 Qxc5 29. Nxc5 Nd2+ 30. Ke2 Nxb1 31. Rxb1 Rd8 $1) 27... Rc8 28. Rc1',
      '$16 {Black has won the game after a long fight.} 0-1',
      '',
    ];

    // Act
    const moments = flat(pgn);

    // Assert
    expect(moments[65].move).to.equal('Rc1');
    expect(moments.length).to.equal(66);
  });

  it('Karpov vs. Portisch', () => {
    // Arrange
    const pgn = [
      '[Event "Milano (m/2)"]',
      '[Site "Milano (m/2) 20/301"]',
      '[Date "1975.??.??"]',
      '[Round "?"]',
      '[White "Karpov, An"]',
      '[Black "Portisch, Lajos"]',
      '[Result "1-0"]',
      '[ECO "C72"]',
      '[SetUp "1"]',
      '[FEN "4brk1/6pp/pp1p1p2/8/1PP1P1PP/2B2P2/3K4/6R1 w - - 0 40"]',
      '[PlyCount "49"]',
      '[EventDate "1975.??.??"]',
      '',
      '40. Ra1 Bf7 41. Rxa6 Rb8 42. Kd3 $18 {White won important pawn and from now',
      'Karpovs task is not so difficult.} h5 43. b5 $1 hxg4 (43... Rc8 44. Ra4 {',
      'like in the game,but possible was} (44. Rxb6 Bxc4+ 45. Kd4 hxg4 46. fxg4 Be2',
      '47. g5 Rc4+ 48. Ke3 Rxc3+ 49. Kxe2 $18)) 44. fxg4 Rc8 45. Ra4 Be6 46. g5 f5 (',
      '46... fxg5 47. hxg5 Kh7 48. Bd4 Kg6 49. Bxb6 Kxg5 50. Bd4 {winning.}) 47. exf5',
      'Bxf5+ 48. Kd4 Kf7 49. Bb4 Ke6 50. Ra6 Rb8 ({Did not help} 50... Rh8 51. Rxb6',
      'Rxh4+ 52. Kc3 Rh3+ 53. Kb2 Rd3 54. c5 $18) 51. h5 Bg4 52. h6 gxh6 53. gxh6 Bf5',
      '54. Bd2 Rg8 55. Bf4 $1 (55. Rxb6 Rg4+ 56. Kc3 Rg3+ 57. Kb4 (57. Kb2 Rg2) 57...',
      'Rg4 $132) 55... Rb8 56. Ra7 Kf6 57. Rg7 Be6 58. Rc7 Rh8 59. Rc6 Rg8 60. Rxd6',
      'Kf5 61. Rxb6 Rg4 62. Rxe6 Kxe6 63. Ke4 Rg1 64. b6 1-0',
      '',
    ];

    // Act
    const moments = flat(pgn);

    // Assert
    expect(moments[97].move).to.equal('b6');
    expect(moments.length).to.equal(98);
  });

  it('Mikhalchishin vs. Slobodjan', () => {
    // Arrange
    const pgn = [
      '[Event "Dortmund op-A"]',
      '[Site "Dortmund"]',
      '[Date "1993.??.??"]',
      '[Round "?"]',
      '[White "Mikhalchishin, Adrian"]',
      '[Black "Slobodjan, Roman"]',
      '[Result "1-0"]',
      '[ECO "D30"]',
      '',
      '1. Nf3 d5 2. d4 Nf6 3. c4 c6 4. e3 e6 5. Nbd2 (5. Nc3 Nbd7 6. Bd3 (6. Qc2 Bd6 (',
      '6... b6 7. Bd3 Bb7 8. O-O Rc8 9. Ne5 c5 10. Qa4) 7. Bd3 O-O 8. O-O b6 9. b3 Bb7',
      '10. Bb2 Rb8 (10... Rc8 11. e4 dxe4 12. Nxe4 Nxe4 13. Bxe4 Nf6 14. Bd3 c5 (14...',
      'h6 15. c5 Bb8 (15... bxc5 16. dxc5 Bxc5 17. Qxc5 Qxd3 18. Qxa7 (18. Bxf6 gxf6',
      '19. Qxa7)) 16. Rad1) 15. dxc5 Bxc5 16. Bxf6 Qxf6 17. Bxh7+ Kh8 18. Be4) 11. e4',
      'dxe4 12. Nxe4 Nxe4 13. Bxe4 Nf6 14. Bd3) 6... Bd6) 5... Be7 (5... c5 6. cxd5',
      'exd5 7. dxc5 Bxc5 8. Nb3 Bb6 9. Be2 O-O 10. O-O Nc6 11. Nbd4 Bd7) 6. b3 b6 7.',
      'Bd3 Bb7 8. O-O Nbd7 9. Bb2 O-O 10. Qe2 (10. Ne5 Rc8 11. f4 c5 12. Qf3 {[%cal',
      'Gf3h3]} (12. cxd5 exd5 (12... Nxd5 13. Bxh7+ (13. Qf3) (13. Rf3 Nb4 14. Bxh7+',
      'Kxh7 15. Rh3+ Kg8 16. Qh5)) 13. Qf3 {[%cal Gf3h3]} c4) 12... dxc4 13. Qxb7 cxd3',
      '(13... Rc7) 14. Nc6 Qe8 (14... Rc7 15. Nxe7+ Kh8) 15. Nxa7 (15. Qxc8)) 10... c5',
      '11. Rad1 Qc7 12. Ne5 Rad8 13. f4 Ne4 (13... a6) (13... a5 14. cxd5 exd5 15. Bf5',
      'a4) 14. cxd5 exd5 15. Nxe4 dxe4 16. Bc4 cxd4 (16... a5 17. Qh5 g6 18. Nxg6 hxg6',
      '19. Qxg6+ Kh8) 17. Bxd4 (17. exd4 Nf6 (17... Ba8 18. Rc1 Qb7 19. Ba6 (19. Rfd1',
      'Nxe5 20. fxe5)) 18. Rc1 Qb8) 17... Nf6 18. Ng4 (18. Rc1 Qb8 19. Ba6) 18... Nxg4',
      '(18... Nd5 19. Bxg7 (19. Qb2 f6 20. Qc2 Kh8 21. Qxe4 Nc3) (19. Nh6+ gxh6 (19...',
      'Kh8 20. Bxg7+ (20. Qb2 f6 21. Nf5) 20... Kxg7 21. Nf5+ Kh8 22. Bxd5 Bxd5 23.',
      'Qb2+ f6) 20. Qg4+ Bg5 21. fxg5 Bc8 22. Qh5 Nxe3 23. Bxe3) 19... Nxf4 (19...',
      'Kxg7) 20. Rxf4 Kxg7 21. Rdf1) 19. Qxg4 Rxd4 (19... g6 20. f5 Bc8 21. fxg6 Bxg4',
      '22. gxf7+ Rxf7 23. Bxf7+ Kf8 24. Be6+ Ke8 25. Bxg4) 20. Rxd4 Bc6 21. Qe2 Bc5',
      '22. Rdd1 Qb7 23. a4 a5 24. Kh1 Qe7 25. Bd5 Qf6 26. Qc4 Re8 27. Bxc6 Qxc6 28.',
      'Rd5 Qb7 29. Rfd1 Qc8 30. Rd7 {Mikhalchishin,A (2520)-Slobodjan,R (2440)',
      'Dortmund op-A 1993 (8) 1-0} 1-0',
      '',
    ];

    // Act
    const moments = flat(pgn);

    // Assert
    expect(moments[286].move).to.equal('Rd7');
    expect(moments.length).to.equal(287);
  });

  it('Beliavsky vs. Karpov', () => {
    // Arrange
    const pgn = [
      '[Event "USSR (ch) "]',
      '[Site "?"]',
      '[Date "1973.??.??"]',
      '[Round "?"]',
      '[White "Beliavsky, Alexander G"]',
      '[Black "Karpov, An"]',
      '[Result "0-1"]',
      '[ECO "E54"]',
      '[SetUp "1"]',
      '[FEN "2r5/3R4/4pkpp/3b4/5P2/P5BP/6P1/6K1 b - - 0 36"]',
      '[PlyCount "73"]',
      '',
      '36... Rc1+ 37. Kf2 Rc2+ 38. Ke3 Rc3+ 39. Kf2 Rxa3 40. Bh4+ g5 41. fxg5+ hxg5',
      '42. Bg3 Ra2+ 43. Ke3 Rxg2 $17 44. Bc7 {It was necessary to try to find',
      'counterplay immediately!} (44. Bd6 Ra2 (44... Rb2 45. Kd4) 45. h4 g4 46. Kf4',
      'Rg2 47. Be5+) 44... Ra2 45. Rh7 Ra8 $1 46. Kf2 Kg6 47. Rd7 Ra3 48. Rd8 Rf3+ 49.',
      'Kg1 Rxh3 $19 50. Rb8 Rc3 51. Bd6 Rc2 52. Rf8 Rc6 53. Be5 g4 54. Rf6+ Kg5 55.',
      'Rf8 Bf3 56. Bf4+ Kg6 57. Kf2 Rc2+ 58. Kg3 Rg2+ 59. Kh4 Re2 60. Bg3 e5 61. Rb8',
      'e4 62. Rb5 Re3 63. Rb6+ Kf7 64. Kg5 Rd3 65. Kf5 e3 66. Rd6 Rb3 67. Rd7+ Ke8 68.',
      'Ke6 e2 69. Re7+ Kf8 70. Kf6 Bd5 71. Bh4 Rf3+ 72. Kg6 Bf7+ 0-1',
      '',
    ];

    // Act
    const moments = flat(pgn);

    // Assert
    expect(moments[86].move).to.equal('Bf7+');
    expect(moments.length).to.equal(87);
  });
});

describe('chess variants as tree', () => {
  it('with multiple variations as a tree', () => {
    // Arrange
    const pgn = '1. e4 e5 (1... c5) 2. Nf3 (2. Bc4) 2... Nc6 *';

    // Act
    const moments = tree(pgn);

    // Assert
    expect(moments.length).to.equal(5);
    expect(moments[0][1].move).to.equal('e4');
  });
});

describe('Edge cases', () => {
  it('No moves, multiple multiline comments and shapes', () => {
    const pgn = [
      '[FEN "r3kb1r/n1pbqp1p/ppnpp1pP/6P1/2PPPP2/2N1BN2/PP1Q4/1K1R1B1R b kq - 0 18"]',
      '[SetUp "1"]',
      '',
      '{ Common chess terminology states that the side controlling more squares on the board has a space advantage.',
      '',
      'Key takeaway:',
      '}',
      '{ [%cal Ga1a5,Ga5g5,Gg5h6,Gh6h1,Gh1a1,Ra8a6,Ra6g6,Rg6h7,Rh7h8,Rh8a8] }',
      '*',
    ];

    // Act
    const moments = tree(pgn);

    // Assert
    expect(moments.length).to.equal(1);
    expect(moments[0][0].comment).to.exist;
    expect(moments[0][0].shapes).to.exist;
  });
});

describe('real life examples', () => {
  it('chapter 1', () => {
    // Arrange
    const pgn = `[Event "Pawn play: part 1: Intro"]
[Site "https://lichess.org/study/jCMS8l8F/5er6xG0b"]
[Result "*"]
[Variant "Standard"]
[ECO "?"]
[Opening "?"]
[Annotator "https://lichess.org/@/Capybara_London"]
[StudyName "Pawn play: part 1"]
[ChapterName "Intro"]
[UTCDate "2025.02.02"]
[UTCTime "20:46:33"]

{ One of the most requested themes I see across various popular chess channels is:
"How do you find the right pawn break?"

This is the million-dollar question, but the answer is simple: you don't.

Knowing their opening moves until castling and having a general idea for the middlegame will solve this issue for most people. In most cases, the pawn break should be part of your pre-game knowledge, not something you are supposed to find on the fly.

Obviously, not everything can be prepared at home. Therefore, in the book's first part, I will provide you with the general concepts you need to know for optimal pawn play in the middle game, and at the end, I will also give you concrete examples of opening pawn breaks. }
 *`;

    // Act
    const moments = tree(pgn);
    console.log(moments);

    // Assert
    expect(moments.length).to.equal(1);
  });
});
