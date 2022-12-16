<p align = "center">МИНИСТЕРСТВО НАУКИ И ВЫСШЕГО ОБРАЗОВАНИЯ<br>
РОССИЙСКОЙ ФЕДЕРАЦИИ<br>
ФЕДЕРАЛЬНОЕ ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ<br>
ОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ ВЫСШЕГО ОБРАЗОВАНИЯ<br>
«САХАЛИНСКИЙ ГОСУДАРСТВЕННЫЙ УНИВЕРСИТЕТ»</p>
<br><br><br><br><br><br>
<p align = "center">Институт естественных наук и техносферной безопасности<br>Кафедра информатики<br>Коньков Никита Алексеевич</p>
<br><br><br>
<p align = "center">Лабораторная работа №12<br><b>«Node JS»</b><br>01.03.02 Прикладная математика и информатика</p>
<br><br><br><br><br><br><br><br><br><br><br><br>
<p align = "right">Научный руководитель<br>
Соболев Евгений Игоревич</p>
<br><br><br>
<p align = "center">г. Южно-Сахалинск<br>2022 г.</p>
<br><br><br><br><br><br><br><br><br><br><br><br>

<h1 align = "center">Введение</h1>

<p> <b>Javascript</b> - язык программирования, который позволяет вам создать динамически обновляемый контент, управляет мультимедиа, анимирует изображения, впрочем, делает всё, что угодно. Окей, не все, что угодно, но всё равно, это удивительно, что можно достичь с помощью нескольких строк JavaScript-кода. </p>

<p><b>Node</b> или <b>Node.js</b> — программная платформа, основанная на движке V8 (компилирующем JavaScript в машинный код), превращающая JavaScript из узкоспециализированного языка в язык общего назначения. Node.js добавляет возможность JavaScript взаимодействовать с устройствами ввода-вывода через свой API, написанный на C++, подключать другие внешние библиотеки, написанные на разных языках, обеспечивая вызовы к ним из JavaScript-кода.</p>

<h1 align = "center">Цели и задачи</h1>

<p>Реализовать галерею на Node JS. Ваше приложение должно делать: </p>

<ul>
    <li>запрос к серверу, получать данные в формате json;</li>
    <li>обработка json и вывод пользователю информацию в виде веб-страницы;</li>
    <li>выводить список альбомов;</li>
    <li>выводить список фотографий;</li>
    <li>переход между альбомом и списком фотографий.</li>
</ul>

<h1 align = "center">Решение</h1>

<h2 align = "center">pics.json</h2>

```json
[
    {
        "id":0,
        "albumName":"Environment",
        "urls":[
            "Imgs/environment_1.jpg",
            "Imgs/environment_2.jpg",
            "Imgs/environment_3.jpg",
            "Imgs/environment_4.jpg"
        ]
    },
    {
        "id":1,
        "albumName":"Monkes",
        "urls":[
            "Imgs/monke_1.jpg",
            "Imgs/monke_2.png",
            "Imgs/monke_3.png"
        ]
    },
    {
        "id":2,
        "albumName":"Ryans",
        "urls":[
            "Imgs/ryan_1.jpg",
            "Imgs/ryan_2.png",
            "Imgs/ryan_3.jpg"
        ]
    }
]
```

<h2 align = "center">app.js</h2>

```js
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
```

<h2 align = "center">index.html</h2>

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="css/styles.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="css/lightbox.css" type="text/css" media="screen" />
    <script type="text/javascript" src="js/prototype.js"></script>
    <script type="text/javascript" src="js/scriptaculous.js?load=effects,builder"></script>
    <script type="text/javascript" src="js/lightbox.js"></script>
</head>
<body>
    <h1>Gallery</h1>
    <div class="bttns" id="forBt">
        <button class="bttn" onclick="GetWholePics()">Все</button>
    </div>

    <br>
    
    <div class="parent" id="pics">
        <div id="pics">

        </div>
    </div>

    <script>
        async function GetAlbums(){
            const response = await fetch("/api/pics", {
                method: "GET",
                headers: { "Accept": "application/json" }
            });

            if (response.ok === true) {
                const content = await response.json();
                let res = document.getElementById("forBt");

                content.forEach(album => {
                    res.innerHTML += "<button onclick=GetPics(\'" + album.id + "\') class=\"bttn\">" + album.albumName + "</button>";
                });
            }
        }
        GetAlbums();

        async function GetWholePics(){

            const response = await fetch("/api/pics", {
                method: "GET",
                headers: { "Accept": "application/json" }
            });

            if (response.ok === true){

                const content = await response.json();
                let res = document.getElementById("pics");
                res.innerHTML ="";

                content.forEach(album => {
                    for(let i = 0; i < album.urls.length; i++){
                        res.innerHTML += "<img class='pic' src=\"" + album.urls[i] + "\" width=\"200\" height=\"140\">";
                    }
                });
                
            }
        }
        GetWholePics();

        async function GetPics(id){

            const response = await fetch("/api/pics/" + id, {
                method: "GET",
                headers: { "Accept": "application/json" }
            });

            if (response.ok === true){

                const content = await response.json();
                let res = document.getElementById("pics");
                res.innerHTML ="";

                content.forEach(pics => {
                    res.innerHTML += "<img class='pic' src=\"" + pics + "\" width=\"200\" height=\"140\">";
                });
            }
        }
    </script>
</body>
</html>
```

<h2 align = "center">styles.css</h2>

```css
body {
    background-image: url('grnd.jpg');
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    color: #615285;
    position: relative;
}

.parent {
    margin-left: auto;
    margin-right: auto;
    width: 80vw;
    background-color: white;
    border: 5px solid #615285;
    border-radius: 10px;
    align-items: center;
}

.bttns {
    margin-left: auto;
    margin-right: auto;
    width: 40vw;
    text-align: center;
}
.bttn {
    width: 10vw;
    color: #615285;
    background-color: white;
    border: 0.25vw solid #615285;
    font-size: 1.5vw;
    height: 3vw;
    margin-left: 1vw;
    margin-right: 1vw;
    margin-bottom: 1vw;
}

h1{
    color: #615285;
    border: 0.25vw solid #615285;
    margin-left: auto;
    margin-right: auto;
    background-color: white;
}

h1, button {
    font-size:2vw;
    width: 15vw;
    text-align: center;
    border-radius:2vw;
}

button {
    border: solid #615285;
    background-color: #615285;
    color: white;
}

#pics{
    width: 80vw;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.pic {
    margin: 2vw 2vw 2vw 2vw;
    border-radius: 1vw;
}
```


<h1 align = "center">Вывод</h1>
<p>Опираясь на материал, пройденный на лекции, помощь различных руководств, Я создал галерею изображений на JS</p>