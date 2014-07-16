var async = require('async'),
    processEmail = require('./process-email'),
    report = require('./report'),
    api = require('express-api-helper');


// create a global queue that your whole server shares
var queue = async.queue(function(taskHandler, done) {
    // you would just call some function on the taskHandler here that you pushed in
    taskHandler.process(done);
}, 1);


// http request handler
module.exports = function(req, res, next) {

    var task = req.body,
        handler = require('./taskHandler');

    // create a task handler that does a eachLimit on the emails
    // it will processEmail and sendReport when done
    var taskHandler = {
        process: function(done) {

            report.initReport(task.engineer);
            
            // How do I create config object: item, task, transport?
            var transport = require('./createNovellTransport');

                config = {
                    // item is only accessible as first parameter in processEmail.. 
                    // not sure how to take that and add it to config along with task and transport...
                    item: item, 
                    task: task,
                    transport: transport
                };


            async.eachLimit(
                task.emails, 3, 
                processEmail(item, done), 
                report.sendReport()
            );

        }
    };

    queue.push(taskHandler);
    
    // send response that their work has been queued
    // api.serverError(req, res, 'Uh oh!');
    api.ok(req, res, 'Task has been queued!');
};

