module.exports = (err, req, res, next) => {
  console.error(err);
  // Basic error handler — you can expand for better error typing
  const status = err.statusCode || 500;
  const message = err.message || 'Server Error';
  res.status(status).json({ success: false, message, stack: process.env.NODE_ENV === 'production' ? undefined : err.stack });
};
