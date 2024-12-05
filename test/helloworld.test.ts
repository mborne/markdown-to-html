
describe('Sample Test', () => {
  it('should be true', () => {
    const result = true;
    expect(result).toBe(true);
  });

  it('should resolve projet directory', async () => {
    const dirPath = __dirname;
    expect(dirPath.endsWith("test")).toBe(true);
  });

});
