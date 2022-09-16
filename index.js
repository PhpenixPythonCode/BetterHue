require('dotenv').config()
const axios = require('axios')
const express = require('express')
var app = express()
const bodyParser = require('body-parser')

app.use(express.static('public'))
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
    axios.put(`http://${process.env.IP}/api/${process.env.NAME}/lights/${req.body.key}/state`, {"on": true, "sat": parseInt(req.body.sat), "bri": parseInt(req.body.bri), "hue": parseInt(req.body.hue)})
    .then(function (response) {
        res.send('Light has been changed')
    })
})

app.listen(3000, (err) => {
    if(err){
        console.error(err)
        throw err
    }else{
        console.log('Server listening on port 3000 (http://127.0.0.1:3000/)')
    }
})

console.log(`http://${process.env.IP}/api/${process.env.NAME}/lights`)