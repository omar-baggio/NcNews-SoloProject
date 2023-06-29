const psqlErrors = (err, req, res, next) => {
  if (
    err.code === "22P02" ||
    err.code === "42703" ||
    err.code === "42601" ||
    err.code === "23502"
  ) {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503" || err.code === "22003") {
    res.status(404).send({ msg: "Not Found" });
  } else {
    next(err);
  }
};

const customErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

const internalServerError = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};

module.exports = { psqlErrors, customErrors, internalServerError };
