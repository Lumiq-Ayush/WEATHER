const express = require("express");
const fs = require("fs");
const requests = require('requests');
const cors = require('cors');

const app = express(); // Create an Express.js app
const port = 8000;
app.use(cors()); // Enable CORS for the app

const homeFile = fs.readFileSync("index.html", "utf-8");

const replaceval = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    return temperature;

};


app.get("/", (req, res) => {
    requests('https://api.openweathermap.org/data/2.5/weather?q=noida&appid=066045fa933bb62fd0606a63212bce37')
        .on('data', (chunk) => {
            const objData = JSON.parse(chunk);
            const arrData = [objData];
            const realTimeData = arrData.map((val) => {
                return replaceval(homeFile, val);
            }).join("");

            res.send(realTimeData); // Send the HTML response with weather data
        })
        .on('end', (err) => {
            if (err) return console.log('connection closed due to errors', err);

            res.end();
        });
});

app.listen(port, "127.0.0.1", () => {
    console.log(`Server is running on http://127.0.0.1:${port}/`);
});
// const http = require("http");
// const fs = require("fs");
// var requests = require('requests');

// const homeFile = fs.readFileSync("index.html", "utf-8");

// const replaceval = (tempVal, orgVal) => {
//     let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
//     temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
//     temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
//     temperature = temperature.replace("{%location%}", orgVal.name);
//     temperature = temperature.replace("{%country%}", orgVal.sys.country);
//     return temperature;
// };

// const server = http.createServer((req, res) => {
//     if (req.url == "/") {
//         requests('https://api.openweathermap.org/data/2.5/weather?q=noida&appid=066045fa933bb62fd0606a63212bce37')
//             .on('data', (chunk) => {
//                 const objData = JSON.parse(chunk);
//                 const arrData = [objData]
//                //  console.log(arrData[0].main.temp_max)
//                  const realTimeData = arrData.map((val) => {
//                      replaceval(homeFile, val);
//                  }).join("");
//                 // // res.write(realTimeData);
//                 console.log(realTimeData);
//             })
//             .on('end', (err) => {
//                 if (err) return console.log('connection closed due to errors', err);

//                 res.end();
//             });
//     }
// })

// server.listen(8000, "127.0.0.1");


// const curDate = document.getElementById("date");
// let weathercon = document.getElementById("weathercon")
// const tempStatus = "Clouds";
// const getCurrentDay = () => {
//     const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


//     let currenttime = new Date();
//     let day = weekday[currenttime.getDay()];
//     return day

// }

// const getCurrentTime = () => {
//     var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//     var now = new Date();
//     var month = months[now.getMonth()];
//     var date = now.getDate();
//     let hours = now.getHours();
//     let mins = now.getMinutes();

//     return `${month} ${date} | ${hours}:${mins}`;

// }

// curDate.innerHTML = getCurrentDay() + " | " + getCurrentTime();
