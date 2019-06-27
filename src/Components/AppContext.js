import React from 'react';

import firebase from 'firebase';

// Configure Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC7BLqhKKrC74aZ5q2nxdems_3N3MiyJ7E",
    authDomain: "i-will-be-there-xyz.firebaseapp.com",
    databaseURL: "https://i-will-be-there-xyz.firebaseio.com",
    projectId: "i-will-be-there-xyz",
    storageBucket: "i-will-be-there-xyz.appspot.com",
    messagingSenderId: "280756011840",
    appId: "1:280756011840:web:cbe7cd7edc4cb11e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const AppContext = React.createContext({
    firebase: {}
});

export class AppProvider extends React.Component {
    constructor (props) {
        super(props)
    }

    // Listen to the Firebase Auth state and set the local state.
    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth()
            .onAuthStateChanged((user) => {
                this.props.onAuthStateChanged(user)
            });
    }
    
    // Make sure we un-register Firebase observers when the component unmounts.
    componentWillUnmount() {
        if (this.unregisterAuthObserver) {
            this.unregisterAuthObserver();
        }
    }

    render () {
        return (
            <AppContext.Provider value={{firebase}}>
                {this.props.children}
            </AppContext.Provider>
        )
    }
}

export const AppConsumer = AppContext.Consumer