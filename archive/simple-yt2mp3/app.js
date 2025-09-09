//required packages
const express = require('express'); 
const fetch = require('node-fetch'); 
require("dotenv").config();

//create express server
const app = express();

//server port number
const PORT = process.env.PORT || 3000; 

//set template engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

//parse html data before post request
app.use(express.urlencoded({
     extended: true 
}));
app.use(express.json());

//home route
app.get('/', (req, res) => {
    res.render("index");
})

app.post('/convert-mp3', async (req, res) => {
    const youtubeUrl  = req.body.youtubeUrl;
    if(
        youtubeUrl === undefined ||
        youtubeUrl === null ||
        youtubeUrl === ""
    ){
        return res.render("index", { success: false, message: "Please provide a valid Youtube URL."});
    } else {
        // Extract everything after 'v=' up to '&' or end of string
        let videoId = "";
        const vMatch = youtubeUrl.match(/v=([^&]+)/);
        if (vMatch && vMatch[1]) {
            videoId = vMatch[1];
        } else {
            return res.render("index", { success: false, message: "Could not extract video ID from URL." });
        }
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
            method: "GET",
            headers: {
                "x-rapidapi-host": process.env.API_HOST,
                "x-rapidapi-key": process.env.API_KEY
            }
        });

        const fetchResponse = await fetchAPI.json();
        if (fetchResponse.status === "ok") {
            return res.render("index", { success: true, song_link: fetchResponse.link, song_title: fetchResponse.title }, ); 
        } else {
            return res.render("index", { success: false, message: fetchResponse.msg });
        }
    }
})
//start the server 
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})