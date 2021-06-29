var bunyan = require('bunyan');
var RotatingFileStream = require('bunyan-rotating-file-stream');
var log = console;

if (process.env.APP_ENV == "debug") {
  log = bunyan.createLogger({
    name: 'qc_capillary',
    streams: [{
      type: 'raw',
      stream: new RotatingFileStream({
        path: './logs/info.log',
        period: '1d',          // daily rotation
        totalFiles: 30,        // keep 30 back copies
        rotateExisting: true,  // Give ourselves a clean file when we start up, based on period
        gzip: true             // Compress the archive log files to save space
      })
    }]
  });
}

export default log;