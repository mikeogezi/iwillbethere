import React from 'react';

import { Link } from 'react-router-dom';

export default class Index extends React.Component {
    render () {
        return (
            <div>
                <h2>IWBT App</h2>
                <div className="col s12">
                    <div className="row">
                        <div className="card grey lighten-3">
                            <div className="card-content">
                                <span className="card-title">
                                    <b className="left">Event/Campaign Posters</b>
                                </span>
                                <div className="large-gap"></div>
                            </div>
                            <div className="card-action">
                                <div className="row">
                                    <Link className="btn left btn-large blue" to="/app/posters/create">
                                        Create New Poster
                                        <i className="material-icons left small">add_to_photos</i>
                                    </Link>
                                </div>
                                <div className="row remove-bottom-padding">
                                    <Link className="btn left btn-large blue" to="/app/posters/list">
                                        View Posters
                                        <i className="material-icons left small">filter</i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}