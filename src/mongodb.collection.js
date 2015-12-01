var logger = require('./context.logger')('MongoDB Collection'); 

var MonCacheDriver = require('./moncache.driver');

function Collection(db, collectionName) {
  this.db = db;

  this.name = collectionName;
};

Collection.prototype.getName = function() {
  return this.name;
};

Collection.prototype.getDBName = function() {
  return this.db.getName();
};

Collection.prototype.insertOne = function(document, callback) {
  logger.verbose('[' + this.getDBName() + '.' + this.getName() + ' @ insert]', document);

  MonCacheDriver.insert(this.getDBName(), this.getName(), document, function(error, data) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, {insertedCount: data.nInserted, insertedId: document['_id']});
    }
  });
};

Collection.prototype.saveOne = function(document, callback) {
  logger.verbose('[' + this.getDBName() + '.' + this.getName() + ' @ save]', document);

  MonCacheDriver.save(this.getDBName(), this.getName(), document, function(error, data) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, {nInserted: data.nInserted, nModified: data.nModified, nRemoved: data.nRemoved});
    }
  });
};

Collection.prototype.count = function(query, callback) {
  logger.verbose('[' + this.getDBName() + '.' + this.getName() + ' @ count]', query);

  MonCacheDriver.count(this.getDBName(), this.getName(), query, function(error, data) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, data.count);
    }
  });
};

Collection.prototype.find = function(query, projection, callback) {
  logger.verbose('[' + this.getDBName() + '.' + this.getName() + ' @ find]', query, projection);

  MonCacheDriver.find(this.getDBName(), this.getName(), query, projection, function(error, data) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, {
        toArray: function(cb) {
          cb(null, data);
        }
      });
    }
  });
};

Collection.prototype.findOne = function(query, projection, callback) {
  logger.verbose('[' + this.getDBName() + '.' + this.getName() + ' @ findOne]', query, projection);

  MonCacheDriver.findOne(this.getDBName(), this.getName(), query, projection, function(error, data) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, data);
    }
  });
};

Collection.prototype.update = function(query, modifications, parameters, callback) {
  logger.verbose('[' + this.getDBName() + '.' + this.getName() + ' @ update]', query, modifications, parameters);

  MonCacheDriver.update(this.getDBName(), this.getName(), query, modifications, parameters, function(error, data) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, {modifiedCount: data.nModified});
    }
  });
};

Collection.prototype.updateOne = function(query, modifications, callback) {
  logger.verbose('[' + this.getDBName() + '.' + this.getName() + ' @ update]', query, modifications);

  var parameters = {
    upsert: false,
    multi: false
  };

  this.update(query, modifications, parameters, callback);
};

Collection.prototype.updateMany = function(query, modifications, callback) {
  logger.verbose('[' + this.getDBName() + '.' + this.getName() + ' @ update]', query, modifications);

  var parameters = {
    upsert: false,
    multi: true
  };

  this.update(query, modifications, parameters, callback);
};

Collection.prototype.remove = function(query, parameters, callback) {
  logger.verbose('[' + this.getDBName() + '.' + this.getName() + ' @ remove]', query, parameters);

  MonCacheDriver.remove(this.getDBName(), this.getName(), query, parameters, function(error, data) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, {nInserted: data.nInserted, nModified: data.nModified, nRemoved: data.nRemoved});
    }
  });
};

Collection.prototype.deleteOne = function(query, callback) {
  logger.verbose('[' + this.getDBName() + '.' + this.getName() + ' @ remove]', query);

  var parameters = {
    justOne: true
  };

  this.remove(query, parameters, callback);
};

Collection.prototype.deleteMany = function(query, callback) {
  logger.verbose('[' + this.getDBName() + '.' + this.getName() + ' @ remove]', query);

  var parameters = {
    justOne: false
  };

  this.remove(query, parameters, callback);
};

module.exports = Collection;