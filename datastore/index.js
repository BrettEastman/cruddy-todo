const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

const querystring = require('querystring');
var Promise = require('bluebird');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId(callback);
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw ('error accessing id');
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if (err) {
          // throw 'error writing file'; -> probably only needed if we want to stop the chain?
          callback(err, null);
        } else {
          callback(null, { id: id, text: text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  // fs.readdir(exports.dataDir, (err, files) => {
  //   if (err) {
  //     callback(err, null);
  //   } else {
  //     const data = files.map((file) => {
  //       const id = path.basename(file, '.txt');
  //       return { id, text: id };
  //     });
  //     callback(null, data);
  //   }
  // });
  var readdirAsync = Promise.promisify(fs.readdir);

  return readdirAsync(exports.dataDir)
    .then(
      (files) =>{
        const data = files.map((file) => {
          const id = path.basename(file, '.txt');
          return { id, text: id };
        });
        return data;
      }
    )
    .then(
      (todoList)=>{
        Promise.all(todoList).then( (todo)=>{
          console.log('todo: ', todo);
          callback(null, todo);
        });
      }
    )
    .catch(
      (err) =>{
        console.log('readall err', err.messages);
      }
    );
};

exports.readOne = (id, callback) => {
  // when fs is done reading the data from this file path, it will go to the callback. If error, it will pass the error as first parameter. Otherwise, the results of the reading will be in the second parameter, which we have named "data". The only way we get data out is by calling the callback.
  // "If no encoding is specified, then the raw buffer is returned."
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), 'utf8', (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, { id: id, text: data });
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if (err) {
          throw 'unable to update';
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
    if (err) {
      callback(err, null);
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
