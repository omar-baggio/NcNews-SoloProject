const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `
    SELECT * FROM articles 
    WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          message: `article with id: ${article_id} does not exist`,
        });
      }
      return rows[0];
    });
};

exports.selectAllArticles = () => {
  let sqlString = `
  SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INT) AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY created_at DESC;
  `;

  return db.query(sqlString).then(({ rows }) => {
    return rows;
  });
};