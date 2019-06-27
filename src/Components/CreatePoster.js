import React from 'react'

import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css';

import './CreatePoster.css'

import person from '../Images/person.jpg'

import Jimp from 'jimp'

import ImageUtils from '../Lib/ImageUtils'

// import Vibrant from 'node-vibrant'

export default class CreatePoster extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            hasSelectedImage: false,
            posterImageSrc: null,
            userImageSrc: null,
            title: "",
            catchPhrase: "",
        };

        this.phraseAutocompleteRef = React.createRef()
        this.catchPhrases = {
            "I will be attending": null,
            "I will be voting for": null
        }

        window.x = {
            Jimp, that: this
        }
    }

    componentDidMount () {
        M.AutoInit()
        console.log("Adding Text To The Image")
        ImageUtils.addTextToImage(person)
            .then(imageSrc => {
                this.setState({
                    userImageSrc: imageSrc
                })
            })
            .catch(err => {
                console.error("Error Adding Text To The Image")
                console.error(err)
            })
    }

    onAutoCompleteRef = (ref) => {
        this.phraseAutocompleteRef = ref
        this.autocompleteInstance = M.Autocomplete.init(this.phraseAutocompleteRef, {
            data: this.catchPhrases,
            onAutocomplete: (phrase) => {
                console.log(phrase)
                this.setState({
                    catchPhrase: phrase
                })
            }
        })
    }

    _renderPosterImage = () => {
        // accept="image/x-png,image/gif,image/jpeg"
        if (this.state.hasSelectedImage) {
            return (
                <div className="materialboxed responsive-container center">
                    <img
                        onLoad={ () => { M.AutoInit() } }
                        className="responsive-img center"
                        src={this.state.posterImageSrc} 
                        id="poster-image-preview" />
                </div>
            )
        }
        
        return (
            <div className="container">
                <div className="row">
                    <div className="card grey lighten-3">
                        <div className="center" style={{paddingTop: '16px'}}>
                            <i className="material-icons medium">broken_image</i>
                        </div>
                        <div className="card-content row remove-bottom-padding center">
                            <p>No Image Selected</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    _renderUserImage = () => {
        return (
            <div className="materialboxed responsive-container center">
                <img
                    onLoad={ () => { M.AutoInit() } }
                    className="responsive-img center"
                    src={this.state.userImageSrc || person}
                    id="user-image-preview" />
            </div>
        )
    }

    _readImageSrc = (input) => {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = (e) => {
                console.log("onLoad")
                this.setState({
                    hasSelectedImage: true,
                    posterImageSrc: e.target.result
                })
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    onFileChange = (e) => {
        this._readImageSrc(e.target)
    }

    onClickSubmit = (e) => {
        console.log("Clicked Submit")
    }

    render () {
        return (
            <div>
                <h2>Create Poster</h2>
                <div className="col s12">
                    <div className="row">
                        <form action="#">
                            <div className="file-field input-field">
                                <div className="btn blue">
                                    <i className="material-icons left">image</i>
                                    <span>
                                        { this.state.hasSelectedImage && "Change Image" }
                                        { !this.state.hasSelectedImage && "Select Image" }
                                    </span>
                                    <input 
                                        onChange={this.onFileChange} 
                                        accept="image/x-png,image/jpeg"
                                        type="file" />
                                </div>
                                <div className="file-path-wrapper">
                                    <input className="file-path validate" type="text" />
                                </div>
                            </div>
                        </form>

                        <div className="col l6 m12 s12">
                            <h5 className="center">Poster Image</h5>
                            { this._renderPosterImage() }
                        </div>

                        <div className="col l6 m12 s12">
                            <h5 className="center">User Image</h5>
                            { this._renderUserImage() }
                        </div>

                    </div>

                    <div className="small-gap"></div>

                    <div className="row">
                        <div className="input-field s12">
                            <i className="material-icons prefix">title</i>
                            <input
                                onChange={ (e) => { this.setState({ title: e.target.value }); }}
                                type="text"
                                name="title" id="title"
                            />
                            <label htmlFor="title">Event/Campaign Name</label>
                        </div>

                        <div className="small-gap"></div>

                        <div className="input-field s12">
                            <i className="material-icons prefix">view_headline</i>
                            <input
                                ref={ (ref) => this.onAutoCompleteRef(ref) } 
                                onChange={ (e) => { this.setState({ catchPhrase: e.target.value }); }}
                                type="text" id="autocomplete-phrase"
                                className="autocomplete no-autoinit" 
                            />
                            <label htmlFor="autocomplete-input">Poster Phrase</label>
                        </div>
                    </div>

                    <div className="row left">
                        <button className="btn left btn-large blue" onClick={this.onClickSubmit}>
                            Create Poster
                            <i className="material-icons left">add_to_photos</i>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}