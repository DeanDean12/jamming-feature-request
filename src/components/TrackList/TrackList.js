import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';

class TrackList extends React.Component {
    //remove track
        // parent function

    //add track
        //parent function

    render() {
        return (
            <div className="TrackList">
                {   
                    this.props.trackList.map( track => {
                      return <Track track={track} key={track.id} actionSymbol={this.props.actionSymbol} trackAction={this.props.trackAction} />;
                    })
                }   
            </div>
        );
    }
}   

export default TrackList;
