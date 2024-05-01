"use strict";

const enableGlobalErrorLogging =
  process.env.ENABLE_GLOBAL_ERROR_LOGGING === "true";

// send 404 if no other route matched
exports.notFound = (req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
};

// setup a global error handler
exports.globalError = (err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
};
