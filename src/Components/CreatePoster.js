import React from 'react'

import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css';

import './CreatePoster.css'

import person from '../Images/person.jpg';
import concertOne from '../Images/concertOne.jpg';
import concertTwo from '../Images/concertTwo.jpg';
import hypeman from '../Images/hypeman.jpg';
import people from '../Images/people.jpg';

import Jimp from 'jimp'

import ImageUtils from '../Lib/ImageUtils'
import LoaderUtils from '../Lib/LoaderUtils'

import { AppConsumer, AppContext } from './AppContext';
import FirebaseUtils from '../Lib/FirebaseUtils';

// import Vibrant from 'node-vibrant'

export default class CreatePoster extends React.Component {
    constructor (props) {
        super(props);

        // this.state = {
        //     hasSelectedImage: true,
        //     posterImageSrc: concertTwo, // TODO
        //     userImageSrc: !people || !hypeman || person,
        //     initialUserImageSrc: !people || !hypeman || person,
        //     showRegenerateTracker: "",
        //     title: "Levitation", // TODO
        //     phrase: "I Will Be Attending The 2019 Levitation Music Concert On The 3rd of November", // TODO
        //     generatingPreview: false
        // };

        this.state = {
            hasSelectedImage: false,
            posterImageSrc: null,
            userImageSrc: person,
            initialUserImageSrc: person,
            showRegenerateTracker: "",
            title: "",
            phrase: "",
            generatingPreview: false,
            creatingPoster: false,
        };

        this.phraseAutocompleteRef = React.createRef()
        this.catchPhrases = {
            "I will be attending": null,
            "I will be voting for": null
        }
    }

    componentDidMount () {
        let { firebase } = this.context;
        FirebaseUtils.mountAuthStateListener(firebase, this)

        M.AutoInit();
    }
    
    componentWillUnmount () {
        let { firebase } = this.context;
        FirebaseUtils.unmountAuthStateListener(firebase, this)
    }

    onAutoCompleteRef = (ref) => {
        this.phraseAutocompleteRef = ref
        this.autocompleteInstance = M.Autocomplete.init(this.phraseAutocompleteRef, {
            data: this.catchPhrases,
            onAutocomplete: (phrase) => {
                console.log(phrase)
                this.setState({
                    phrase
                })
            }
        })
    }

    makeText (title, phrase, pSrc) {
        return title + phrase + pSrc
    }

