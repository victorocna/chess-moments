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
});
