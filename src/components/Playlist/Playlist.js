import React from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList';

class Playlist extends React.Component {
    render () {
        return (
          <div className="Playlist">
            <input value='New Playlist' />
            <TrackList trackList={this.props.playlist} actionSymbol='-' trackAction={this.props.removeTrackFromPlaylist} />
            <a className="Playlist-save">SAVE TO SPOTIFY</a>
          </div>
        );
    }
}

export default Playlist;
