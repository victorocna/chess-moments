const { expect } = require('chai');
const shape = require('../functions/shape');

describe('shape', () => {
  it('parses a single circle annotation without leaking the closing bracket into dest', () => {
    const result = shape('[%csl Ge4]');
    expect(result).to.have.lengthOf(1);
    expect(result[0].brush).to.equal('green');
    expect(result[0].orig).to.equal('e4');
    expect(result[0].dest).to.satisfy((v) => v === '' || v === undefined);
  });

  it('parses an arrow annotation with correct orig and dest', () => {
    const result = shape('[%cal Gd5e4]');
    expect(result).to.have.lengthOf(1);
    expect(result[0].brush).to.equal('green');
    expect(result[0].orig).to.equal('d5');
    expect(result[0].dest).to.equal('e4');
  });

  it('parses a circle followed by an arrow in the same comment', () => {
    const result = shape('[%csl Ge4][%cal Gd5e4]');
    expect(result).to.have.lengthOf(2);
    expect(result[0]).to.include({ brush: 'green', orig: 'e4' });
    expect(result[0].dest).to.satisfy((v) => v === '' || v === undefined);
    expect(result[1]).to.deep.include({ brush: 'green', orig: 'd5', dest: 'e4' });
  });

  it('parses a comma-separated list of circles without leaking the bracket into the last item', () => {
    const result = shape('[%csl Ge4,Yf6]');
    expect(result).to.have.lengthOf(2);
    expect(result[0]).to.include({ brush: 'green', orig: 'e4' });
    expect(result[1]).to.include({ brush: 'yellow', orig: 'f6' });
    expect(result[1].dest).to.satisfy((v) => v === '' || v === undefined);
  });
});
