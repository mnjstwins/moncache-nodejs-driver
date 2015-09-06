var assert = require("assert");

var Formatter = require('../src/moncache.format.formatter.js');

var d1 = {
  data: null
};

var d1mon = {
  t: 'object',
  v: [{
    n: 'data',
    t: 'null',
    v: ''
  }]
};

var d2 = {
  data: true
};

var d2mon = {
  t: 'object',
  v: [{
    n: 'data',
    t: 'boolean',
    v: 1
  }]
};

var d3 = {
  data: false
};

var d3mon = {
  t: 'object',
  v: [{
    n: 'data',
    t: 'boolean',
    v: 0
  }]
};

var d4 = {
  data: 213
};

var d4mon = {
  t: 'object',
  v: [{
    n: 'data',
    t: 'number',
    v: 213
  }]
};

var d5 = {
  data: 'Hello world!'
};

var d5mon = {
  t: 'object',
  v: [{
    n: 'data',
    t: 'string',
    v: 'Hello world!'
  }]
};

var d6 = {
  data: [
    null,
    true,
    false,
    213,
    'Hello world!'
  ]
};

var d6mon = {
  t: 'object',
  v: [{
    n: 'data',
    t: 'array',
    v: [
      {
        t: 'null',
        v: ''
      },
      {
        t: 'boolean',
        v: 1
      },
      {
        t: 'boolean',
        v: 0
      },
      {
        t: 'number',
        v: 213
      },
      {
        t: 'string',
        v: 'Hello world!'
      }
    ]
  }]
};

var d7 = {
  data: [
    {
      nf: null
    },
    {
      tf: true
    },
    {
      ff: false
    },
    {
      nf: 213
    },
    {
      sf: 'Hello world!'
    }
  ]
};

var d7mon = {
  t: 'object',
  v: [{
    n: 'data',
    t: 'array',
    v: [
      {
        t: 'object',
        v: [{
          n: 'nf',
          t: 'null',
          v: ''
        }]
      },
      {
        t: 'object',
        v: [{
          n: 'tf',
          t: 'boolean',
          v: 1
        }]
      },
      {
        t: 'object',
        v:[{
          n: 'ff',
          t: 'boolean',
          v:0
        }]
      },
      {
        t: 'object',
        v:[{
          n: 'nf',
          t: 'number',
          v: 213
        }]
      },
      {
        t: 'object',
        v: [{
          n:"sf",
          t:"string",
          v:"Hello world!"
        }]
      }
    ]
  }]
};

describe('MonCacheFormatter.toString(document)', function() {
  function assertToString(document, mon) {
    it(JSON.stringify(document), function() {
      var encodedDocument = Formatter.encode(document);

      assert.equal(JSON.stringify(mon), JSON.stringify(encodedDocument));
    });
  };

  assertToString(d1, d1mon);

  assertToString(d2, d2mon);

  assertToString(d3, d3mon);

  assertToString(d4, d4mon);

  assertToString(d5, d5mon);

  assertToString(d6, d6mon);

  assertToString(d7, d7mon);
});

describe('MonCacheFormatter.fromString(string)', function() {
  function assertFromString(mon, document) {
    it(JSON.stringify(document), function() {
      var actualDocument = Formatter.decode(mon);

      assert.equal(JSON.stringify(document), JSON.stringify(actualDocument));
    });
  };

  assertFromString(d1mon, d1);

  assertFromString(d2mon, d2);

  assertFromString(d3mon, d3);

  assertFromString(d4mon, d4);

  assertFromString(d5mon, d5);

  assertFromString(d6mon, d6);

  assertFromString(d7mon, d7);
});

describe('MonCacheFormatter (consistency)', function() {
  function assertConsistency(document) {
    it(JSON.stringify(document), function() {
      var expectedDocument = document;

      var actualDocument = Formatter.decode(Formatter.encode(document));

      assert.equal(JSON.stringify(expectedDocument), JSON.stringify(actualDocument));
    });
  };

  assertConsistency(d1);

  assertConsistency(d2);

  assertConsistency(d3);

  assertConsistency(d4);

  assertConsistency(d5);

  assertConsistency(d6);

  assertConsistency(d7);
});
