const { flat, getNextMoments, promoteMainline } = require('..');
const { expect } = require('chai');

describe('Promote mainline', () => {
  it('Promote mainline: Only mainline moves', () => {
    // Arrange
    const pgn = '1. e4 e5 2. Nf3 Nc6 *';
    const moments = flat(pgn);
    const current = moments.find((m) => m.move === 'Nf3');

    // Act
    const newMoments = promoteMainline(moments, current);

    // Assert
    expect(newMoments[3]?.move).to.equal('Nf3');
  });

  it('Promote mainline: One sideline', () => {
    // Arrange
    const pgn = '1. e4 e5 (1... c5) 2. Nf3 Nc6 *';
    const moments = flat(pgn);
    const current = moments.find((m) => m.move === 'c5');

    // Act
    const newMoments = promoteMainline(moments, current);

    // Assert
    // Expected result: 1. e4 c5 (1.. e5 2. Nf3 Nc6)
    expect(newMoments[2]?.move).to.equal('c5');
    expect(newMoments[2]?.depth).to.equal(1);
    expect(newMoments[4]?.move).to.equal('e5');
    expect(newMoments[4]?.depth).to.equal(2);
    expect(newMoments[5]?.move).to.equal('Nf3');
    expect(newMoments[5]?.depth).to.equal(2);
    expect(newMoments[6]?.move).to.equal('Nc6');
    expect(newMoments[6]?.depth).to.equal(2);
  });

  it('Promote mainline: Sub-sideline promotion', () => {
    // Arrange
    const pgn = '1. e3 e5 2. c3 d5 (2... c6 (2... c5)) 3. h4 h5 *';
    const moments = flat(pgn);
    const current = moments.find((m) => m.move === 'c5');

    // Act
    const newMoments = promoteMainline(moments, current);

    // Assert
    // Expected result: 1. e3 e5 2. c3 d5 (2... c5 (2... c6)) 3. h4 h5
    expect(newMoments[6]?.move).to.equal('c5');
    expect(newMoments[6]?.depth).to.equal(2);
    expect(newMoments[8]?.move).to.equal('c6');
    expect(newMoments[8]?.depth).to.equal(3);
    // Verify mainline moves remain unchanged
    expect(newMoments[4]?.move).to.equal('d5');
    expect(newMoments[4]?.depth).to.equal(1);
    expect(newMoments[10]?.move).to.equal('h4');
    expect(newMoments[10]?.depth).to.equal(1);
    expect(newMoments[11]?.move).to.equal('h5');
    expect(newMoments[11]?.depth).to.equal(1);
  });
});

describe('Promote mainline: Selezniev vs. Alekhine', () => {
  it('Promote mainline: Promote 13. d4 sideline', () => {
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
    const moments = flat(pgn);
    const current = moments.find((m) => m.move === 'd4');

    // Act
    const newMoments = promoteMainline(moments, current);
    const nextCurrent = newMoments.find((m) => m.move === 'exd4');

    // Assert
    expect(newMoments[1]?.move).to.equal('d4');
    expect(newMoments[1]?.depth).to.equal(1);
    // First move from the previous mainline should be on the sideline
    expect(newMoments[3]?.move).to.equal('Kh1');
    expect(newMoments[3]?.depth).to.equal(2);
    // Next move after promotion should also be on the mainline
    expect(nextCurrent?.move).to.equal('exd4');
    expect(nextCurrent?.depth).to.equal(1);
  });
});
