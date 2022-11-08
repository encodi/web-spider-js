import { spider } from "./spider.js";

spider(process.argv[2], (err, fileName, downloaded) => {
  if (err) {
    console.error(err);
  } else if (downloaded) {
    console.log(`Completed the download of "${fileName}"`);
  } else {
    console.log(`"${fileName}" was alread downloaded`);
  }
});