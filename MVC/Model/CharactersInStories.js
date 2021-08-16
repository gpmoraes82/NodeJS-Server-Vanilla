//Requires
const http = require('http');
const crypto = require("crypto");
const Constants = require("./Constants");

//Data to be acquired
var marvelAttributions = [];
var storiesCharactersIds = [];
var storiesCharactersNames = [];
var storiesCharactersThumbunails = [];


//---- Get timestamp for Url construction ----
var currentDate = new Date();
var timestamp = currentDate.getTime();
var data = timestamp + Constants.privateKey + Constants.publicKey;

//---- Set md5 for timestamp and add the keys, private and public
var hash = crypto.createHash('md5').update(data).digest('hex');


//json result for parse
var result;


//Data from API to control the request, most part for the load more requests
var controlCIStories = {

    offset: 0,
    limit: 0,
    total: 0,
    count: 0

};

//Get the JOSN obj from the API to be parsed
function getCharactersInStories(id, offset, cb){ ///REVISAR OFFSET

    //Reset the path
    Constants.urlOptions["path"] = "";
    
    //Set the new path to request
    Constants.urlOptions["path"] = Constants.stories + '/' + id + '/characters?ts=' + timestamp + '&apikey=' + Constants.publicKey + '&hash=' + hash + '&orderBy=name&offset=' + offset;

    //API Request handler
    http.request(Constants.urlOptions, function (res){

        //Var to receive the json obj
        var body = '';

        //Build the json obj
        res.on('data', function (chunk) {
            body += chunk;
        });

        //json obj handler parser
        res.on('end', function(){

            var result = JSON.parse(body);

            if(result.code === 200) {

                //Get the Marvel attribution Text and Link
                marvelAttributions[0] = result.attributionText;
                marvelAttributions[1] = result.attributionHTML;

                //Get the data controllers, most for offset
                controlCIStories ["offset"] = result.data.offset;
                controlCIStories ["limit"] = result.data.limit;
                controlCIStories ["total"] = result.data.total;
                controlCIStories ["count"] = result.data.count;

                //Setting up arrys to display
                for(var i=0;i<result.data.results.length;i++) {

                    storiesCharactersIds[i] = result.data.results[i].id;
                    storiesCharactersNames[i] = result.data.results[i].name;
                    storiesCharactersThumbunails[i] = result.data.results[i].thumbnail.path + "." + result.data.results[i].thumbnail.extension;

                    /* Uncomment to see the date requested in the server terminal
                    console.dir( " Id: " + storiesCharactersIds[i] +
                                 " Name: " + storiesCharactersNames[i] +
                                 " Thumbnail: " + storiesCharactersThumbunails[i]
                    );
                    */

                }

            } else {
                //Error handler
                console.log(new Date() + ' Error: '+JSON.stringify(result));
                cb({error:result.code});
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
    marvelAttributions,
    storiesCharactersIds,
    storiesCharactersNames,
    storiesCharactersThumbunails,
    controlCIStories,
    getCharactersInStories
};
