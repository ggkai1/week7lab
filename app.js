let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let mongodb = require('mongodb');

let mongoose = require('mongoose');

const Task = require('./models/tasks');
const Developer = require('./models/developers');

const MongoClient = mongodb.MongoClient;


const url = "mongodb://localhost:27017/LabWeek7";

let db;


mongoose.connect(url, function (err) {
    if (err) {
        console.log('Error in Mongoose connection');
        throw err;
    }
    console.log('Successfully connected');

    app.use(bodyParser.urlencoded({
        extended: false
    }));

    app.use(bodyParser.json());

    app.use(express.static('images'));
    app.use(express.static('css'));

    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');

    app.get('/', function (req, res) {
        res.render('index.html');
    });

    app.get('/addtask', function (req, res) {
        res.render('addtasks.html');
    });

    app.post('/newtask', function (req, res) {
        let taskdetails = req.body;
        taskdetails.taskstatus = "InProgress"
        let task1 = new Task({
            _id: new mongoose.Types.ObjectId(),
            name: taskdetails.taskname,
            assignto: taskdetails.taskassigned,
            due: taskdetails.taskdue,
            status: taskdetails.taskstatus,
            description: taskdetails.taskdesc
        });
        task1.save(function (err) {
            if (err) throw err;
            console.log('Task successfully added to DB');
        });
        res.redirect('listtasks');
    });

    app.get('/listtasks', function (req, res) {
        Task.find({}, function (err, taskdata) {
            res.render('listtasks.html', {
                taskdb: taskdata
            });
        });;
    });

    app.get('/deletetask', function (req, res) {
        res.render('deletetask.html');
    });


    app.post('/deletetaskdata', function (req, res) {
        let taskdetails = req.body;
        Task.deleteOne({ _id: taskdetails.taskId }, function (err, taskdb) {
            console.log(taskdb);
        });
        res.redirect('listtasks'); 
    });
    

    app.post('/deletealltasks', function (req, res) {
        Task.deleteMany({status: 'Completed'}, function (err, taskdb) {
            console.log(taskdb);
        });
        res.redirect('listtasks');
    });

    app.get('/updatetask', function (req, res) {
        res.render('updatetask.html');
    });

    app.post('/updatetaskdata', function (req, res) {
        let taskdetails = req.body;
        let filter = {
            _id: taskdetails.taskId
        };
        let update = {
            $set: {
                status: 'Completed'
            }
        };
        Task.updateOne(filter, update,  function (err, taskdb){
            console.log(taskdb);
        });
        res.redirect('/listtasks');
    });

    app.post('/updatecompletedtask', function (req, res) {
        let taskdetails = req.body;
       
        Task.updateOne({ _id: taskdetails.taskId }, { $set: { status: 'InProgress' } }, function (err, taskdb) {
            console.log(taskdb);
        });
        res.redirect('/listtasks');
    });

    app.get('/adddeveloper', function (req, res) {
        res.render('adddeveloper.html');
    });

    app.post('/newdeveloper', function (req, res) {
        let developerdetails = req.body;
        let developer1 = new Developer({
            _id: new mongoose.Types.ObjectId(),
            developername: {
                firstName: developerdetails.developerfirstname,
                lastName: developerdetails.developerlastname
            },
            level: String(developerdetails.developerlevel),
            address: {

                state: developerdetails.stateaddress,
                suburb: developerdetails.suburbaddress,
                street: developerdetails.streetaddress,
                unit: developerdetails.unitaddress
            }
        });
        developer1.save(function (err) {
            if (err) throw err;
            console.log('Developer successfully added to DB');
        });
        res.redirect('listdevelopers');
    });

    app.get('/listdevelopers', function (req, res) {
        Developer.find({}, function (err, developerdata) {
            res.render('listdevelopers.html', {
                developerdb: developerdata
            });
        });
    });


});
app.listen(8080);