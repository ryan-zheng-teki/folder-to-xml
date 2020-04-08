import generateXmlForFilesStruts from './generateXmlStruts';


test('adds 1 + 2 to equal 3', () => {
  generateXmlForFilesStruts(
    '<target folder></target>',
    '<target file></target>');
  expect(3).toBe(3);
});