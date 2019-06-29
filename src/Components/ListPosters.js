import React from 'react';

import { Link } from 'react-router-dom'

import person from '../Images/person.jpg';
import people from '../Images/people.jpg';
import politician from '../Images/politician.jpg';
import concertOne from '../Images/concertOne.jpg';
import concertTwo from '../Images/concertTwo.jpg';

import { AppConsumer, AppContext } from './AppContext';
import FirebaseUtils from '../Lib/FirebaseUtils';

import M from 'materialize-css';

export default class ListPosters extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            posters: [
                // {
                //     "imageUrl": concertOne,
                //     "title": "Levitation 2019",
                //     "phrase": "I will be going to the Levitation Music Concert in November",
                //     "id": "1"
                // },
                // {
                //     "imageUrl": concertTwo,
                //     "title": "Levitation Weekly",
                //     "phrase": "I will be going to Levitation Weekly Tommorow",
                //     "id": "2"
                // },
                // {
                //     "imageUrl": politician,
                //     "title": "Alfred Lasisi",
                //     "phrase": "I stand with Comrade Alfred Lasisi in the upcoming NASSA Elections",
                //     "id": "3"
                // }
            ],
            toBeDeletedId: null
        };

        this.modalRef = React.createRef()
    }

    componentDidMount () {
        if (!this.props.signedIn) {
            return this.props.history.push("/sign-in/")
        }
        this.loadPosters()
    }

    openConfirmDeleteModal (id) {
        this.setState({
            toBeDeletedId: id
        })
        M.Modal.getInstance(this.modalRef).open()
    }

    onClickDelete = (e) => {
        this.openConfirmDeleteModal(e.target.id)
    }

    onClickConfirmDelete = (e) => {
        this.deletePoster(this.state.toBeDeletedId)
        this.setState({
            toBeDeletedId: null
        })
        M.toast({
            html: "Poster Has Been Deleted"
        })
    }

    onClickCopyLink = (e) => {
        M.toast({
            html: "Poster Link Copied To The Clipboard<br />" + 
                this.copyLink(e.target.id)
        });
    }

    copyLink = (id) => {
        let [ { shortCode } ] = this.state.posters.filter(({ shortCode }) => shortCode);
        
        console.log("Short Code", shortCode);
        
        let cE = document.createElement("textarea")
        let value = `${window.location.origin}/p/${shortCode}`
        cE.value = value
        document.body.append(cE)
        cE.select()
        document.execCommand("copy")
        document.body.removeChild(cE)

        return value;
    }

    deletePoster (id) {
        let { posters } = this.state
        this.setState({
            posters: posters.filter((poster, i) => {
                return poster.id != id
            })
        });

        let { firebase } = this.context;

        FirebaseUtils.deletePoster(firebase, id);
    }

    async loadPosters () {
        try {
            let { firebase } = this.context;
            let posters = await FirebaseUtils.getPosters(firebase);
            window.d = posters
            this.setState({
                posters: posters.docs.map(p => p.data())
            });
        }
        catch (e) {
            console.error("Error Loading Posters");
            console.error(e);
            this.setState({
                posters: null
            });
            M.toast({
                html: "An Error occured while loading the Posters. Please check your Internet connection then try again."
            });
        }
    }

    // TODO: Add id key to poster object
    _renderPosterCard = ({ shortCode, posterImageSrc, title, phrase, id }) => {
        return (
            <div className="row" key={id}>
                <div className="card grey lighten-3">
                    <div className="card-content row remove-bottom-padding">
                        <div className="col s6 m4 l3">
                            <div className="materialboxed responsive-container center">
                                <img src={posterImageSrc} className="responsive-img" />
                            </div>
                        </div>
                        <div className="col s6 m8 l9" style={{textAlign: "left"}}>
                            <ul className="collection hide-on-small-only show-on-medium-and-up">
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
        return this._renderNotList("You Don't Have Any Posters Yet")
    }

    _renderErrorLoading = () => {
        return this._renderNotList("An error occured while loading the Poster. Reload the page to try again.")
    }

    _renderNotList = (message) => {
        return (
            <div className="row">
                <div className="card grey lighten-3">
                    <div className="card-content" style={{}}>
                        <span className="card-title" style={{marginBottom: 0}}>
                            <b className="">{message}</b>
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
                <div id="confirm-modal" className="modal" ref={(ref) => { this.modalRef = ref; }}>
                    <div className="modal-content">
                        <h5>
                            Are You Sure You Want To Delete The Poster?
                            <i className="material-icons left">danger</i>
                        </h5>
                    </div>
                    <div className="modal-footer">
                        <a onClick={this.onClickConfirmDelete} className="modal-action modal-close waves-effect waves-dark btn-flat red white-text" href='#!'>
                            <b>Yes, Delete The Poster</b>
                        </a>
                        <a className="left modal-action modal-close waves-effect waves-dark btn-flat blue-text" href='#!'>
                            <b>Cancel</b>
                        </a>
                    </div>
                </div>
                <h2>Your Posters</h2>
                <div className="col s12">
                    {
                        (this.state.posters == null) &&
                        this._renderErrorLoading()
                    }
                    {
                        (this.state.posters != null) &&
                        !!this.state.posters.length &&
                        this.state.posters.map(this._renderPosterCard)
                    }
                    {
                        (this.state.posters != null) &&
                        !this.state.posters.length &&
                        this._renderNoPosters()
                    }
                </div>
            </div>
        )
    }
}

ListPosters.contextType = AppContext