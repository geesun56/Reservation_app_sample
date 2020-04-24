/*
    curl command examples
    (1) curl http://127.0.0.1:3000/getdog : SET request at root/getdog directory     
    (2) curl -X PUT http://127.0.0.1:3000/getcat : -X command changes the type of request

*/



/* Add a username to the system (no password or auth required)
Retrieve the reservation info (if they have one) for a given user.
Get a list of reservations for all users.
Create a reservation for a given user. It should specify username, start date, start time, and number of hours
Update a reservation for a given user. It should specify username, start date, start time, and number of hours
Delete a reservation for a given user
Provide a list of these APIs (and their accompanying HTTP methods) with your submission. */


/* {"user": "geesun", "Date": "04-18-2020", "Time": "12:00 PM", "Hours": "3"} : reservation info structure*/

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const port = 3000;
const db_file = './skate.json'

const json_placeholder = `{"user": [], "reservation" : {}}`
const apiList = ['localhost:3000/addUser/USERNAME',
                'localhost:3000/getReservationInfo/USERNAME',
                'localhost:3000/getReservationList/',
                'localhost:3000/createReservation/USERNAME',
                'localhost:3000/updateReservation/USERNAME',
                'localhost:3000/deleteReservation/USERNAME',
                'localhost:3000/apiList']


const app = express();

app.use(cors());

fs.exists(db_file, (ex) => {
    
    if (ex) {
        console.log(`Server> JSON file loaded`)
    }else{
        fs.appendFile(db_file, json_placeholder, err  => {
            if(err) throw err;
            console.log(`Server> JSON not exist... JSON file created`);
        })
    }
  });

function load_JSON_file(fileName){
    var data = fs.readFileSync(fileName);
    return JSON.parse(data);
}

function save_JSON_file(fileName, data){
    console.log(data);
    let savedata  = JSON.stringify(data);
    console.log(savedata);
    fs.writeFileSync(fileName, savedata, 'utf-8')

    fs.writeFileSync(fileName, savedata, 'utf-8', () => {
        if(err) return
    });
}

app.post('/addUser/:userName', (req, res) => {  //Add a user to database
    let user_id = req.params.userName;
    let db_data= load_JSON_file(db_file);

    if(db_data.user.indexOf(user_id)==-1){
        db_data.user.push(user_id);
        save_JSON_file(db_file, db_data);
        console.log(`Server> User ${user_id} added.`)
        res.send(`Server> New user added.`);
    }else{
        res.status(400)
        res.send(`Server> User ${user_id} already in user list.`)
    } 
    
})

app.get('/getReservationInfo/:userName', (req, res) => {    //Retrieve the reservation info for a given user
    let user_id = req.params.userName
    let db_data= load_JSON_file(db_file);
    let respond = ""
    res.status(204);
    
    if(!(db_data.user.includes(user_id))){
        respond = `Error: User does not exist.`
        res.status(406)
    }
    else if(user_id in db_data.reservation){
        respond = db_data.reservation[user_id];
        res.status(200);
    } 
    else{
        respond = `Reservation does not exist.`
        res.status(202)
    }

    res.send(respond);
})

app.get('/getReservationList', (req, res) => { // Get a list of reservation
    let db_data= load_JSON_file(db_file);
    const reserv_list = db_data.reservation;
    if(Object.keys(reserv_list).length > 0) res.send(db_data.reservation);
    else{
        res.status(404);
        res.send("No list available")
        
    }    
    
})

app.post('/createReservation/:userName/date/:startDate/time/:startTime/hrs/:hours', (req, res) => {    /* Create a reservation for a given user. It should specify username, start date, start time, and number of hours */

    let user_id = req.params.userName
    let start_date = req.params.startDate
    let start_time = req.params.startTime
    let hours = req.params.hours
    
    let newResv = {User: user_id, Date: start_date, Time: start_time, Hours: hours}
    let db_data = load_JSON_file(db_file)
    let respond = ''
    console.log(db_data.user)
    console.log(user_id in db_data.user)
    if(!db_data.user.includes(user_id)){
        console.log("User info does not exist")
        respond = 'Error: User info does not exist'
        res.status(404);
    }
    else if(user_id in db_data.reservation){
        console.log("reservation already exists"); 
        respond = 'Error: reservation already exist'
        res.status(406)
    }
    else{
        db_data.reservation[user_id] =  newResv
        console.log(db_data)
        save_JSON_file(db_file, db_data);
        respond = 'Reservation created successfully'
    }
    console.log("Server> create request")
    res.send(respond);
})

app.post('/updateReservation/:userName/date/:startDate/time/:startTime/hrs/:hours', (req, res) => {    /**Update a reservation for a given user. It should specify username, start date, start time, and number of hours */
    
    let user_id = req.params.userName
    let start_date = req.params.startDate
    let start_time = req.params.startTime
    let hours = req.params.hours
    
    let db_data = load_JSON_file(db_file)
    
    if(user_id in db_data.reservation){
        db_data.reservation[user_id].Date = start_date
        db_data.reservation[user_id].Time = start_time
        db_data.reservation[user_id].Hours = hours
        save_JSON_file(db_file, db_data);
        res.send("Server> Reservation updated.")
    }
    else{
        res.status(406);
        res.send("reservation does not exist."); 
        
    }
})

app.post('/deleteReservation/:userName', (req, res) => {    /**Delete a reservation for a given user */
    let user_id = req.params.userName

    let db_data = load_JSON_file(db_file)
    let respond = ``
    if(user_id in db_data.reservation){
        delete db_data.reservation[user_id]
        save_JSON_file(db_file, db_data);
        respond = 'Reservation of ' + user_id + ' deleted successfully.'
    }else{
        respond = 'Error: Reservation does not exist.'
        res.status(406);
    }

    res.send(respond);
})

app.get('/apiList', (req, res) => {     /* Provide a list of these APIs (and their accompanying HTTP methods) with your submission. */
    res.send(apiList);
})

app.listen(port, () => console.log(`Server> Listening on Port : ${port}`));


