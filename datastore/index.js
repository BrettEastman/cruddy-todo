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
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err)=>{
        if (err) {
          throw 'error writing file';
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
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
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
