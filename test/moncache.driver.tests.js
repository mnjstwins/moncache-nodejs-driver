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

      assert.equal(1, documents.length);

      step4(db, done);
    });
  });
}

function step4(db, done) {
  db.collection('collection').findOne({_id: document['_id']}, {}, function(e, result) {
    assert.equal(false, !!e);

    assert.equal(document['_id'].toString(), result['_id'].toString());

    assert.equal(document.f1, result.f1);
    assert.equal(document.f2, result.f2);
    assert.equal(document.f3, result.f3);
    assert.equal(document.f4, result.f4);
    assert.equal(document.f5, result.f5);
    assert.equal(document.f6, result.f6);

    step5(db, done);
  });
}

function step5(db, done) {
  var query = {
    _id: { $eq: document['_id'] }
  };

  var modifications = {
    $set: {
      f2: 10.07
    },
    $unset: {
      f3: ''
    }
  };

  db.collection('collection').updateOne(query, modifications, function(e, result) {
    assert.equal(false, !!e);

    assert.equal(true, result.hasOwnProperty('modifiedCount'));

    assert.equal(1, result.modifiedCount);

    db.collection('collection').findOne({_id: document['_id']}, {}, function(e, result) {
      assert.equal(false, !!e);

      assert.equal(true,  result.hasOwnProperty('f1'));
      assert.equal(true,  result.hasOwnProperty('f2'));
      assert.equal(false, result.hasOwnProperty('f3'));
      assert.equal(true,  result.hasOwnProperty('f4'));
      assert.equal(true,  result.hasOwnProperty('f5'));
      assert.equal(true,  result.hasOwnProperty('f6'));

      assert.equal(document.f1, result.f1);
      assert.equal(10.07,       result.f2)
      assert.equal(document.f4, result.f4);
      assert.equal(document.f5, result.f5);
      assert.equal(document.f6, result.f6);

      document = result;

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
    it('SRUF @ ' + mongoProvider.name, function(done) {
      var MongoClient = mongoProvider.provider.MongoClient;

      MongoClient.connect(url, function(err, db) {
        doSteps(db, done);
      });
    });
  }

  assertInsertOne({provider: require('mongodb'), name: 'mongodb'});

  assertInsertOne({provider: require('../'), name: 'moncache'});
});