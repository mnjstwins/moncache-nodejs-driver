var assert = require('assert');

var driver = require('../src/moncache.driver');

var url = 'mongodb://localhost:27017/driver_nodejs_tests';

var document = {
  f1: null,
  f2: 2015,
  f3: '',
  f4: 'MonCache',
  f5: true,
  f6: false
};

function doSteps(db, done) {
  step1(db, done);
}

function step1(db, done) {
  db.collection('collection').deleteMany({}, function(e, result) {
    assert.equal(false, !!e);

    step2(db, done);
  });
}

function step2(db, done) {
  db.collection('collection').insertOne(document, function(e, result) {
    assert.equal(false, !!e);

    assert.equal(true, document.hasOwnProperty('_id'));

    assert.equal(true, result.hasOwnProperty('insertedCount'));

    assert.equal(true, result.hasOwnProperty('insertedId'));

    assert.equal(1, result.insertedCount);

    assert.equal(document['_id'], result.insertedId);

    step3(db, done);
  });
}

function step3(db, done) {
  db.collection('collection').find({}, {}, function(e, result) {
    assert.equal(false, !!e);

    result.toArray(function(e, documents) {
      assert.equal(false, !!e);

      assert.equal(true, documents.length > 0);

      stepDone(db, done);
    });
  });
}

function stepDone(db, done) {
  db.close();

  done();
}

describe('MongoProvider', function() {
  function assertInsertOne(mongoProvider) {
    it('insertOne @ ' + mongoProvider.name, function(done) {
      var MongoClient = mongoProvider.provider.MongoClient;

      MongoClient.connect(url, function(err, db) {
        doSteps(db, done);
      });
    });
  }

  assertInsertOne({provider: require('mongodb'), name: 'mongodb'});

  assertInsertOne({provider: require('../'), name: 'moncache'});
});
