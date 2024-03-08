const http = require("http");
const fs = require("fs");
const request = require("request");


const homeFile = fs.readFileSync("Home.html", 'utf-8');

const replaceValue=(tempVal, orgVal)=>{
    let tempInCel= Math.floor((orgVal.main.temp-32)*5/9);
    let minTempInCel= Math.floor((orgVal.main.temp-32)*5/9);
    let maxtempCel= Math.floor((orgVal.main.temp-32)*5/9);
    let temperature = tempVal.replace("{%tempval%}", tempInCel);
    temperature = temperature.replace("{%tempmin%}", minTempInCel);
    temperature = temperature.replace("{%tempmax%}", maxtempCel);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempStatus%}", orgVal.weather.main);


    return temperature;
}

const server = http.createServer((req, res) => {
    // console.log(req.url);
    if (res.url + "/") {
        request(
        "https://api.openweathermap.org/data/2.5/weather?q=ashoknagar&appid=bd349882e3bb8939eae25e7a9a242873")
        .on("data",(chunk)=>{
            const txtData= chunk.toString('utf-8')
            const objData= JSON.parse(txtData);
            const arrData= [objData]
            const realTimeData = arrData
            .map((val) => replaceValue(homeFile,val))
            .join("");
            res.write(realTimeData);
            // console.log(realTimeData);
        }) 
        .on("end",(err)=>{
            if(err) return console.log("Eror occured",err);
            res.end();
        });
    }
});

server.listen(8000, "127.0.0.1",(e)=>{
    console.log("Hosting on local host/8000")
});