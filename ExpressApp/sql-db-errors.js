exports.invalidInput = (err, req, res, next) => {
  console.log(err);
  if (err.status === 404) {
    res.status(404).send({ msg: "Not Found" });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  }
};
