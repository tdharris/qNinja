var log4js = require('log4js'); // include log4js

log4js.configure({
    appenders: [
        {   type: 'file',
            filename: "/logs/app-debug.log",
            category: 'debug',
            maxLogSize: 20480,
            backups: 10
        }
	]
});

return log4js.getLogger('debug');