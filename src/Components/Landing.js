import React from 'react'

import { Link } from 'react-router-dom';

export default class Landing extends React.Component {
    _renderSlideshow () {
        return (
            <div></div>
            // <div className="row remove-bottom-padding">
            //     <div className="col s12">
            //         <button onClick={this.onClickCopyLink} className="another-btn btn left blue" id={id}>
            //             Copy Share Link
            //             <i className="material-icons left small">link</i>
            //         </button>
            //         <button onClick={this.onClickDelete} className="btn left red" id={id}>
            //             Delete Poster
            //             <i className="material-icons left small">delete</i>
            //         </button>
            //     </div>
            // </div>
        )
    }
    render () {
        return (
            <div>
                <h2>Welcome to IWBT</h2>
                <div className="row">
                    <div className="card grey lighten-3">
                        <div className="card-content row remove-bottom-padding">
                            <h6>IWBT allows you to appeal to your audience by allowing them to create customized images promoting your message.</h6>
                            <h6 className="hide">Below are some examples of what you can do with the IWBT app.</h6>
                        </div>
                        <div className="card-action">
                            {
                                this._renderSlideshow()
                            }
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="card grey lighten-3">
                        <div className="card-content" style={{}}>
                            <span className="card-title" style={{marginBottom: 0}}>
                                <b className="">Improve Your Engagement</b>
                            </span>
                        </div>
                        <div className="card-action">
                            <div className="row remove-bottom-padding">
                                <Link className="btn btn-large purple center" to="/app/">
                                    Get Started
                                    <i className="material-icons left">open_in_new</i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}