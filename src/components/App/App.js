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
            searchResults: [],
            playlist: []
        };
        this.searchSpotify = this.searchSpotify.bind(this);
        this.addTrackToPlaylist = this.addTrackToPlaylist.bind(this);
        this.submitPlaylist = this.submitPlaylist.bind(this);
    }

    searchSpotify(term) {
        Spotify.search(term)
        .then(searchResults => this.setState({searchResults: searchResults}));
    }

    addTrackToPlaylist(track) {
        this.setState({ playlist: this.state.playlist.concat(track) });
    }

    submitPlaylist(playlist, playlistName) {
        Spotify.submitPlaylist(playlist, playlistName).then(
            this.setState({ playlist: [] })
        );
    }
 
    render() {
    return (
        <div>
            <h1>Ja<span className="highlight">mmm</span>ing</h1>
            <div className="App">
                <SearchBar searchSpotify={this.searchSpotify} />
                <div className="App-playlist">
                    <SearchResults searchResults={this.state.searchResults} addTrackToPlaylist={this.addTrackToPlaylist} />
                    <Playlist playlist={this.state.playlist} submitPlaylist={this.submitPlaylist} />
                </div>
            </div>
        </div>
    );
    }
}

export default App;
