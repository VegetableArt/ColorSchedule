const express = require('express')
const app = express()
const port = 3001
var excel = require('xlsx');
var rest = 0;
var multer = require('multer')
var cors = require('cors');
app.use(cors())

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'tmp')
  },
  filename: function (req, file, cb) {
    cb(null, "newData.xlsm" )
  }
  })
  
  var upload = multer({ storage: storage }).single('file')
  
  function parseDate(input) {
    var str = input;
    var dmy = str.split("/");
    var d = (dmy[2] + '-' +dmy[1] + '-' + dmy[0]);
    return d  
  }

  function ExcelDateToJSDate(date) {
    return parseDate(new Date(Math.round((date - 25569)*86400*1000)).toLocaleDateString());
  }
//////////////////////
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost/';

//////////////////////


function insertGroupData(groups){
    MongoClient.connect(url, function(err, client) {
        let db = client.db("colorschedule");
        db.collection('groups').drop();
        db.collection('groups').insertMany(groups)
    }); 
}

function insertActivityData(activities){
    for (row in activities){
        activities[row].fromHour = ((activities[row].fromHour*24+ '').split('.')[0]+":"+((activities[row].fromHour*24+'').split('.')[1]*60+'').substr(0, 2)) || "";
        activities[row].toHour = ((activities[row].toHour*24+ '').split('.')[0]+":"+((activities[row].toHour*24+'').split('.')[1]*60+'').substr(0, 2)) || ""
    }
    MongoClient.connect(url, function(err, client) {
        let db = client.db("colorschedule");
        db.collection('activities').drop();
        db.collection('activities').insertMany(activities)
    }); 
}

function insertCalendarData(calendar){
    for (row in calendar){
        calendar[row].date = ExcelDateToJSDate(calendar[row].date)
    }
    MongoClient.connect(url, function(err, client) {
        let db = client.db("colorschedule");
        db.collection('calendar').drop();
        db.collection('calendar').insertMany(calendar)
    }); 
};




app.get('/api/dates', (req, res) => {
    MongoClient.connect(url, function(err, client) {
        let db = client.db("colorschedule");
        db.collection('calendar').find({}).toArray(function(err,result){
            if(err) throw err;
            res.send(result)
        });
    }); 
  return;
})

app.get('/api/activities', (req, res) => {
    MongoClient.connect(url, function(err, client) {
        let db = client.db("colorschedule");
        db.collection('activities').find({}).toArray(function(err,result){
            if(err) throw err;
            res.send(result)
        });
    }); 
  return;
})
app.get('/api/groups', (req, res) => {
    MongoClient.connect(url, function(err, client) {
        let db = client.db("colorschedule");
        db.collection('groups').find({}).toArray(function(err,result){
            if(err) throw err;
            res.send(result)
        });
    }); 
  return;
})


app.get('/api/excelFile', (req, res) => {
  
  let fileName = "tmp/newData.xlsm";
  let workbook = excel.readFile(fileName);

  var calendar = excel.utils.sheet_to_json(workbook.Sheets["calendar"], {header:0})
  var groups = excel.utils.sheet_to_json(workbook.Sheets["groups"], {header:0})
  var daynumbers = excel.utils.sheet_to_json(workbook.Sheets["daynumbers"], {header:0})
  var times = excel.utils.sheet_to_json(workbook.Sheets["times"], {header:0})
  var activities = excel.utils.sheet_to_json(workbook.Sheets["activities"], {header:0})
  insertGroupData(groups)
  insertActivityData(activities)
  insertCalendarData(calendar)
  res.send("Succesfully updated database!")
})



app.post('/api/upload', function(req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err)
        return res.status(500).json(err)
    } else if (err) {
        console.log(err)
        return res.status(500).json(err)
    }
    
    
    return res.status(200).send(req.file)

})
});


app.listen(port, () => {
  console.log(`Colorschedule REST Service listening at http://localhost:${port}`)
})


