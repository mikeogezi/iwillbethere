import React from 'react';

import { Link } from 'react-router-dom'

import person from '../Images/person.jpg';
import people from '../Images/people.jpg';
import politician from '../Images/politician.jpg';
import concertOne from '../Images/concertOne.jpg';
import concertTwo from '../Images/concertTwo.jpg';

import M from 'materialize-css';

export default class ListPosters extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            posters: [
                {
                    "imageUrl": concertOne,
                    "title": "Levitation 2019",
                    "phrase": "I will be going to the Levitation Music Concert in November",
                    "id": "1"
                },
                {
                    "imageUrl": concertTwo,
                    "title": "Levitation Weekly",
                    "phrase": "I will be going to Levitation Weekly Tommorow",
                    "id": "2"
                },
                {
                    "imageUrl": politician,
                    "title": "Alfred Lasisi",
                    "phrase": "I stand with Comrade Alfred Lasisi in the upcoming NASSA Elections",
                    "id": "3"
                }
            ]
        };
    }

    onClickDelete = (e) => {
        this.deletePoster(e.target.id)
        M.toast({
            html: "Poster Has Been Deleted"
        })
    }

    onClickCopyLink = (e) => {
        this.copyLink(e.target.id)
        M.toast({
            html: "Poster Link Copied To The Clipboard"
        })
    }

    copyLink = (id) => {
        let cE = document.createElement("textarea")
        cE.value = "" + Math.random() + id
        document.body.append(cE)
        cE.select()
        document.execCommand("copy")
        document.body.removeChild(cE)
    }

    deletePoster (id) {
        let { posters } = this.state
        this.setState({
            posters: posters.filter((poster, i) => {
                return poster.id != id
            })
        })
    }

    // TODO: Add id key to poster object
    _renderPosterCard = ({ imageUrl, title, phrase, id }) => {
        return (
            <div className="row">
                <div className="card grey lighten-3">
                    <div className="card-content row remove-bottom-padding">
                        <div className="col s6 m4 l3">
                            <div className="materialboxed responsive-container center">
                                <img src={imageUrl} className="responsive-img" />
                            </div>
                        </div>
                        <div className="col s6 m8 l9" style={{textAlign: "left"}}>
                            <ul class="collection hide-on-small-only show-on-medium-and-up">
                                <li className="collection-item avatar">
                                    <i className="material-icons circle large">title</i>
                                    <b>Title</b>
                                    <h5>{title} Poster</h5>
                                </li>
                                <li className="collection-item avatar">
                                    <i className="material-icons circle large">short_text</i>
                                    <b>Phrase</b>
                                    <h6>{phrase}</h6>
                                </li>
                            </ul>
                            <ul className="collection show-on-small hide-on-med-and-up">
                                <li className="collection-item">
                                    <b>Title</b>
                                    <h5>{title} Poster</h5>
                                </li>
                                <li className="collection-item">
                                    <b>Phrase</b>
                                    <h6>{phrase}</h6>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="card-action">
                        <div className="row remove-bottom-padding">
                            <div className="col s12">
                                <button onClick={this.onClickCopyLink} className="another-btn btn left blue" id={id}>
                                    Copy Share Link
                                    <i className="material-icons left small">link</i>
                                </button>
                                <button onClick={this.onClickDelete} className="btn left red" id={id}>
                                    Delete Poster
                                    <i className="material-icons left small">delete</i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    _renderNoPosters = () => {
        return (
            <div className="row">
                <div className="card grey lighten-3">
                    <div className="card-content" style={{}}>
                        <span className="card-title" style={{marginBottom: 0}}>
                            <b className="">You Don't Have Any Posters Yet</b>
                        </span>
                    </div>
                    <div className="card-action">
                        <div className="row remove-bottom-padding">
                            <Link className="btn btn-large blue" to="/app/posters/create">
                                Create New Poster
                                <i className="material-icons left small">add_to_photos</i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render () {
        return (
            <div>
                <h2>Your Posters</h2>
                <div className="col s12">
                    {
                        !!this.state.posters.length &&
                        this.state.posters.map(this._renderPosterCard)
                    }
                    {
                        !this.state.posters.length &&
                        this._renderNoPosters()
                    }
                </div>
            </div>
        )
    }
}