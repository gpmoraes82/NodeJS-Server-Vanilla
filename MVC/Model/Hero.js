//Requires
const http = require('http');
const crypto = require("crypto");
const Constants = require("./Constants.js");

//Data to be acquired
var marvelAttributions = [];
var heroId = [];
var heroName = [];
var heroThumbunail = [];
var heroDescription = [];


//---- Get timestamp for Url construction ----
var currentDate = new Date();
var timestamp = currentDate.getTime();
var data = timestamp + Constants.privateKey + Constants.publicKey;

//---- Set md5 for timestamp and add the keys, private and public
var hash = crypto.createHash('md5').update(data).digest('hex');


//json result for parse
var result;


//Get the JOSN obj from the API to be parsed
function getHero(id,  cb) {

    //Reset the path
    Constants.urlOptions["path"] = "";
    
    //Set the new path to request
    Constants.urlOptions["path"] = Constants.characters + '/' + id +'?ts=' + timestamp + '&apikey=' + Constants.publicKey + '&hash=' + hash;

    //API Request handler
    http.request(Constants.urlOptions, function (res) {

        //Var to recieve the json obj
        var body = '';

        //Build the json obj
        res.on('data', function (chunk) {
            body += chunk;
        });

        //json obj handler parser
        res.on('end', function () {

            result = JSON.parse(body);

            if (result.code === 200) {

                //Get the Marvel attribution Text and Link
                marvelAttributions[0] = result.attributionText;
                marvelAttributions[1] = result.attributionHTML;

                //Setting up arries to display
                for (var i = 0; i < result.data.results.length; i++) {
                    heroId[i] = result.data.results[i].id;
                    heroName[i] = result.data.results[i].name;
                    heroThumbunail[i] = result.data.results[i].thumbnail.path + "." + result.data.results[i].thumbnail.extension;
                    heroDescription[i] = result.data.results[i].description;


                    /* Uncomment to see the date requested in the server terminal
                    console.dir(
                        "AttributionText: " + marvelAttributions[0] +
                        " AttributionHtml: " + marvelAttributions[1] +
                        " Name: " + heroName[i] +
                        " id: " + heroId[i] +
                        " thumb: " + heroThumbunail[i] +
                        " description: " + heroDescription[i] + 
                        " IIIIIII= "+ i
                    );*/

                }


            } else {
                //Error handler
                console.log(new Date() + ' Error: ' + JSON.stringify(result));
                cb({ error: result.code });
            }

            //callback to aquire data and send it to server
            cb(null, result);

        });

        //Error handler to show on server terminal
        res.on('error', cb);

    //Error handler to show on server terminal
    }).on('error', cb).end();

}


module.exports = {
    marvelAttributions,
    heroId,
    heroName,
    heroThumbunail,
    heroDescription,
    getHero
};
