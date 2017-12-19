import React from 'react';
import './SearchResults.css';
import TrackList from '../TrackList/TrackList';

class SearchResults extends React.Component {
    //add to playlist
        // parent function

    render() {
        return (
            <div className="SearchResults">
                <h2>Results</h2>
                <TrackList trackList={this.props.searchResults} actionSymbol='+' trackAction={this.props.addTrackToPlaylist} />
            </div>
        );
    }
}

export default SearchResults;
