const { flat, momentsToPgn } = require('..');
const { expect } = require('chai');

describe('moments to PGN', () => {
  it('converts basic chess moments back to PGN', () => {
    // Arrange
    const originalPgn = '1. e4 e5 2. Nf3 Nc6 *';
    const moments = flat(originalPgn);

    // Act
    const newPgn = momentsToPgn(moments);

    // Assert
    expect(newPgn).to.equal(originalPgn);
  });

  it('converts moments with comments', () => {
    // Arrange
    const originalPgn = "1. e4 {King's pawn opening} e5 *";
    const moments = flat(originalPgn);

    // Act
    const newPgn = momentsToPgn(moments);

    // Assert
    expect(newPgn).to.equal(originalPgn);
  });

  it('converts moments with variations', () => {
    // Arrange
    const originalPgn = '1. e4 e5 (1... c5) 2. Nf3 *';
    const moments = flat(originalPgn);

    // Act
    const newPgn = momentsToPgn(moments);

    // Assert
    expect(newPgn).to.equal(originalPgn);
  });

  it('handles empty moments array', () => {
    // Arrange
    const moments = [];

    // Act
    const newPgn = momentsToPgn(moments);

    // Assert
    expect(newPgn).to.equal('');
  });

  it('handles moments with shapes', () => {
    // Arrange
    const originalPgn = '1. e4 {[%csl Ge4]} e5 *';
    const moments = flat(originalPgn);

    // Act
    const newPgn = momentsToPgn(moments);

    // Assert
    expect(newPgn).to.equal(originalPgn);
  });

  it('handles multiple variations', () => {
    // Arrange
    const originalPgn = '1. e4 e5 (1... c5) (1... d6) 2. Nf3 *';
    const moments = flat(originalPgn);

    // Act
    const newPgn = momentsToPgn(moments);

    // Assert
    expect(newPgn).to.equal(originalPgn);
  });
});
