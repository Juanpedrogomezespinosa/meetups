const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  const message = err.message || "Error interno del servidor";

  res.status(status).json({ status: "error", message });
};

module.exports = errorHandler;
