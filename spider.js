import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import mkdirp from 'mkdirp';
import { urlToFilename } from "./util.js";

export function spider(url, cb) {
  const fileName = urlToFilename(url);
  fs.access(fileName, err => {
    if (err && err.code === 'ENOENT') {
      console.log(`Downloading ${url} into ${fileName}`);
      superagent.get(url).end((err, res) => {
        if (err) {
          cb(err);
        } else {
          mkdirp(path.dirname(fileName), err => {
            if (err) {
              cb(err);
            } else {
              fs.writeFile(fileName, res.text, err => {
                if (err) {
                  cb(err);
                } else {
                  cb(null, fileName, true);
                }
              });
            }
          });
        }
      });
    } else {
      cb(null, fileName, false);
    }
  });
}