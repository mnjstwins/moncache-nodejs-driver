var Promise = require('bluebird');

var assert = require('assert');

var driver = require('../src/moncache.driver');

var url = 'mongodb://localhost:27017/driver_nodejs_tests';

describe('MongoProvider', function() {
  function assertInsertOne(mongoProvider) {
    it('SRUF @ ' + mongoProvider.name, function() {
      var MongoClient = Promise.promisifyAll(mongoProvider.provider.MongoClient);

      return MongoClient.connectAsync(url).then(function(db) {
        var document = {
          f1: null,
          f2: 403,
          f3: 10.07,
          f4: true,
          f5: false,
          f6: 'HelloWorld',
          f7: ''
        };

        return [ db, Promise.promisifyAll(db.collection('collection')), document ];
      })
      .spread(function(db, collection, document) {
        return collection.countAsync({}).then(function(documentsCount) {
          assert.equal(true, documentsCount >= 0, 'Documents count number is invalid');

          return [ db, collection, document, documentsCount ];
        });
      })
      .spread(function(db, collection, document, documentsCount) {
        return collection.deleteManyAsync({}).then(function(result) {
          assert.equal(true, result.hasOwnProperty('deletedCount'), '{ deleteMany } result does not contain "deletedCount" field');

          assert.equal(documentsCount, result.deletedCount, '{ deleteMany } result contains wrong "deletedCount" value');

          return [ db, collection, document ];
        });
      })
      .spread(function(db, collection, document) {
        return collection.insertOneAsync(document).then(function(result) {
          assert.equal(true, result.hasOwnProperty('insertedCount'), '{ insertOne } result does not contain "insertedCount" field');

          assert.equal(1, result.insertedCount, '{ insertOne } result contains wrong "insertedCount" value');

          assert.equal(true, result.hasOwnProperty('insertedId'), '{ insertOne } result does not contain "insertedId" field');

          assert.equal(document._id, result.insertedId, '{ insertOne } result contains wrong "insertedId" value');

          return [ db, collection, document ];
        });
      })
      .spread(function(db, collection, document) {
        return collection.findOneAsync({}, {}).then(function(result) {
          assert.deepEqual(Object.keys(document).sort(), Object.keys(result).sort());

          Object.keys(document).forEach(function(name) {
            assert.equal(JSON.stringify(document[name]), JSON.stringify(result[name]));
          });

          return [ db, collection, document ];
        });
      })
      .spread(function(db, collection, document) {
        return collection.saveAsync(document).then(function(result) {

          return [ db, collection, document ];
        });
      })
      .spread(function(db, collection, document) {
        return collection.findAsync({}, {}).then(function(result) {
          return Promise.promisifyAll(result).toArrayAsync().then(function(documents) {
            assert.equal(1, documents.length, 'Collection contains more than one document');

            Object.keys(document).forEach(function(name) {
              assert.equal(JSON.stringify(document[name]), JSON.stringify(documents[0][name]));
            });

            return [ db, collection, document ];
          });
        });
      })
      .spread(function(db, collection, document) {
         var mulValue = 5;

         var incValue = 0.03;

         document.f6 = 'MonCache';

         document.f2 = document.f2 * mulValue;

         document.f3 = document.f3 + incValue;

         delete document.f7;

         var query = {
           _id: {
             $eq: document._id
           }
         };

         var modifications = {
          $set: {
            f6: 'MonCache'
          },
          $unset: {
            f7: ''
          },
          $mul: {
            f2: mulValue
          },
          $inc: {
            f3: incValue
          }
        };

        return collection.updateOneAsync(query, modifications).then(function(result) {
          assert.equal(true, result.hasOwnProperty('modifiedCount'), '{ updateOne } result does not contain "modifiedCount" field');

          assert.equal(1, result.modifiedCount, '{ updateOne } result contains wrong "modifiedCount" value');

          return [ db, collection, document ];
        });
      })
      .spread(function(db, collection, document) {
        var query = {
          f1: {
            $exists: true
          },
          f2: {
            $exists: true
          },
          f3: {
            $exists: true
          },
          f4: {
            $exists: true
          },
          f5: {
            $exists: true
          },
          f6: {
            $not: {
              $exists: false
            }
          },
          f7: {
            $not: {
              $exists: true
            }
          },
          f8: {
            $exists: false
          }
        };

        return collection.findOneAsync(query, {}).then(function(result) {
          Object.keys(document).forEach(function(name) {
            assert.equal(JSON.stringify(document[name]), JSON.stringify(result[name]));
          });

          return [ db, collection, document ];
        });
      })
      .spread(function(db, collection, document) {
        document.field1 = document.f1;
        document.field2 = document.f2;
        document.field3 = document.f3;
        document.field4 = document.f4;
        document.field5 = document.f5;
        document.field6 = document.f6;

        delete document.f1;
        delete document.f2;
        delete document.f3;
        delete document.f4;
        delete document.f5;
        delete document.f6;

        var query = {
          _id: {
            $ne: null
          }
        };

        var modifications = {
          $rename: {
            f1: 'field1',
            f2: 'field2',
            f3: 'field3',
            f4: 'field4',
            f5: 'field5',
            f6: 'field6'
          }
        };

        return collection.updateOneAsync(query, modifications).then(function(result) {
          assert.equal(true, result.hasOwnProperty('modifiedCount'), '{ updateOne } result does not contain "modifiedCount" field');

          assert.equal(1, result.modifiedCount, '{ updateOne } result contains wrong "modifiedCount" value');

          return [ db, collection, document ];
        });
      })
      .spread(function(db, collection, document) {
        var query = {
          field2: {
            $gt: 2014
          },
          field3: {
            $lt: 11
          }
        };

        var projection = {
          _id: false
        };

        return collection.findOneAsync(query, projection).then(function(result) {
          var projectedDocument = {};

          Object.keys(document).forEach(function(name) {
            if (name != '_id') {
              projectedDocument[name] = document[name];
            }
          });

          Object.keys(projectedDocument).forEach(function(name) {
            assert.equal(JSON.stringify(projectedDocument[name]), JSON.stringify(result[name]));
          });

          return [ db, collection, document ];
        });
      })
      .spread(function(db, collection, document) {
        return db;
      })
      .done(function(db) {
        db.close();
      });
    });
  }

  assertInsertOne({provider: require('mongodb'), name: 'mongodb'});

  assertInsertOne({provider: require('../'), name: 'moncache'});

});