import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import mkdirp from 'mkdirp';
import { urlToFilename, getPageLinks } from "./util.js";

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

function spiderLinks(currentUrl, body, nesting, cb) {
  if (nesting === 0) {
    // Avoid zalgo
    return process.nextTick(cb);
  }

  const links = getPageLinks(currentUrl, body);
  if (links.length === 0) {
    return process.nextTick(cb);
  }

  function iterate(index) {
    if (index === links.length) {
      return cb();
    }

    spider(links[index], nesting - 1, function (err) {
      if (err) {
        return cb(err);
      }
      iterate(index + 1);
    });
  }

  iterate(0);
}

export function spider(url, nesting, cb) {
  const fileName = urlToFilename(url);
  fs.readFile(fileName, 'utf8', (err, fileContent) => {
    if (err) {
      if (err.code !== 'ENOENT') {
        return cb(err);
      }

      // file doesn't exist, download it
      return download(url, fileName, (err, requestContent) => {
        if (err) {
          return cb(err);
        }
        spiderLinks(url, requestContent, nesting, cb);
      });
    }

    // file already exists
    spiderLinks(url, fileContent, nesting, cb);
  });
}