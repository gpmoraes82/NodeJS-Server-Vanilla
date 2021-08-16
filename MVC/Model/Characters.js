//Requires
const http = require('http');
const crypto = require("crypto");
const Constants = require("./Constants.js");

//Data to be acquired
var marvelAttributions = [];
var charactersIds = [];
var charactersNames = [];
var charactersThumbunails = [];
var charactersDescriptions = [];


//---- Get timestamp for Url construction ----
var currentDate = new Date();
var timestamp = currentDate.getTime();
var data = timestamp + Constants.privateKey + Constants.publicKey;

//---- Set md5 for timestamp and add the keys, private and public
var hash = crypto.createHash('md5').update(data).digest('hex');


//json result for parse
var result;


//Data from API to control the request, most part for the lode more requests
var controlCharacters = {

    offset: 0,
    limit: 0,
    total: 0,
    count: 0

};

//Get the JOSN obj from the API to be parsed
function getCharacters(offset, cb) {

    //Reset the path
    Constants.urlOptions["path"] = "";

    //Set the new path to request
    Constants.urlOptions["path"] = Constants.characters + '?ts=' + timestamp + '&apikey=' + Constants.publicKey + '&hash=' + hash + '&orderBy=name&limit=20&offset=' + offset;

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

                //Get the data controlers, most for offset
                controlCharacters ["offset"] = result.data.offset;
                controlCharacters ["limit"] = result.data.limit;
                controlCharacters ["total"] = result.data.total;
                controlCharacters ["count"] = result.data.count;

                //Setting up arries to display
                for (var i = 0; i < result.data.results.length; i++) {
                    charactersIds[i] = result.data.results[i].id;
                    charactersNames[i] = result.data.results[i].name;
                    charactersThumbunails[i] = result.data.results[i].thumbnail.path + "." + result.data.results[i].thumbnail.extension;
                    charactersDescriptions[i] = result.data.results[i].description;


                    /* Uncomment to see the date requested in the server terminal
                    console.dir(
                        "AttributionText: " + marvelAttributions[0] +
                        " AttributionHtml: " + marvelAttributions[1] +
                        " Name: " + charactersNames[i] +
                        " id: " + charactersIds[i]
                    );
                    */

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
    controlCharacters,
    charactersIds,
    charactersNames,
    charactersThumbunails,
    charactersDescriptions,
    getCharacters
};
