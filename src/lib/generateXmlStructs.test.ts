import generateXmlForFilesStruts from './generateXmlStruts';


test('check xml file generated', () => {
  let result = generateXmlForFilesStruts(
    '<target folder>',
    '<target file>');

  expect(result).toBe(true);
});

