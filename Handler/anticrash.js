const chalk = require('chalk');

const anticrashHandler = (bot) => {
    bot.on('error', (err) => {
        console.error(chalk.red('[BOT ERROR] ▸'), err.stack || err);
    });

    process.on('uncaughtExceptionMonitor', (err, origin) => {
        console.error(chalk.red('[UNCAUGHT EXCEPTION MONITOR] ▸'), err.stack || err, origin);
    });
 
    process.on('rejectionHandled', (err) => {
        console.error(chalk.red('[REJECTION HANDLED] ▸'), err.stack || err);
    });
 
    process.on('warning', (warning) => {
        console.warn(chalk.yellow('[WARNING] ▸'), warning.stack || warning);
    });
 
    process.on('uncaughtException', (error) => {
        console.error(chalk.red('[UNCAUGHT EXCEPTION] ▸'), error.stack || error);
    });
 
    process.on('unhandledRejection', (reason) => {
        console.error(chalk.red('[UNHANDLED REJECTION] ▸'), reason.stack || reason);
    });
 
    process.on('processTicksAndRejections', (request, reason) => {
        console.error(chalk.red('[PROCESS TICKS AND REJECTIONS] ▸'), reason.stack || reason);
    });
 
    process.on('exit', (code) => {
        console.log(chalk.gray(`[PROCESS EXIT] ▸ Processus terminé avec le code ${code}`));
    });
};

module.exports = anticrashHandler;
