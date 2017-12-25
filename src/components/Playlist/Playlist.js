import React from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList';

class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playlistName: 'New Playlist',
            playlist: props.playlist
        };
        this.handlePlaylistNameChange = this.handlePlaylistNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }
   
    componentWillReceiveProps(props) {
      this.setState( {playlist: props.playlist} );
    }
 
    handlePlaylistNameChange(event) {
        this.setState({ playlistName: event.target.value });
    }

    handleSubmit(event) {
        this.props.submitPlaylist(this.state.playlist, this.state.playlistName);
        this.setState({ playlistName: 'New Playlist' });
        event.preventDefault();
    }
    
    removeTrack(track) {
        let playlist = this.state.playlist;
       for(let i = 0; i < playlist.length; i++) {
            if(playlist[i].id === track.id) {
                playlist.splice(i, 1); 
                this.setState({ playlist: playlist});
                return;
            }   
        }   
    }

    render () {
        return (
          <div className="Playlist">
            <input onChange={this.handlePlaylistNameChange} value={this.state.playlistName} />
            <TrackList trackList={this.state.playlist} actionSymbol='-' trackAction={this.removeTrack} />
            <a className="Playlist-save" onClick={this.handleSubmit}>SAVE TO SPOTIFY</a>
          </div>
        );
    }
}

export default Playlist;
