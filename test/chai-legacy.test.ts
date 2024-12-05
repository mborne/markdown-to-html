import { expect } from 'chai';

describe('Sample Test', () => {
  it('should be true', () => {
    const result = true;
    expect(result).to.be.true;
  });

  it('should resolve projet directory', async () => {
    const dirPath = __dirname;
    expect(dirPath.endsWith("test")).to.be.true;
  });

});
