import {credentials} from '../config/credentials';

const clientID = credentials.spotify.clientID;
const redirectURI = credentials.spotify.redirectURI;

let accessToken = localStorage.getItem("accessToken");
let expiresAt = localStorage.getItem("expiresAt");

const spotifyAccessUrl = 'https://accounts.spotify.com/'; 
const spotifyApiUrl = 'https://api.spotify.com/v1/'; 

function setExpirationTime(expiresIn) {
    let current = new Date();
    let expiration = current.setSeconds(current.getSeconds() + expiresIn);
    console.log(expiration);
    return expiration;
}

function expired() {
    if(expiresAt !== null && expiresAt !== 0) {
        console.log('expiresAt variable has a value');
        let checkExpiration = new Date().getSeconds - expiresAt >= 0;
        console.log(checkExpiration);
        return checkExpiration;
    } 
    return true;
}

function clearStorage() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expiresAt');
    accessToken = '';
    expiresAt = 0;
}

export const Spotify = {

    getAccessToken() {
        let url = `${spotifyAccessUrl}authorize?client_id=${clientID}&response_type=token&redirect_uri=${redirectURI}&scope=playlist-modify-public`;
        // check if recently set (so the params are in the url)
        if(Object.keys(this.getHashParams()).length > 0) {
            let params = this.getHashParams();
            console.log('Params in URL hash');
            if(!params.hasOwnProperty("access_token")  || !params.hasOwnProperty("expires_in")) {
                console.log("Redirect didn't include the desired params");
                //redirect
                window.location = url;
                return;
            } else {
                localStorage.setItem("accessToken", params.access_token);
                expiresAt = params.expires_in;

                console.log(params.expires_in);
                console.log(typeof params.expires_in);
                localStorage.setItem("expiresAt", setExpirationTime(params.expires_in));
                console.log("Set tokens");

                //clear URL
                let origUrl= window.location.href.substr(0, window.location.href.indexOf('#'));
                console.log(origUrl);
                window.location = origUrl;

                return;
            }
        } else if(accessToken === null || accessToken === '' || expired()) { // not previously set, so check if they are still valid
            console.log("invalid access token or token has expired");

            //clear storage
            clearStorage();

            //reauthenticate
            window.location = url;
            return;
        } else {
            console.log(expiresAt);
            let current = new Date();
            current = current.getTime() / 1000;
            console.log('now ' + current);
            console.log(accessToken);
            return accessToken;
        }
    },

    search(term) {
        //clearStorage();
        // get the updated token
        let accessTokenVal = this.getAccessToken();
        console.log(accessToken);
        console.log('reach');
        let url = `${spotifyApiUrl}search?q=${term}&type=track`
        fetch(url, { headers: { 'Authorization': `Bearer ${accessTokenVal}` } }).then( response => {
            console.log(response);
            if(response.ok) {
                return response.json();
            }
            throw new Error('Request failed!');
        }, networkError => console.log(networkError.message)
        ).then( jsonResponse => {
            console.log(jsonResponse);
        });
        
    },

    getHashParams() {
        let hashParams = {};
        let regex = /([^&;=]+)=?([^&;]*)/g;
        let urlHash = window.location.hash.substring(1);
        let exp = regex.exec(urlHash);
        while( exp ) {
            hashParams[exp[1]] = decodeURIComponent(exp[2]);
            exp = regex.exec(urlHash);
        }
        //console.log(hashParams);
        return hashParams;
        //token_type
        //expires_in
        //access_token
    },

    submit(playlist) {

    }
};
