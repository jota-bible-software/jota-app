/**
 * Test for validating KJV search.
 * Assumes a `searchVerses` function is available to query verses by references.
 * Replace `searchVerses` with the actual function name/path in your codebase.
 */

const { searchVerses } = require('../src/search'); // Adjust path to actual implementation

describe('KJV Search Functionality', () => {
  
  test('Validates returned verses for specific KJV references', async () => {
    const references = [
      'Acts 1:8',
      '2 Corinthians 13:14',
      'Acts 2:17-21',
      'John 7:37-39',
      'Psalm 92:10',
      'Acts 10:38',
      'Acts 1:8',
      'Genesis 25:29-34',
      'Matthew 14:13-21',
      'Ezekiel 47:1-9',
      '2 Kings 4:1-6',
      'Mark 5:30-34',
      'Mark 6:1-6',
      'Acts 6:5,8',
    ];

    const expectedResults = [
      // Provide expected verse content strings (use real content or stubs)
      'But ye shall receive power, after that the Holy Ghost...',
      'The grace of the Lord Jesus Christ, and the love of...',
      'And it shall come to pass in the last days, saith God...',
      'In the last day, that great day of the feast, Jesus...',
      'But my horn shalt thou exalt like the horn of an unicorn...',
      'How God anointed Jesus of Nazareth with the Holy Ghost...',
      'But ye shall receive power, after that the Holy Ghost...',
      'And Jacob sod pottage: and Esau came from the field...',
      'And he sent them away, they departed into a desert...',
      'Afterward he brought me again unto the door of the house...',
      'Now there cried a certain woman of the wives of the...',
      'And Jesus, immediately knowing in himself that virtue had gone...',
      'And he went out from thence, and came into his own...',
      'And the saying pleased the whole multitude: and they chose...',
    ];

    const results = await Promise.all(references.map(ref => searchVerses(ref)));

    results.forEach((result, index) => {
      expect(result).toContain(expectedResults[index]);
    });
  });

});