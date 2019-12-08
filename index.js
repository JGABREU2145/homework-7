const fs = require("fs");
const inquirer = require("inquirer");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
    return inquirer.prompt([
    {
      type: "input",
      message: "What is your name?",
      name: "name"
    },
    {
        type: "input",
        message: "What is your favorite color??",
        name: "color"
      },
    {
      type: "input",
      message: "Where are you from?",
      name: "location"
    },
    {
      type: "input",
      message: "Write a snippet about yourself",
      name: "bio"
    },
    {
      type: "input",
      message: "Enter your linkedIn URL",
      name: "linkedIn"
    },
    {
      type: "input",
      message: "Enter your GitHub URL",
      name: "GitHub"
    }
    ])
}

function generateHTML(answers) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
      <title>Document</title>
    </head>
    <body style = "background:${answers.color}">
      <div class="jumbotron jumbotron-fluid">
      <div class="container">
        <h1 class="display-4">Hi! My name is ${answers.name}</h1>
        <p class="lead">I am from ${answers.location}.</p>
        <h3>Example heading <span class="badge badge-secondary">Contact Me</span></h3>
        <ul class="list-group">
          <li class="list-group-item">My GitHub username is ${answers.github}</li>
          <li class="list-group-item">LinkedIn: ${answers.linkedin}</li>
        </ul>
      </div>
    </div>
    </body>
    </html>`
};

promptUser()
.then(function(answers){
    const html = generateHTML(answers);

    return writeFileAsync("index.html", html);
})
.then(function() {
    console.log("Successfully wrote to index.html")
})
.catch(function(err) {
    console.log(err);
});