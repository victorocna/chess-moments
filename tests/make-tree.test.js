const { flat } = require('..');
const { expect } = require('chai');
const { makeTree } = require('../functions/helpers');

describe('Make tree', () => {
  it('Make tree: Only mainline moves', () => {
    // Arrange
    const originalPgn = '1. e4 e5 2. Nf3 Nc6 *';
    const moments = flat(originalPgn);

    // Act
    const tree = makeTree(moments);

    // Assert
    expect(tree[0]).to.be.an('array').that.has.lengthOf(5);
    expect(tree[0][1]?.move).to.equal('e4');
    expect(tree[0][2]?.move).to.equal('e5');
  });

  it('Make tree: Complex moments with variations and position markers', () => {
    // Arrange
    const originalPgn = `{Sorry I lied, there is one last thing you need to know before the fun begins!

    This is how files will look in the move trainer tab. You have the option to click around the moves and see what you are about to train. Remember that this mode is optimized for drills, so in case you want a clearer overview of the whole repertoire, make sure to study using the reading mode.

    Now that you were patient and followed my instructions, it's time to reward you with your first drill. Look behind the board and press the drill 'with arrows' button.} 1. d4 g5 (1... Nf6 {[%cal Gb1c3]} 2. Nc3 g6 {[%cal Ge2e4]} 3. e4 {It's critical to understand that if Black doesn't put a pawn in the center with 3...d5, we can no longer play our lovely Jobava London.
    <br>
    The good news is that whenever Black goes for a strange opening in his own third, you can always apply the same developing scheme with f3-Be3-Qd2-O-O-O-g4-h4 and storm on the kingside.} d6 4. f3 {Important to start with f3 before 4.Be3 because 4...Ng4 ideas can be pretty annoying to deal with.} ) 2. a4 *`;

    const moments = flat(originalPgn);

    // Act
    const tree = makeTree(moments);

    // Assert - Only the most essential validations
    expect(tree).to.be.an('array').that.has.lengthOf(3);
    expect(tree[0][1]).to.have.property('move', 'd4');
    expect(tree[1][1]).to.have.property('move', 'Nf6');
    expect(tree[0][0]).to.have.property('index', 0);
  });
});
