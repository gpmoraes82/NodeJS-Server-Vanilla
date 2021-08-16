//Requires
const http = require('http');
const crypto = require("crypto");
const Constants = require("./Constants");

//Data to be acquired
var storiesIds = [];
var storiesTitles = [];
var storiesDescription = [];


//---- Get timestamp for Url construction ----
var currentDate = new Date();
var timestamp = currentDate.getTime();
var data = timestamp + Constants.privateKey + Constants.publicKey;

//---- Set md5 for timestamp and add the keys, private and public
var hash = crypto.createHash('md5').update(data).digest('hex');


//json result for parse
var result;


//Data from API to control the request, most part for the load more requests
var controlStories = {

    offset: 0,
    limit: 0,
    total: 0,
    count: 0

};


//Get the json obj from the API to be parsed
function getStories(id, offset, cb) {

    //Reset the path
    Constants.urlOptions["path"] = "";
    //Set the new path to request
    Constants.urlOptions["path"] = Constants.characters + '/' + id + '/stories?ts=' + timestamp + '&apikey=' + Constants.publicKey + '&hash=' + hash + '&orderBy=id&limit=20&offset=' + offset;

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

                //Get the data controlers, most for offset               
                controlStories ["offset"] = result.data.offset;
                controlStories ["limit"] = result.data.limit;
                controlStories ["total"] = result.data.total;
                controlStories ["count"] = result.data.count;

                //Setting up arrys to display
                for (var i = 0; i < result.data.results.length; i++) {

                    storiesIds[i] = result.data.results[i].id;
                    storiesTitles[i] = result.data.results[i].title;

                    if(result.data.results[i].description != ""){
                        storiesDescription[i] = result.data.results[i].description;
                    } else {
                        storiesDescription[i] = "N/A";
                    }

                    /* Uncomment to see the date requested in the server terminal
                    console.dir(
                        " Titles: " + storiesTitles[i] +
                        " Description: " + storiesDescription[i] +
                        " id: " + storiesIds[i]
                    ); */

                }

            } else {
                //Error handler
                console.log(new Date() + ' Error: ' + JSON.stringify(result));
                cb({ error: result.code });
            }

            //callback to aquire data and send it to the server
            cb(null, result);
            
        });

        //Error handler to show on server terminal
        res.on('error', cb);

    //Error handler to show on server terminal
    }).on('error', cb).end();

}


module.exports = {
    storiesIds,
    storiesTitles,
    storiesDescription,
    controlStories,
    getStories
};

