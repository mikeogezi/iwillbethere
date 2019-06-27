import React from 'react';

import { AppConsumer, AppContext } from './AppContext'

export default class LogOut extends React.Component {
    componentDidMount () {
        this.context.firebase.auth().signOut()
            .then(() => {
                console.log("User was successfully signed out")
                this.props.history.push('/')
            })
            .catch((err) => {
                console.error("An error occurred while the user was being signed out")
                console.error(err)
            })
    }

    render () {
        return (
            <AppConsumer>
                {
                    () => {
                        return (
                            <div>
                                <h2>Logging Out...</h2>
                            </div>
                        )
                    }
                }
            </AppConsumer>
        )
    }
}

LogOut.contextType = AppContext