const oss = require('ali-oss');
const co = require('co');
const glob = require('glob');
const path = require('path');

const projectName = 'ekko/cousins';

const store = oss({

});
console.log(path.resolve(__dirname, '../'));
const staticPath = path.resolve(__dirname, '../dist');
glob(`${staticPath}/*.*`, (err, files) => {
  if (err) {
    console.error(err);
    throw err;
  } else {
    files.forEach(fileName => {
      const relativePath = fileName.replace(`${staticPath}/`, '');
      console.log(relativePath);

      if (relativePath.endsWith('.html')) {
        const options = {
          headers: {
            'Cache-Control': 'no-cache',
          },
        };
        co(function* () {
          return yield store.put(`${projectName}/${relativePath}`, fileName, options);
        }).then(
          val => console.log(`${relativePath} has been uploaded to oss :${val.name}`),
          error => {
            console.error(error.stack);
            throw error;
          }
        );
      } else {
        co(function* () {
          return yield store.put(`${projectName}/${relativePath}`, fileName);
        }).then(
          val => console.log(`${relativePath} has been uploaded to oss :${val.name}`),
          error => {
            console.error(error.stack);
            throw error;
          }
        );
      }
    });
  }
});
