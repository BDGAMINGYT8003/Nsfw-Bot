const chalk = require('chalk');

const anticrashHandler = (bot) => {
  bot.on('error', (err) => {
    console.log(chalk.red.bold('[ERROR]') + chalk.white(' ▸ Bot error:'), err);
  });

  process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log(chalk.red.bold('[EXCEPTION MONITOR]') + chalk.white(' ▸ '), err, origin);
  });

  process.on('rejectionHandled', (err) => {
    console.log(chalk.red.bold('[REJECTION HANDLED]') + chalk.white(' ▸ '), err);
  });

  process.on('warning', (warning) => {
    console.log(chalk.yellow.bold('[WARNING]') + chalk.white(' ▸ '), warning);
  });

  process.on('uncaughtException', (error) => {
    console.log(chalk.red.bold('[UNCAUGHT EXCEPTION]') + chalk.white(' ▸ '), error);
  });

  process.on('unhandledRejection', (reason) => {
    console.log(chalk.red.bold('[UNHANDLED REJECTION]') + chalk.white(' ▸ '), reason);
  });

  process.on('processTicksAndRejections', (request, reason) => {
    console.log(chalk.red.bold('[PROCESS TICKS]') + chalk.white(' ▸ '), reason);
  });

  process.on('exit', (code) => {
    console.log(chalk.blue.bold('[EXIT]') + chalk.white(` ▸ Process terminated with code ${code}`));
  });
};

module.exports = anticrashHandler;
