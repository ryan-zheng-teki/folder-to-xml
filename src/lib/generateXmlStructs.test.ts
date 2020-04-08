import generateXmlForFilesStruts from './generateXmlStruts';


test('check xml file generated', () => {
  generateXmlForFilesStruts(
    '<target folder>',
    '<target file>');
});

