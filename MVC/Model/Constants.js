/* Constant values used for API*/

const privateKey = "change me";
const publicKey = "change me";

const baseURL = "gateway.marvel.com";
const characters = "/v1/public/characters";
const stories = "/v1/public/stories";

const urlOptions = {

    host: baseURL,
    port: 80,
    path: '',
    method: 'GET'

};

module.exports = {
    privateKey,
    publicKey,
    baseURL,
    characters,
    stories,
    urlOptions
};
