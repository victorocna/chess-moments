const { flat, getPrevMoment } = require('..');
const { expect } = require('chai');
const { fen } = require('../functions');

describe('Prev moments', () => {
  it('Prev moments: Basic PGN with one move', () => {
    // Arrange
    const pgn = '1. e4';
    const moments = flat(pgn);
    const current = moments.find((m) => m.move === 'e4');

    // Act
    const previous = getPrevMoment(moments, current);

    // Assert
    expect(previous.fen).to.equal(fen.initial);
  });

  it('Prev moments: Mainline without sideline', () => {
    // Arrange
    const pgn = '1. e4 e5 2. Nf3 Nc6 *';
    const moments = flat(pgn);
    const current = moments.find((m) => m.move === 'Nc6');

    // Act
    const previous = getPrevMoment(moments, current);

    // Assert
    expect(previous.move).to.equal('Nf3');
  });

  it('Prev moments: Sideline after first move', () => {
    // Arrange
    const pgn = '1. e4 (1. d4) 1... e5 2. Nf3 Nc6 *';
    const moments = flat(pgn);
    const current = moments.find((m) => m.move === 'd4');

    // Act
    const previous = getPrevMoment(moments, current);

    // Assert
    expect(previous.fen).to.equal(fen.initial);
  });

  it('Prev moments: Mainline and sideline for black', () => {
    // Arrange
    const pgn = '1. e4 e5 (1... c5) *';
    const moments = flat(pgn);
    const current = moments.find((m) => m.move === 'c5');

    // Act
    const previous = getPrevMoment(moments, current);

    // Assert
    expect(previous.move).to.equal('e4');
  });

  it('Prev moments: Mainline and sideline for white', () => {
    // Arrange
    const pgn = '1. e4 e5 2. Nf3 Nc6 3. Bc4 (3. Bb5) *';
    const moments = flat(pgn);
    const current = moments.find((m) => m.move === 'Bb5');

    // Act
    const previous = getPrevMoment(moments, current);

    // Assert
    expect(previous.move).to.equal('Nc6');
  });

  it('Prev moments: Mainline and multiple sidelines for black', () => {
    // Arrange
    const pgn = '1. e4 e5 (1... c5) (1... d6) *';
    const moments = flat(pgn);
    const current = moments.find((m) => m.move === 'd6');

    // Act
    const previous = getPrevMoment(moments, current);

    // Assert
    expect(previous.move).to.equal('e4');
  });

  it('Prev moments: Mainline and multiple sidelines for white', () => {
    // Arrange
    const pgn = '1. e4 e5 2. Nf3 Nc6 3. Bc4 (3. Bb5) (3. d4) *';
    const moments = flat(pgn);
    const current = moments.find((m) => m.move === 'd4');

    // Act
    const previous = getPrevMoment(moments, current);

    // Assert
    expect(previous.move).to.equal('Nc6');
  });
});

describe('Prev moments: Real chess games', () => {
  it('Prev moments: Fischer vs. Andersson', () => {
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
    const current = moments.find((m) => m.move === 'g6');
    const previous = getPrevMoment(moments, current);

    // Assert
    expect(previous.move).to.equal('g4');
  });

  it('Prev moments: English Attack - Rapport-Jobava System', () => {
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

    // Act
    const moments = flat(pgn);
    const current = moments.find((m) => m.move === 'Nf6' && m.depth === 1);
    const previous = getPrevMoment(moments, current);

    // Assert
    expect(previous.move).to.equal('Nc3');
  });

  it('Prev moments: Selezniev vs. Alekhine', () => {
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
    const current = moments.find((m) => m.move === 'c5' && m.depth === 1);
    const previous = getPrevMoment(moments, current);

    // Assert
    expect(previous.move).to.equal('Nd7');
  });
});
