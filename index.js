const LineByLine = require('line-by-line');
const log4js = require('log4js');

let onceStarted = false;
const onceLog = () => {
  if (!onceStarted) {
    console.log('Processing...');
    onceStarted = true;
  }
};

const go = ({graylogSettings, pm2LogsFilePath} = {}) => {
  return new Promise(resolve => {
    log4js.configure({
      appenders: {
        gelf: { type: '@log4js-node/gelf', ...(graylogSettings || {}) }
      },
      categories: {
        default: { appenders: ['gelf'], level: 'info' }
      }
    });
    const logger = log4js.getLogger();
    const lineByLine = new LineByLine(pm2LogsFilePath);

    lineByLine.on('error', err => resolve(err));

    lineByLine.on('line', line => {
      onceLog();
      const parsed = JSON.parse(line);
      logger.info({GELF: true, _type: parsed.type, _orig_timestamp: parsed.timestamp,
        _app_name: parsed.app_name, _process_id: parsed.process_id},
        parsed.message);
    });

    lineByLine.on('end', () => {
      setTimeout(() => {
        console.log('All ended!');
        resolve();
      }, 5000);
    });
  });
};

module.exports = go;
