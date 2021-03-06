var logger = require('./context.logger')('Driver');

var ObjectId = require('mongodb').ObjectId;

var Formatter = require('./moncache.format.formatter');

function MonCacheDriver() {};

MonCacheDriver.connect = function(callback) {
  logger.verbose('connect');

  var CacheDriver = require('cache').Cache;

  if (!MonCacheDriver.driver) {
    MonCacheDriver.driver = new CacheDriver();

    var connection = {
      path: process.env.GLOBALS_HOME + '/mgr',
      username: process.env.MONCACHE_USERNAME,
      password: process.env.MONCACHE_PASSWORD,
      namespace: process.env.MONCACHE_NAMESPACE
    };

    MonCacheDriver.driver.open(connection, function(error, info) {
      logger.verbose('Connection info: ', {error: error, info: info});

      callback(error);
    });
  } else {
    callback(0);
  }
};

MonCacheDriver.isConnected = function() {
  return !!(MonCacheDriver.driver);
};

MonCacheDriver.isNotConnected = function() {
  return !MonCacheDriver.isConnected();
};

MonCacheDriver.execute = function(parameters, callback) {
  logger.verbose('execute ', parameters);

  if (MonCacheDriver.isNotConnected()) {
    var error = 'MonCacheDriver is not connected';

    logger.error('execute', error);

    callback(true, {error: error});
  } else {
    MonCacheDriver.driver.function(parameters, function(callError, callResponse) {
      logger.verbose('call', {error: callError, response: callResponse});

      if (callError) {
        var error = 'MonCacheDriver call problem: ' + JSON.stringify(callResponse);

        logger.error('call', error);

        callback(true, {error: error});
      } else {
        try {
          var response = Formatter.decode(JSON.parse(callResponse.result));

          if (response.hasOwnProperty('error')) {
            var error = 'Invalid MonCacheDriver response: ' + JSON.stringify(response.error);

            logger.error('call', error);

            callback(true, {error: error});
          }
          else if (!response.hasOwnProperty('data')) {
            var error = 'Invalid MonCacheDriver response: response has no data';

            logger.error('call', error);

            callback(true, {error: error});
          }
          else {
            callback(false, response.data);
          }
        } catch(e) {
          var error = 'Invalid MonCacheDriver response: invalid response'

          logger.error('call', error, e);

          callback(true, {error: error});
        }
      }
    });
  }
};

MonCacheDriver.insert = function(dbName, collectionName, document, callback) {
  logger.verbose('insert', dbName, collectionName, document);

  if (!document.hasOwnProperty('_id')) {
    document['_id'] = ObjectId();
  }

  var parameters = {
    function: 'insert^MonCacheDriver',
    arguments: [
      dbName,
      collectionName,
      JSON.stringify(Formatter.encode(document))
    ]
  };

  MonCacheDriver.execute(parameters, callback);
};

MonCacheDriver.save = function(dbName, collectionName, document, callback) {
  logger.verbose('save', dbName, collectionName, document);

  if (!document.hasOwnProperty('_id')) {
    document['_id'] = ObjectId();
  }

  var parameters = {
    function: 'save^MonCacheDriver',
    arguments: [
      dbName,
      collectionName,
      JSON.stringify(Formatter.encode(document))
    ]
  };

  MonCacheDriver.execute(parameters, callback);
};

MonCacheDriver.count = function(dbName, collectionName, query, callback) {
  logger.verbose('count', dbName, collectionName, query);

  var parameters = {
    function: 'count^MonCacheDriver',
    arguments: [
      dbName,
      collectionName,
      JSON.stringify(Formatter.encode(query))
    ]
  };

  MonCacheDriver.execute(parameters, callback);
};

MonCacheDriver.find = function(dbName, collectionName, query, projection, callback) {
  logger.verbose('find', dbName, collectionName, query, projection);

  var parameters = {
    function: 'find^MonCacheDriver',
    arguments: [
      dbName,
      collectionName,
      JSON.stringify(Formatter.encode(query)),
      JSON.stringify(Formatter.encode(projection))
    ]
  };

  MonCacheDriver.execute(parameters, callback);
};

MonCacheDriver.findOne = function(dbName, collectionName, query, projection, callback) {
  logger.verbose('findOne', dbName, collectionName, query, projection);

  var parameters = {
    function: 'findOne^MonCacheDriver',
    arguments: [
      dbName,
      collectionName,
      JSON.stringify(Formatter.encode(query)),
      JSON.stringify(Formatter.encode(projection))
    ]
  };

  MonCacheDriver.execute(parameters, callback);
};

MonCacheDriver.update = function(dbName, collectionName, query, modifications, parameters, callback) {
  logger.verbose('update', dbName, collectionName, query, modifications, parameters);

  var parameters = {
    function: 'update^MonCacheDriver',
    arguments: [
      dbName,
      collectionName,
      JSON.stringify(Formatter.encode(query)),
      JSON.stringify(Formatter.encode(modifications)),
      JSON.stringify(Formatter.encode(parameters))
    ]
  };

  MonCacheDriver.execute(parameters, callback);
};

MonCacheDriver.remove = function(dbName, collectionName, query, parameters, callback) {
  logger.verbose('remove', dbName, collectionName, query, parameters);

  var parameters = {
    function: 'remove^MonCacheDriver',
    arguments: [
      dbName,
      collectionName,
      JSON.stringify(Formatter.encode(query)),
      JSON.stringify(Formatter.encode(parameters))
    ]
  };

  MonCacheDriver.execute(parameters, callback);
};

MonCacheDriver.close = function() {
  logger.verbose('close connection');

  MonCacheDriver.driver.close();

  MonCacheDriver.driver = null;
};

module.exports = MonCacheDriver;
