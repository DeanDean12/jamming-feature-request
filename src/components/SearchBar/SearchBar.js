import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            term: ''
        }

        this.handleTermChange = this.handleTermChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch(event) {
        // if the term is not an empty string or whitespace, search
        if (/\S/.test(this.state.term)) {
            this.props.searchSpotify(this.state.term);
        }
        event.preventDefault();
    }

    handleTermChange(event) {
        this.setState({term: event.target.value});
    }

    render() {
        return(
            <div className="SearchBar">
              <input onChange={this.handleTermChange} placeholder="Enter A Song, Album, or Artist" />
              <a onClick={this.handleSearch}>SEARCH</a>
            </div>
        );
    }
}

export default SearchBar;
