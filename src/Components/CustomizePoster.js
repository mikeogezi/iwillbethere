import React from 'react'

import { AppConsumer, AppContext } from './AppContext';
import FirebaseUtils from '../Lib/FirebaseUtils';

import LoaderUtils from '../Lib/LoaderUtils'

import ImageUtils from '../Lib/ImageUtils'

import { saveAs } from 'file-saver';


import M from 'materialize-css';

export default class CustomizePoster extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            fetchedData: false,
            poster: null,
            hasSelectedImage: false,
            selectedImageSrc: null,
            generatingPreview: false,
            previewImageSrc: null
        };

        this.hiddenBtn = React.createRef();
        this.imgRef = React.createRef();
    }

    async componentDidMount () {
        let { firebase } = this.context;

        try {
            let poster = await FirebaseUtils.getPoster(firebase, this.props.match.params.shortCode)
            poster = poster.docs[0].data()
            this.setState({
                fetchedData: !!poster,
                poster
            })
        }
        catch (e) {
            console.error("Error Getting Poster")
            console.error(e)
            M.toast({
                html: "An Error occured while loading the Poster. Please check your Internet connection then try again."
            });
        }
    }

    _readImageSrc = (input) => {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = (e) => {
                console.log("onLoad")
                this.setState({
                    hasSelectedImage: true,
                    selectedImageSrc: e.target.result
                })
                this.hiddenBtn.click()
                // setTimeout(() => {
                //     this.generateImagePreview()
                // }, 500)
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    generateImagePreview = async (e) => {
        let { title, phrase } = this.state.poster;
        console.log("Generating Preview", title, phrase);
        this.setState({ generatingPreview: true });

        try {
            let { 
                destImageSrc: imageSrc,
                srcImage
            } = await ImageUtils.addImageToLeftHalfOfImage(this.state.selectedImageSrc, this.state.poster.posterImageSrc);
            
            imageSrc = await ImageUtils.addTextToImage(imageSrc, { title, phrase }, srcImage);
            
            this.setState({
                generatingPreview: false,
                previewImageSrc: imageSrc
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

    _renderLoadingSpinner = () => {
        return LoaderUtils.renderMulticolorLoadingSpinner()
    }

    onFileChange = (e) => {
        this._readImageSrc(e.target)
    }

    _renderGeneratingPreviewMessage () {
        return (
            <div className="container">
                <div className="row">
                    <div className="card grey lighten-3">
                        <div className="center" style={{paddingTop: '16px'}}>
                            {
                                this._renderLoadingSpinner()
                            }
                        </div>
                        <div className="card-content row remove-bottom-padding center">
                            <p>Generating A Preview</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    _renderNoImageSelected () {
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

    _renderPreview () {
        return (
            <div className="container">
                <div className="container">
                    <div className="responsive-container center">
                        <img
                            ref={(ref) => { this.imgRef = ref; }}
                            onLoad={ (e) => { M.Materialbox.init(this.imgRef); } }
                            className="responsive-img center materialboxed center-img"
                            src={this.state.previewImageSrc} 
                            id="poster-image-preview" />
                    </div>
                </div>
                <div className="large-gap"></div>
            </div>
        )
    }

    onClickDownload = (e) => {
        console.log("Download Button Clicked")
        if (this.state.previewImageSrc) {
            saveAs(this.state.previewImageSrc, `My ${this.state.poster.title} Poster.jpeg`)
        }

    }

    render () {
        return (
            <div>
                {
                    !this.state.fetchedData &&
                    <h2>Loading...</h2>
                }
                {
                    this.state.fetchedData &&
                    <div>
                        <h2>{this.state.poster.title} Poster</h2>
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

                                <button className="hide" onClick={this.generateImagePreview} ref={(ref) => { this.hiddenBtn = ref; }}>

                                </button>

                            </div>

                            <div className="row">
                                <div className="col m12 s12 center">
                                    {
                                        this.state.generatingPreview &&
                                        this._renderGeneratingPreviewMessage()
                                    }
                                    {
                                        !this.state.generatingPreview &&
                                        !this.state.previewImageSrc &&
                                        this._renderNoImageSelected()
                                    }
                                    {
                                        !this.state.generatingPreview &&
                                        this.state.previewImageSrc &&
                                        this._renderPreview()
                                    }
                                </div>
                            </div>

                            <div className="row left">
                                <button className="btn left btn-large blue" onClick={this.onClickDownload}>
                                    Download Your Customized Poster
                                    <i className="material-icons left">file_download</i>
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

CustomizePoster.contextType = AppContext