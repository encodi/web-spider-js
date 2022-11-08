import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import mkdirp from 'mkdirp';
import { urlToFilename } from "./util.js";

function saveFile(fileName, contents, cb) {
  mkdirp(path.dirname(fileName), err => {
    if (err) {
      return cb(err);
    }
    fs.writeFile(fileName, contents, cb);
  });
}

function download (url, fileName, cb) {
  console.log(`Downloading ${url} into ${fileName}`);
  superagent.get(url).end((err, res) => {
    if (err) {
      return cb(err);
    }
    saveFile(fileName, res.text, err => {
      if (err) {
        return cb(err);
      }
      console.log(`Downloaded and saved: ${url}`);
      cb(null, res.text);
    });
  });
}

export function spider(url, cb) {
  const fileName = urlToFilename(url);
  fs.access(fileName, err => {
    if (!err || err.code !== 'ENOENT') {
      return cb(null, fileName, false);
    }
    download(url, fileName, err => {
      if (err) {
        return cb(err);
      }
      cb(null, fileName, true);
    });
  });
}