    onClickPreview = async (e) => {
        console.log("Generate Preview Button Clicked")

        if (!this.state.hasSelectedImage) {
            M.toast({
                html: "You must select a Poster image to generate a Preview."
            })
            return;        
        }

        let { title, phrase } = this.state;

        if (this.state.showRegenerateTracker != this.makeText(title, phrase, this.state.posterImageSrc)) {
            console.log("Generating Preview", title, phrase);
            this.setState({ generatingPreview: true });

            try {
                let { 
                    destImageSrc: imageSrc,
                    srcImage
                } = await ImageUtils.addImageToLeftHalfOfImage(this.state.initialUserImageSrc, this.state.posterImageSrc);
                
                imageSrc = await ImageUtils.addTextToImage(imageSrc, { title, phrase }, srcImage);
                
                this.setState({
                    generatingPreview: false,
                    userImageSrc: imageSrc,
                    showRegenerateTracker: this.makeText(title, phrase, this.state.posterImageSrc)
                });
                M.toast({
                    html: "The Preview was successfully generated."
                })
            }
            catch (e) {
                this.setState({ generatingPreview: false });
                M.toast({
                    html: "An Error occured while generating the Preview. The image format may not be supported. Please Try Again."
                })
                console.error("Error While Compositing Image");
                console.error(e);
            }
        }
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
                    src={this.state.userImageSrc}
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

    _renderLoadingSpinner = () => {
        return LoaderUtils.renderMulticolorLoadingSpinner()
    }

    onFileChange = (e) => {
        this._readImageSrc(e.target)
    }

    generateShortCode = () => {
        return Math.random().toString(36).substring(2, 7).toUpperCase();
    }

    onClickSubmit = async (e) => {
        console.log("Clicked Submit")
        if (!this.state.hasSelectedImage) {
            M.toast({
                html: "You must select a Poster image to create a Poster."
            })
            return;        
        }
        this.setState({ creatingPoster: true })

        try {
            await this.onClickPreview(null)
            let { title, phrase, posterImageSrc } = this.state;
            let posterDoc = {
                shortCode: this.generateShortCode(),
                title,
                phrase
            };
            let { firebase } = this.context;

            let poster = await FirebaseUtils.createPoster(firebase, posterDoc)
            const id = poster.id;
            // console.log("New Poster Id", poster.id)
            let thumbnailSrc = await ImageUtils.createThumbnail(posterImageSrc)
            let uploads = await FirebaseUtils.uploadPosterImages(firebase, {
                posterImageSrc,
                thumbnailSrc,
                id
            });

            // window.uploads = uploads;
            let posterImageUrl = await uploads.pSnapshot.ref.getDownloadURL()
            let thumbnailUrl = await uploads.tSnapshot.ref.getDownloadURL()
            console.log("Donwnload URLs", posterImageUrl, thumbnailUrl)
            poster = await FirebaseUtils.updatePosterDocWithImages(firebase, {
                posterImageUrl,
                thumbnailUrl,
                id
            })

            this.setState({ creatingPoster: false })
            this.props.history.push("/app/posters/list/")
        }
        catch (e) {
            console.error("Error Creating Poster");
            console.error(e);
            this.setState({ creatingPoster: false })
            M.toast({
                html: "An Error occurred while submitting the Poster. Please check your Internet connection and try again."
            })
        }
    }

    render () {
        let { creatingPoster, generatingPreview } = this.state;
        let generatingPreviewClassName = `btn btn-large blue center ${(generatingPreview || creatingPoster) && "disabled generating-preview" || ""}`
        let createPosterClassName = `btn left btn-large blue ${(creatingPoster || generatingPreview) && "disabled creating-poster" || ""}`

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
                                        { this.state.hasSelectedImage && "Change Poster Image" }
                                        { !this.state.hasSelectedImage && "Select Poster Image" }
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

                    <hr />
                    <div className="medium-gap"></div>

                    <div className="row">
                        <div className="col s12">
                            <button className={generatingPreviewClassName} onClick={this.onClickPreview}>
                                { this.state.generatingPreview && "Generating Preview" || "Generate Preview" }
                                <i className="material-icons left">photo_filter</i>
                            </button>
                            {
                                this.state.generatingPreview &&
                                this._renderLoadingSpinner()
                            }
                        </div>
                    </div>

                    <div className="small-gap"></div>

                    <div className="row">
                        <div className="input-field col s12">
                            <i className="material-icons prefix">title</i>
                            <input
                                onChange={ (e) => { this.setState({title: e.target.value}); }}
                                type="text"
                                value={this.state.title}
                                name="title" id="title"
                            />
                            <label htmlFor="title">Event/Campaign Name</label>
                        </div>

                        <div className="small-gap"></div>

                        <div className="input-field col s12">
                            <i className="material-icons prefix">short_text</i>
                            <input
                                ref={ (ref) => this.onAutoCompleteRef(ref) } 
                                onChange={ (e) => { this.setState({phrase: e.target.value}); }}
                                type="text" id="autocomplete-phrase"
                                value={this.state.phrase}
                                className="autocomplete no-autoinit" 
                            />
                            <label htmlFor="autocomplete-input">Poster Phrase</label>
                        </div>
                    </div>

                    <div className="row left">
                        <button className={createPosterClassName} onClick={this.onClickSubmit}>
                            { this.state.creatingPoster && "Creating Poster" || "Create Poster" }
                            <i className="material-icons left">add_to_photos</i>
                        </button>
                        {
                            this.state.creatingPoster &&
                            this._renderLoadingSpinner()
                        }
                    </div>
                </div>
            </div>
        )
    }
}

CreatePoster.contextType = AppContext