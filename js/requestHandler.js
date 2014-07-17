var async = require('async'),
    logme = require('logme'),
    processEmail = require('./processEmail'),
    report = require('./report'),
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

            transport.init(task.engineer, task.password);
            report.init(task.engineer, transport.get('notify'));
            
            // Append what is needed for each mail item to process
            task.emails.forEach(function(mail){
                mail.fromUser = task.fromUser;
                mail.ccSupport = task.ccSupport;
                mail.content = task.content;
                mail.signature = task.signature;
                mail.transport = transport.get('novell');
            });

            async.eachLimit(
                task.emails, 3, 
                processEmail, 
                report.sendReport
            );

        }
    };

    queue.push(taskHandler);
    
    // send response that their work has been queued
    // api.serverError(req, res, 'Uh oh!');
    api.ok(req, res, 'Task has been queued!');
};

