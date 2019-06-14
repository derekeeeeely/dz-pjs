const mysql = require("mysql");
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "liluo"
})

const ctr = (controller) => {
  return async (context, next) => {
    const params = context.params;
    const body = context.request.body;
    const query = context.query;
    context.status = 200;
    context.type = "json";
    try {
      const { paging, data, isDownload } = await controller(params, query, body, context);
      if (isDownload) {
        context.body = data;
      } else {
        context.body = { paging, data, success: true };
      }
    } catch (error) {
      context.body = { errorMessage: error, success: false };
    }
  }
}

const sqlQuery = function(sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
          connection.release();
        });
      }
    });
  });
};

// export { ctr };
module.exports = {
  ctr,
  sqlQuery
}