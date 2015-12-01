var logger = require('./context.logger')('Format');

var Maybe = require('data.maybe');

var nsnjson = require('nsnjson-driver');

var Types = nsnjson.Types;
Types['OBJECT_ID'] = 'object_id';

var Format = nsnjson.Format;
Format['TYPE_MARKER_OBJECT_ID'] = 6;

var ObjectId = require('mongodb').ObjectId;

var customTypesEncoders = {};

customTypesEncoders[Types.OBJECT_ID] = {
  detector: function(data) {
    return data instanceof ObjectId;
  },
  encoder: function(objectId) {
    return Maybe.Just([Format.TYPE_MARKER_OBJECT_ID, objectId.toString()]);
  }
}

var customTypesDecoders = {};

customTypesDecoders[Types.OBJECT_ID] = {
  detector: function(presentation) {
    return  presentation[0] == Format.TYPE_MARKER_OBJECT_ID;
  },
  decoder: function(presentation) {
    return Maybe.Just(ObjectId(presentation[1]));
  }
}

var driver = nsnjson.withArrayStyle({
  encoders: customTypesEncoders,
  decoders: customTypesDecoders
});

module.exports = {
  encode: function(data) {
    logger.verbose('Format @ encode <= ' + JSON.stringify(data));

    var result = driver.encode(data);

    logger.verbose('Format @ encode => ' + JSON.stringify(result));

    return result.get();
  },
  decode: function(data) {
    logger.verbose('Format @ decode <= ' + JSON.stringify(data));

    var result = driver.decode(data);

    logger.verbose('Format @ decode => ' + JSON.stringify(result));

    return result.get();
  }
};