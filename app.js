const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.static(__dirname + "/public"));

const filePath = "pics.json";

app.get("/api/pics", function(req, res){
       
    const content = fs.readFileSync(filePath,"utf8");
    const listOfAlbms = JSON.parse(content);
    res.send(listOfAlbms);
    
});

app.get("/api/pics/:id", function(req, res){

    const id = req.params.id;
    const content = fs.readFileSync(filePath, "utf8");
    const listOfAlbms = JSON.parse(content);
    let albmName = "";
    let albmPics = [];

    for(var i = 0; i < listOfAlbms.length; i++){
        if(listOfAlbms[i].id == id){
            albmName = listOfAlbms[i].albmName;
            for(var j = 0; j < listOfAlbms[i].urls.length; j++){
                albmPics.push(listOfAlbms[i].urls[j]);
            }
            break;
        }
    }

    if(albmName = ""){
        res.status(404).send();
    } else {
        let data = JSON.stringify(albmPics);
        res.send(data);
    }
});

app.listen(3000);