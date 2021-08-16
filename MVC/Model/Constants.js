/* Constant values used for API*/

const privateKey = "bcbb0f6a64d55948cc81d41b9124f2592f32de1f";
const publicKey = "3043d757764057aee3fd1a7b23153899";

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
