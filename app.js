var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

//Init app
let app = express();

//Set static path
app.use(express.static(path.join(__dirname,'public'))) //This overides the / route

//Home route
app.get('/', (req,res) => {
    res.sendFile('./index.html');
})

app.get('/test', (req,res) => {
    res.render('test');
})

//Start server
app.listen(3000,() => {
    console.log('Server started on port 3000...');
});