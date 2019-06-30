import React from 'react';

import { AppConsumer, AppContext } from './AppContext'

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

export default class SignIn extends React.Component {
    constructor (props) {
        super(props)
    }

    componentDidMount () {

    }

    render () {
        return (
            <AppConsumer>
                {
                    ({ firebase }) => {
                        // Configure FirebaseUI.
                        const uiConfig = {
                            // Popup signin flow rather than redirect flow.
                            signInFlow: 'popup',
                            credentialHelper: 'none',
                            // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
                            // signInSuccessUrl: '/app',
                            // We will display Google and Facebook as auth providers.
                            signInOptions: [
                                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                                firebase.auth.EmailAuthProvider.PROVIDER_ID,
                                firebase.auth.PhoneAuthProvider.PROVIDER_ID
                            ],

                            callbacks: {
                                // Avoid redirects after sign-in.
                                signInSuccessWithAuthResult: () => {
                                    setTimeout(() => {
                                        this.props.history.push("/app/");
                                    }, 100)
                                    return false;
                                }
                            }
                        };
                        
                        return (
                            <div>
                                <h2>Sign In</h2>
                                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
                            </div>
                        )
                    }
                }
            </AppConsumer>
        )
    }
}

SignIn.contextType = AppContext