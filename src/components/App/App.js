import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import {Spotify} from '../../util/Spotify';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults: []
        };
        this.searchSpotify = this.searchSpotify.bind(this);
    }

    searchSpotify(term) {
        Spotify.search(term);
        //.then(searchResults => this.setState({searchResults: searchResults}));
    }

    addTrackToPlaylist() {
        console.log("add");
    }
    
    render() {
    return (
        <div className="App">
            <h1>Ja<span className="highlight">mmm</span>ing</h1>
            <SearchBar searchSpotify={this.searchSpotify} />
            <div className="App-playlist">
                <SearchResults searchResults={this.state.searchResults} />
                <Playlist />
            </div>
        </div>
    );
    }
}

export default App;
