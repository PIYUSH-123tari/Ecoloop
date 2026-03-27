const corsOptions = {
  // This allows requests from ANY website (Netlify, mobile, localhost, etc.)
  origin: (origin, callback) => {
    callback(null, true);
  },
  optionsSuccessStatus: 200
}

module.exports = corsOptions;