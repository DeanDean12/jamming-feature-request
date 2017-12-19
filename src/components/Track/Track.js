import React from 'react';
import './Track.css';

class Track extends React.Component {
    constructor(props) {
        super(props);
        this.handleTrackAction = this.handleTrackAction.bind(this);
    }

    handleTrackAction(event) {
        this.props.trackAction(this.props.track);
        event.preventDefault();
    }

    render() {
        return (
          <div className="Track">
            <div className="Track-information">
              <h3>{this.props.track.name}</h3>
              <p>{this.props.track.artist} | {this.props.track.album}</p>
            </div>
            <a className="Track-action" onClick={this.handleTrackAction}>{this.props.actionSymbol}</a>
          </div>
        );
    }
}

export default Track;
