const { flat, momentsToPgn } = require('..');
const { expect } = require('chai');
const { trimPgnHeaders } = require('./functions');

describe('moments to PGN: Basic examples', () => {
  it('converts basic chess moments back to PGN', () => {
    // Arrange
    const originalPgn = '1. e4 e5 2. Nf3 Nc6 *';
    const moments = flat(originalPgn);

    // Act
    const newPgn = momentsToPgn(moments);

    // Assert
    expect(newPgn).to.include(originalPgn);
  });

  it('converts moments with comments', () => {
    // Arrange
    const originalPgn = "1. e4 {King's pawn opening} e5 *";
    const moments = flat(originalPgn);

    // Act
    const newPgn = momentsToPgn(moments);

    // Assert
    expect(newPgn).to.include(originalPgn);
  });

  it('converts moments with suffixes', () => {
    // Arrange
    const originalPgn = "1. e4 {King's pawn opening} d5!? *";
    const moments = flat(originalPgn);

    // Act
    const newPgn = momentsToPgn(moments);

    // Assert
    expect(newPgn).to.include(originalPgn);
  });

  it('converts moments with variations', () => {
    // Arrange
    const originalPgn = '1. e4 e5 (1... c5) 2. Nf3 *';
    const moments = flat(originalPgn);

    // Act
    const newPgn = momentsToPgn(moments);

    // Assert
    expect(newPgn).to.include(originalPgn);
  });

  it('handles empty moments array', () => {
    // Arrange
    const moments = [];

    // Act
    const newPgn = momentsToPgn(moments);

    // Assert
    expect(newPgn).to.include(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    );
  });

  it('handles moments with shapes', () => {
    // Arrange
    const originalPgn = '1. e4 {[%csl Ge4]} e5 *';
    const moments = flat(originalPgn);

    // Act
    const newPgn = momentsToPgn(moments);

    // Assert
    expect(newPgn).to.include(originalPgn);
  });

  it('handles multiple variations', () => {
    // Arrange
    const originalPgn = '1. e4 e5 (1... c5) (1... d6) 2. Nf3 *';
    const moments = flat(originalPgn);

    // Act
    const newPgn = momentsToPgn(moments);

    // Assert
    expect(newPgn).to.include(originalPgn);
  });

  it('preserves custom result', () => {
    // Arrange
    const originalPgn = '1. e4 e5 2. Qh5 Nc6 3. Qxf7+ *';
    const moments = flat(originalPgn);

    // Act
    const newPgn = momentsToPgn(moments);

    // Assert
    expect(newPgn).to.include(originalPgn);
  });

  it('handles PGN with headers using trimPgnHeaders helper', () => {
    // Arrange
    const pgn = [
      '[Event "Test Game"]',
      '[Site "Chess.com"]',
      '[Date "2025.06.27"]',
      '[Round "1"]',
      '[White "Player1"]',
      '[Black "Player2"]',
      '',
      '1. e4 e5 2. Nf3 Nc6 *',
    ];

    const expectedMoves = '1. e4 e5 2. Nf3 Nc6 *';
    const moments = flat(trimPgnHeaders(pgn));

    // Act
    const newPgn = momentsToPgn(moments);

    // Assert
    expect(newPgn).to.include(expectedMoves);
  });

  it('adds FEN headers for non-standard starting positions', () => {
    // Arrange
    const pgn = [
      '[SetUp "1"]',
      '[FEN "r4rk1/pp1qnpbp/2np2p1/2pNp1B1/2P1P3/3P1N2/PP3PPP/R2Q1RK1 w - - 0 1"]',
      '',
      '1. Nxe7+ Nxe7 2. Bxe7 *',
    ];
    const moments = flat(pgn);

    // Act
    const newPgn = momentsToPgn(moments);

    // Assert
    expect(newPgn).to.include('[SetUp "1"]');
    expect(newPgn).to.include(
      '[FEN "r4rk1/pp1qnpbp/2np2p1/2pNp1B1/2P1P3/3P1N2/PP3PPP/R2Q1RK1 w - - 0 1"]'
    );
    expect(newPgn).to.include('1. Nxe7+ Nxe7 2. Bxe7 *');
  });

  it('handles a long variation before a short variation', () => {
    // Arrange
    const pgn = [
      '[FEN "8/6k1/1R6/R7/8/8/6K1/8 w - - 0 1"]',
      '[SetUp "1"]',
      '',
      '1. Ra7+ Kf8 (1... Kg8 2. Rab7 (2. Rbb7 Kf8 3. Re7 Kg8 4. Reb7 Kh8)) (1... Kh8) *',
    ];
    const moments = flat(pgn);

    // Act
    const newPgn = momentsToPgn(moments);

    // Assert
    expect(newPgn).to.include('1... Kh8');
  });
});

describe('moments to PGN: Real chess games', () => {
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
      '13. Kh1 {!} (13. d4 exd4 14. Nxd4 Nxd4 15. Bxd4 c5 16. Bxc5 (16. Bb2 Qd7 (',
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
    const moments = flat(pgn);

    // Act
    const newPgn = momentsToPgn(moments);

    // Assert
    expect(newPgn).to.include('13. Kh1 {!} (13. d4 exd4 14. Nxd4 Nxd4');
  });
});

describe('moments to PGN: Examples with moments instead of PGN', () => {
  // Arrange
  it('converts basic chess moments back to PGN', () => {
    const moments = [
      {
        depth: 1,
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        index: 0,
      },
      {
        depth: 1,
        fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
        move: 'e4',
        from: 'e2',
        to: 'e4',
        index: 1,
      },
      {
        depth: 1,
        fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
        move: 'e5',
        from: 'e7',
        to: 'e5',
        index: 2,
      },
    ];

    // Act
    const newPgn = momentsToPgn(moments);

    // Assert
    expect(newPgn).to.include(
      '[FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]'
    );
    expect(newPgn).to.include('1. e4 e5 *');
  });
});
