const db = require("../db/connection");

exports.selectAllUsers = () => {
  let sqlString = `
    SELECT * FROM users
    `;

  return db.query(sqlString).then(({ rows }) => {
    return rows;
  });
};
