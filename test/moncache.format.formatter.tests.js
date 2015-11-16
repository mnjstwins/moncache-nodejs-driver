var ObjectId = require('mongodb').ObjectId;

var assert = require("assert");

var Formatter = require('../src/moncache.format.formatter.js');

var document = {
  field1: null,
  field2: 2015,
  field3: 10.07,
  field4: true,
  field5: false,
  field6: '',
  field7: 'MonCache',
  field8: ObjectId('563e8034ea7ccc3c071ea31a')
};

var presentation = [
  5,
  [
    'field1', []
  ],
  [
    'field2', [ 1, 2015 ]
  ],
  [
    'field3', [ 1, 10.07 ]
  ],
  [
    'field4', [ 3, 1 ]
  ],
  [
    'field5', [ 3, 0 ]
  ],
  [
    'field6', [ 2, '' ]
  ],
  [
    'field7', [ 2, 'MonCache' ]
  ],
  [
    'field8', [ 7, '563e8034ea7ccc3c071ea31a' ]
  ]
];

describe('Formatter @ encode (document)', function() {
  function assertEncoding(document, presentation) {
    it('Document', function() {
      assert.deepEqual(presentation, Formatter.encode(document));
    });
  };

  assertEncoding(document, presentation);
});

describe('Formatter @ decode (presentation)', function() {
  function assertDecoding(document, presentation) {
    it('Document', function() {
      assert.deepEqual(document, Formatter.decode(presentation));
    });
  };

  assertDecoding(document, presentation);
});

describe('Formatter @ consistency (document <-> presentation)', function() {
  function assertConsistencyByEncoding(document) {
    assert.deepEqual(document, Formatter.decode(Formatter.encode(document)));
  }

  function assertConsistencyByDecoding(presentation) {
    assert.deepEqual(presentation, Formatter.encode(Formatter.decode(presentation)));
  }

  function assertConsistency(document, presentation) {
    it('Document', function() {
      assertConsistencyByEncoding(document);

      assertConsistencyByDecoding(presentation);
    });
  };

  assertConsistency(document, presentation);
});