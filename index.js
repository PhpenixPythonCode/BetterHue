require('dotenv').config()
const axios = require('axios')
const express = require('express')
var app = express()
const bodyParser = require('body-parser')
var converter = require('@q42philips/hue-color-converter');
const { Server } = require("socket.io");
const path = require('path')
app.use(express.static(path.join(__dirname, '/')))

var server = app.listen(3000, (err) => {
    if(err){
        console.error(err)
        throw err
    }else{
        console.log('Server listening on port 3000 (http://127.0.0.1:3000/)')
    }
})
var socket = require('socket.io')
var io = socket(server)

io.on("connection", (socket) => {
    setInterval(() => {
        axios.get(`http://${process.env.IP}/api/${process.env.NAME}/lights`)
            .then(function (response) {
                socket.emit("change", response.data);
            })
    }, 1500)
    
});

// app.use(express.static(''))
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req,res) => {
    res.sendFile(__dirname+'/public/index.html')
})

app.get('/getlightjson', (req,res) => {
    axios.get(`http://${process.env.IP}/api/${process.env.NAME}/lights`)
    .then(function (response) {
        res.json(response.data)
    })
})

app.post('/lighton', (req,res) => {
    axios.put(`http://${process.env.IP}/api/${process.env.NAME}/lights/${req.body.key}/state`, {"on":true})
    .then(function (response) {
        res.send('Light has been turned on')
    })
})

app.post('/lightoff', (req,res) => {
    axios.put(`http://${process.env.IP}/api/${process.env.NAME}/lights/${req.body.key}/state`, {"on":false})
    .then(function (response) {
        res.send('Light has been turned off')
    })
})

app.post('/changecolor', (req,res) => {
    console.log(req.body)
    axios.put(`http://${process.env.IP}/api/${process.env.NAME}/lights/${req.body.key}/state`, {"xy": converter.calculateXY(req.body.r, req.body.g, req.body.b, req.body.model)})
    .then(function (response) {
        res.send('Light has been changed')
    })
})

