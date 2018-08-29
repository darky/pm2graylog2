#!/usr/bin/env node

const program = require('commander');

program
  .version('0.0.1')
  .option('-h, --host <string>', 'Graylog2 host (default: localhost)')
  .option('-p, --port <n>', 'Graylog2 UDP port (default: 12201)')
  .option('-f, --file <path>', 'Path to pm2 log file')
  .parse(process.argv);

if (!program.file) {
  console.error('--file required');
  process.exit(1);
}

const {host, port} = program;

(async () => {
  const err = await require('./index')({
    graylogSettings: {...host ? {host} : {}, ...port ? {port} : {}},
    pm2LogsFilePath: program.file
  });
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    process.exit(0);
  }
})();
