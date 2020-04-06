import generateXmlForFilesStruts from './readDir';


test('adds 1 + 2 to equal 3', () => {
  generateXmlForFilesStruts(
    '/Users/ryan.zheng/Learning/techblogs/tech-blogs/src/blogs',
    '/Users/ryan.zheng/Learning/techblogs/tech-blogs/src/blogs.xml');
  expect(3).toBe(3);
});