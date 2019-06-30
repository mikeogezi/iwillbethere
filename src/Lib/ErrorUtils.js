import React from 'react';

export default class ErrorUtils {
    static renderLoadingPageFailed (message) {
        return (
            <div className="row">
                <div className="card grey lighten-3">
                    <div className="card-content" style={{}}>
                        <span className="card-title" style={{ marginBottom: 0 }}>
                            <b className="">{message || "An error occured while loading the page. Please check your internet connection and try again."}</b>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}