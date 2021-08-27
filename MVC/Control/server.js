// Setup the working path for node to find all files to be served
const process = require("process");
var path = require("path").dirname(require.main.filename)
console.log("\n Current server path: " + path);
console.log(" Current working dir: " + process.cwd());
process.chdir(path);
console.log(" Changed working dir: " + process.cwd());
process.chdir("../");
console.log(" Changed working dir: " + process.cwd());


//Requires
const http = require("http");
const fs = require("fs");
const url = require("url");
const Characters = require("../Model/Characters.js");
const Stories = require("../Model/Stories.js");
const CharactersInStories = require("../Model/CharactersInStories.js");
const Hero = require("../Model/Hero.js");


//offset holder to increment displayed list
var newOffset = 0;

//data to be send to HTML
var response = "";

//Data from ajax request
var reqQuery = "";

//Path/rout from ajax request to be handled
var reqPathname = "";

console.log("Server started.");

//for demonstration purposes only, to avoid file server installation
http.createServer(function (req, res) {

  //Aquire route from the ajax
  reqPathname = url.parse(req.url, true).pathname;

  
  //switch (req.url) {
  switch (reqPathname) {

    //-------------------------------
    //Handle the file server, the files show the the view to be assembled
    case "/":
      fs.readFile("View/index.html", function (err, data) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        return res.end();
      });
      break;

    case "/script.js":
      fs.readFile("Control/script.js", function (err, data) {
        res.writeHead(200, { "Content-Type": "text/javascript" });
        res.write(data);
        return res.end();
      });
      break;

    case "/style.css":
      fs.readFile("View/style.css", function (err, data) {
        res.writeHead(200, { "Content-Type": "text/css" });
        res.write(data);
        return res.end();
      });
      break;
      //-------------------------------


      //Show ALL characters, using 20 number as offset
      case "/characters":

        //Aquire data from the ajax
        reqQuery = url.parse(req.url, true).query;

        Characters.getCharacters(reqQuery.offset, function (err, result) {

          //callback handler for errors
          if (err) {
            return console.log('Error while try to get Characters: ', err);
          } else {

            res.writeHead(200, { "Content-Type": "text/html" });

            response = "";

            //Header for navegability
            if (reqQuery.offset <= 0) {
              response = "<h1 class='title'>Choose your favorite SUPER HERO!!!</h1>";
              response += "<p class='marvelattr'>" + Characters.marvelAttributions[1] + "</p>";
            }

            //Display the list of characters
            for (var i = 0; i < Characters.controlCharacters.count; i++) {

              response += `<p> &bull; <a href="javascript:void(0);" onclick="ajaxRequest('stories?id=` + Characters.charactersIds[i] + `&offset=0&charIndex=` + i + `', 'result0');">` + Characters.charactersNames[i] + `</a></p>`;

            }

            //Display the button to Load more
            if ((Characters.controlCharacters.count + Characters.controlCharacters.offset) < Characters.controlCharacters.total) {

              newOffset = parseInt(reqQuery.offset) + 20;
              response += `<div id="result` + newOffset + `"><button type='button' onClick="ajaxRequest('characters?offset=` + newOffset + `', 'result` + newOffset + `');">Load more</button></div>`;

            }

            //send data structure to ajax to be displayed in the view
            res.end(response);
          }

        });

      break;

      //Route to ALL stories from a character
      case "/stories":

        //Aquire data from the ajax
        reqQuery = url.parse(req.url, true).query;

        //Get data from the selected charater for the header for navegability
        Hero.getHero(reqQuery.id, function (err, result) {

          //callback handler for errors
          if (err) {
            return console.log('Error while try to get Characters: ', err);
          }

          //Get the list of stories from a character, offset to 20 at a time 
          Stories.getStories(reqQuery.id, reqQuery.offset, function (err, result) {
            
            //callback handler for errors
            if (err) {
              return console.log('Error while try to get Characters: ', err);
            } else {
  
              res.writeHead(200, { "Content-Type": "text/html" });
  
              response = "";
              
              //Header for navegability
              if (reqQuery.offset <= 0) {
  
                response = "<h1 class='title'>And now choose a STORY!!!</h1>";
  
                response += `<p class="marvelattr">` + Hero.marvelAttributions[1] + `</p>`;
                response += `<p class="charactersThumbs"><img class="charactersThumbs" src="` + Hero.heroThumbunail[0] + `" /><br/><span>` + Hero.heroName[0] + `</span></p>`;
                response += `<p class="charactersDescription">` + Hero.heroDescription[0] + `</p>`;
    
              }
              
              //Display the list of stories from a character
              if (Stories.controlStories.count > 0) {
  
                for (var i = 0; i < Stories.controlStories.count; i++) {
  
                  response += `<p> &bull; <a href="javascript:void(0);" onclick="ajaxRequest('charactersInStories?id=` + Stories.storiesIds[i] + `&offset=0', 'result0');">` + Stories.storiesTitles[i] + `</a><br/>` + Stories.storiesDescription[i] + `</p>`;
  
                }
  
                //Display the button to Load more
                if ((Stories.controlStories.count + Stories.controlStories.offset) < Stories.controlStories.total) {
  
                  newOffset = parseInt(reqQuery.offset) + 20;
                  response += `<div id="result` + newOffset + `" ><p><button type="button" class="btn" onClick="ajaxRequest('stories?id=` + reqQuery.id + `&offset=` + newOffset + `', 'result` + newOffset + `');">Load more stories</button></p></div>`;
  
                }
  
              } else { //Display the button to beginning display

                response += "<p>Sorry, there are no more stories.</p>";
                response += `<button type='button' class="btn" onClick="ajaxRequest('', 'result0');">BACK to BEGINNING</button> <br/>`;

              }
  
              //send data structure to ajax to be displayed in the view
              res.end(response);
            }
  
          });

        });

      break;

      //Route to characters from a story
      case  "/charactersInStories":

        //Aquire data from the ajax
        reqQuery = url.parse(req.url, true).query;

        //Get the list of character, offset to 20 at a time 
        CharactersInStories.getCharactersInStories(reqQuery.id, reqQuery.offset, function (err, result) {

          //callback handler for errors
          if (err) {
            return console.log('Error while try to get Characters: ', err);
          } else {

            res.writeHead(200, { "Content-Type": "text/html" });

            response = "";

            //Header for navegability
            if (reqQuery.offset == 0) {

              response = "<h1 class='title'>... and here are the participants of the STORY!!!</h1>";
              response += `<p class="marvelattr">` + CharactersInStories.marvelAttributions[1] + `</p>`;

              response += `<button type='button' class="btn" onClick="ajaxRequest('', 'result0');">BACK to BEGINNING</button> <br/>`;
            }


            //Display the list of stories from a character, by clicking on a charater the xploration can be started, and not needing to back for the beginning
            for (var i = 0; i < CharactersInStories.controlCIStories.count; i++) {

              response += `<a href="javascript:void(0);" onclick="ajaxRequest('stories?id=` + CharactersInStories.storiesCharactersIds[i]  + `&offset=0&charIndex=` + i + `', 'result0');"> <p class='charactersThumbs'> <img class='charactersThumbs' src="` + CharactersInStories.storiesCharactersThumbunails[i] + `"/> <br/> <span>` + CharactersInStories.storiesCharactersNames[i] + `<span> </p> </a>`;

            }

            //Display the button to Load more
            if ((CharactersInStories.controlCIStories.count + CharactersInStories.controlCIStories.offset) < CharactersInStories.controlCIStories.total) {

              newOffset = parseInt(reqQuery.offset) + 20;
              response += `<div id="result` + newOffset + `"><button type='button' onClick="ajaxRequest('charactersInStories?offset=` + newOffset + `', 'result` + newOffset + `');">Load more Characters</button></div>`;

            }

            res.end(response);
          }

        });

    break;

      
    //Defaul route to all characters
    default :
     
    break;

  }
//sever listener port
}).listen(8080);
