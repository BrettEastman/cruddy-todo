const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId(callback);
  counter.getNextUniqueId((err, id) =>{
    if (err) {
      throw ('error accessing id');
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if (err) {
          // throw 'error writing file'; -> probably only needed if we want to stop the chain?
          callback(err, null);
        } else {
          callback(null, {id: id, text: text});
        }
      });
    }
  });
  // fs.writeFile(path.join(exports.dataDir, ));
  // // console.log(exports.dataDir);
  // // items[id] = text;
  // callback(null, { id, text });
};

exports.readAll = (callback) => {
  var data = fs.readdirSync(exports.dataDir).map(function(item) {
    var index = item.indexOf('.');
    return {id: item.slice(0, index), text: item.slice(0, index)};
  });

  callback(null, data);
};

exports.readOne = (id, callback) => {
  // when fs is done reading the data from this file path, it will go to the callback. If error, it will pass the error as first parameter. Otherwise, the results of the reading will be in the second parameter, which we have named "data". The only way we get data out is by calling the callback.
  // "If no encoding is specified, then the raw buffer is returned."
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), 'utf8', (err, data) => {
    if (err) {
      return callback(err, null);
    } else {
      return callback(null, { id: id, text: data });
    }
  });
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
