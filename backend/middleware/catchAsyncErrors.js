module.exports = func => (req, res, next) => Promise.resolve(func(req, res, next)).catch((error) => {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  });
