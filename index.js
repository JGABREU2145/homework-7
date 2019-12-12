const fs = require("fs");
const inquirer = require("inquirer");
const util = require("util");
const axios = require("axios");
const convertHTMLToPDF = require("pdf-puppeteer");

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
    return inquirer.prompt([
    {
      type: "input",
      message: "What is your name?",
      name: "name",
      default: "Justin"
    },
    {
        type: "input",
        message: "What is your favorite color?",
        name: "color",
        default: "orange"
      },
    {
      type: "input",
      message: "Where are you from? (city space state, no commas)",
      name: "location",
      default: "Austin TX"
    },
    {
      type: "input",
      message: "Write a snippet about yourself",
      name: "bio",
      default: "I like to code"
    },
    {
      type: "input",
      message: "Enter your linkedIn URL",
      name: "linkedin",
      default: "https://www.linkedin.com/in/justin-abreu-b4a081129/"
    },
    {
      type: "input",
      message: "Enter your GitHub URL",
      name: "github",
      default: "https://github.com/JGABREU2145"
    }
    ])
};


function generateHTML(answers) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
      <title>${answers.name}'s Profile</title>
      <style>
      .jumbotron-fluid {
        padding-right: 0;
        padding-left: 0;
        border-radius: 0;
        margin: auto;
        width: 80%;
      }
      .container {
        width: 80%;
        padding-right: 15px;
        padding-left: 15px;
        margin-right: auto;
        margin-left: auto;
        text-align: center;

      }
      .infoBox {
        background: orange;
        border-radius: 5px;
        height: 50px;
        width: 80px;
        margin: 0 auto;
        margin-bottom: 20px;
        padding: 15px;
        
      }
      a {
        color: black;
      }

      .bio {
        text-align: center;
        color: papayawhip;
      }
      
      </style>
    </head>
    <body style = "background:${answers.color}">
      <div class="jumbotron jumbotron-fluid">
      <div class="container">
      <div><img src="${githubData.profilePicture}" ></div>
        <h1 class="display-4">Hi! My name is ${answers.name}</h1>
        <p class="lead">I am from ${answers.location}.</p> 
        <div class="row">
          <div class="col-sm">
          <a href = "https://google.com/maps/${cityData}+${stateData}">${cityData},${stateData}</a>
          </div>
          <div class="col-sm">
           <a href = "${answers.github}">My GitHub</a>
          </div>
          <div class="col-sm">
          <a href = "${answers.linkedin}">My LinkedIn</a>
          </div>          
        </div>       
      </div>
    </div>
    <br>
    <div>
      <h3>${answers.bio}</h3>
    </div>
    <br>
    <div class="container">
        <div class="row">
            <div class="col-3 infoBox">Number of Repsitories
              <div>${githubData.repositoriesCount}</div>
            </div>
            <div class="col-3 infoBox">Stars
                <div>${githubData.starsCount}</div>
            </div>
            <div class="w-100"></div>
            <div class="col-3 infoBox">Followers
                <div>${githubData.followersCount}</div>
            </div>
            <div class="col-3 infoBox">Following
                <div>${githubData.followingCount}</div>
            </div>
          </div>
    </div>
    </body>
    </html>`
};

promptUser()
.then(function(answers) {
    // first, get the userid for github
    var urlParts = answers.github.split("/");
    var githubUsername = urlParts[urlParts.length - 1];
    var githubData = {};     
    
    var profileUrl = `https://api.github.com/users/${githubUsername}`;
    var starsUrl = `https://api.github.com/users/${githubUsername}/starred`;
    
    axios.all([
      axios.get(profileUrl),
      axios.get(starsUrl),
        
    ])
    .then(axios.spread(function(profileUrl, starsUrl) {  
        githubData.repositoriesCount = profileUrl.public_repos;
        githubData.followersCount = profileUrl.followers;
        githubData.followingCount = profileUrl.following;
        githubData.profilePicture = profileUrl.avatar_url;
        githubData.starsCount = starsUrl.length;        
       
        var cityData = answers.location.slice(' ')[0];
        var stateData = answers.location.slice(-2);
       
        
        // Then, generate HTML and then pass to PDF to save
        const html = generateHTML(answers, githubData, cityData, stateData);
        generateHTML(html, onPDFComplete, pdfOptions);
        writeFileAsync("index.html", html);        
        
        var pdfOptions = {
            path: 'index.html',
            printBackground: true
        };
        
        convertHTMLToPDF(html, onPDFComplete, pdfOptions);
        var onPDFComplete = function (pdfOptions) {
          console.log("Successfully wrote to profile.pdf");
        };
      })
    .then(function() {
      console.log("Successfully wrote to index.html")
        
    }))
    .catch(function(error) {
         console.log(error)
    });
    
})
.catch(function(error) {
  console.log(error)
});


/*promptUser()
.then(function(answers){
    const html = generateHTML(answers, githubData, googleMapsData);
    const options = {
        path: "profile.pdf",
        printBackground: true
    };
    //convertHTMLToPDF(html, onPDFComplete, options);
    return writeFileAsync("index.html", html);
})
.then(function() {
    console.log("Successfully wrote to index.html");
})
.catch(function(err) {
    console.log(err);
});

/*promptUser()
.then(function(answers) {
    // first, get the userid for github
    var urlParts = answers.github.split("/");
    var githubUsername = urlParts[urlParts.length - 1];
    var githubData = {};
    var googleMapsData = {};
    
    var profileUrl = `https://api.github.com/users/${githubUsername}`;
    // then, call github and google maps APIs
    var starsUrl = `https://api.github.com/users/${githubUsername}/starred`;
    var googleMapsUrl = ""; // TODO: figure out google maps
    
    axios.all([
        axios.get(profileUrl),
        axios.get(starsUrl),
        axios.get(googleMapsUrl)
    ])
    .then(axios.spread(function(profile, stars, googleMapsResponse) {  
        githubData.repositoriesCount = profile.public_repos;
        githubData.followersCount = profile.followers;
        githubData.followingCount = profile.following;
        githubData.profilePicture = profile.avatar_url;
        githubData.starsCount = stars.length;
        
        // TODO: figure out google maps data response
        //googleMapsData.whatever = googleMapsResponse.whatever;
        
        // Then, generate HTML and then pass to PDF to save
        const html = generateHTML(answers, githubData, googleMapsData);
        
        var pdfOptions = {
            path: 'your_path.pdf',
            printBackground: true
        };
        convertHTMLToPDF(html, onPDFComplete, pdfOptions);
        
    }))
    .catch(function(error) {
         console.log(error)
    });
})
.catch(function(err) {
});*/