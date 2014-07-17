var async = require('async'),
    logme = require('logme'),
    processEmail = require('./processEmail'),
    Report = require('./report'),
    api = require('express-api-helper'),
    transport = require('./transport');


// create a global queue that your whole server shares
var queue = async.queue(function(taskHandler, done) {
    // you would just call some function on the taskHandler here that you pushed in
    taskHandler.process(done);
}, 1);


// http request handler
module.exports = function(req, res, next) {

    var task = req.body;

    // create a task handler that does a eachLimit on the emails
    // it will processEmail and sendReport when done
    var taskHandler = {
        process: function(done) {

            var novellTransport = transport.novell(task.engineer, task.password),
                report = new Report(task.engineer, transport.notify());

            // Append what is needed for each mail item to process
            var emails = task.emails.map(function(mail){
                mail.report = report;
                mail.fromUser = task.fromUser;
                mail.ccSupport = task.ccSupport;
                mail.content = task.content;
                mail.signature = task.signature;
                mail.transport = novellTransport;
            });

            async.eachLimit(
                task.emails, 3, 
                processEmail,
                function() {
                    // Close the smtp connection pool
                    novellTransport.close();
                    report.send(done);
                    // report.sendReport(notifyTransport, done);
                }
            );

        }
    };

    queue.push(taskHandler);
    
    // send response that their work has been queued
    // api.serverError(req, res, 'Uh oh!');
    api.ok(req, res, 'Task has been queued!');
};

