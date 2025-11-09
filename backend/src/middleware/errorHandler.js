const ApiError = require('../errors/ApiError');

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ApiError) {
    const errorResponse = {
      error: err.message,
    };
    if (err.details) {
      errorResponse.details = err.details;
    }
    return res.status(err.statusCode).json(errorResponse);
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({
    error: 'Something went wrong!',
    message: err.message,
  });
}

module.exports = errorHandler;

