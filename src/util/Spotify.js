import {credentials} from '../config/credentials';

const clientID = credentials.spotify.clientID;
const redirectURI = credentials.spotify.redirectURI;
const spotifyAccessUrl = 'https://accounts.spotify.com/'; 
const spotifyApiUrl = 'https://api.spotify.com/v1/'; 

let accessToken = localStorage.getItem("accessToken");
let expiresAt = localStorage.getItem("expiresAt");

function setExpirationTime(expiresIn) {
    let current = new Date();
    let expiration = new Date(current.setSeconds(current.getSeconds() + expiresIn));
    console.log('Expiration time ' + expiration);
    return expiration;
}

function expired() {
    if(expiresAt !== null && expiresAt !== 0) {
        console.log('expiresAt variable has a value');
        let current = new Date();
        let expirationTime = new Date(localStorage.getItem('expiresAt'));
        console.log(expirationTime);
        let expired = current >= expirationTime;
        console.log('Expired ' + expired);
        return expired;
    } 
    return true;
}

function clearStorage() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expiresAt');
    accessToken = '';
    expiresAt = 0;
}

function getHashParams() {
    let hashParams = {};
    let regex = /([^&;=]+)=?([^&;]*)/g;
    let urlHash = window.location.hash.substring(1);
    let exp = regex.exec(urlHash);
    while( exp ) {
        hashParams[exp[1]] = decodeURIComponent(exp[2]);
        exp = regex.exec(urlHash);
    }
    return hashParams;
}


export const Spotify = {

    getAccessToken() {
        let url = `${spotifyAccessUrl}authorize?client_id=${clientID}&response_type=token&redirect_uri=${redirectURI}&scope=playlist-modify-public`;
        // check if recently set (so the params are in the url)
        if(Object.keys(getHashParams()).length > 0) {
            let params = getHashParams();
            console.log('Params in URL hash');
            if(!params.hasOwnProperty("access_token")  || !params.hasOwnProperty("expires_in")) {
                console.log("Redirect didn't include the desired params");
                //redirect
                window.location = url;
                return;
            } else {
                localStorage.setItem("accessToken", params.access_token);
                let expiresIn = params.expires_in;
                console.log(Number(expiresIn));
                localStorage.setItem("expiresAt", setExpirationTime(Number(expiresIn)));
                console.log("Set tokens");

                accessToken = localStorage.getItem("accessToken");
                //clear URL
                /*let origUrl= window.location.href.substr(0, window.location.href.indexOf('#'));
                console.log(origUrl);
                window.location = origUrl;*/
                window.history.replaceState({}, document.title, ".");

                return accessToken;
            }
        } else if(accessToken === null || accessToken === '' || expired()) { // not previously set, so check if they are still valid
            console.log("invalid access token or token has expired");
            //clear storage
            clearStorage();
            //reauthenticate
            window.location = url;
            return;
        } else {
            console.log(typeof expiresAt);
            return accessToken;
        }
    },

    search(term) {
        //clearStorage();
        // get the updated token
        let accessTokenVal = this.getAccessToken();
        let url = `${spotifyApiUrl}search?q=${term}&type=track`
        return fetch(url, { headers: { 'Authorization': `Bearer ${accessTokenVal}` } }).then( response => {
            //console.log(response);
            if(response.ok) {
                return response.json();
            }
            throw new Error('Request failed!');
        }, networkError => console.log(networkError.message)
        ).then( jsonResponse => {
            if(jsonResponse.tracks) {
                let tracks = jsonResponse.tracks.items.map( track => ({
                    id : track.id,
                    name : track.name,
                    album : track.album.name,
                    artist : track.artists[0].name,
                    uri : track.uri
                }));
                console.log(tracks);
                return tracks;
            }
            return [];
        });
        
    },

    submitPlaylist(playlistTracks, playlistName) {
        let accessTokenVal = this.getAccessToken();
        //get userid
        return this.getUserId(accessTokenVal).then( userId => {
            // create playlist
            let url = `${spotifyApiUrl}users/${userId}/playlists`
            return fetch(url, { method: 'POST', 
                                headers: { 
                                            'Authorization': `Bearer ${accessTokenVal}`, 
                                            'Content-Type': 'application-json' 
                                }, 
                                body: JSON.stringify({name: playlistName}) 
                                })
                .then( response => {
                    //console.log(response);
                    if(response.ok) {
                        return response.json();
                    }
                    throw new Error('Request failed!');
                }, networkError => console.log(networkError.message)
            ).then( jsonResponse => {
                let playlistId = jsonResponse.id;
                return this.addTracksToPlaylist(accessTokenVal, userId, playlistId, playlistTracks);
            });
        });
    },

    getUserId(accessTokenVal) {
        let url = `${spotifyApiUrl}me`
        return fetch(url, { headers: { 'Authorization': `Bearer ${accessTokenVal}` } }).then( response => {
            //console.log(response);
            if(response.ok) {
                return response.json();
            }
            throw new Error('Request failed!');
        }, networkError => console.log(networkError.message)
        ).then( jsonResponse => {
            return jsonResponse.id;
        });
    },

    addTracksToPlaylist(accessTokenVal, userId, playlistId, playlistTracks) {
        //console.log(playlistTracks);
        let uris = playlistTracks.map(track => track.uri);
        console.log(uris);
        // map playlistTracks to a new array
        let url = `${spotifyApiUrl}users/${userId}/playlists/${playlistId}/tracks`
        return fetch(url, {
                            method: 'POST', 
                            headers: { 
                                        'Authorization': `Bearer ${accessTokenVal}`,
                                        'Content-Type': 'application-json' 
                                     },
                            body: JSON.stringify({uris: uris}) 
                         }
                    )
            .then( response => {
                //console.log(response);
                if(response.ok) {
                    return response.json();
                }
                throw new Error('Request failed!');
        }, networkError => console.log(networkError.message)
        ).then( jsonResponse => {
            console.log(jsonResponse);
            return jsonResponse;
        });

    }
};
