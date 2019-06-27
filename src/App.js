import React from 'react';

import './App.css';

import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css';

import Index from './Components/Index';
import SignIn from './Components/SignIn';
import LogOut from './Components/LogOut';
import Landing from './Components/Landing';
import CreatorPoster from './Components/CreatorPoster';
import ViewerPoster from './Components/ViewerPoster';
import CreatePoster from './Components/CreatePoster';
import ListPosters from './Components/ListPosters';
import ViewPoster from './Components/ViewPoster';

import { 
  AppProvider,
  AppContext,
  AppConsumer
} from './Components/AppContext';

import { 
  BrowserRouter as Router, 
  Route, 
  Link,
  Switch
} from 'react-router-dom';

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isSignedIn: false,
      user: null
    }
  }

  componentDidMount () {
    M.AutoInit()
  }

  _renderSignInLink = () => {
    if (!this.state.isSignedIn) {
      return (
        <li>
          <Link to="/sign-in/">
            <i className="material-icons left">exit_to_app</i>
            <b>Sign In</b>
          </Link>
        </li>
      )
    }
  }

  _onAuthStateChanged = (user) => {
    console.log('onAuthStateChanged')
    this.setState({
      isSignedIn: !!user,
      user
    })
  }

  _renderLogOutLink = () => {
    if (this.state.isSignedIn) {
      return (
        <li>
          <Link to="/log-out/">
            <i className="material-icons left">open_in_new</i>
            <b>Log Out</b>
          </Link>
        </li>
      )
    }
  }

  _renderAppLink = () => {
    return (
      <li>
        <Link to="/app/">
          <i className="material-icons left">apps</i><b>App</b>
        </Link>
      </li>
    )
  }

  render () {
    return (
      <AppProvider onAuthStateChanged={this._onAuthStateChanged}>
        <Router>
          <div className="App">
            <nav className="blue">
              <div className="nav-wrapper">
                <Link to="/" className="brand-logo center">
                  IWBT
                </Link>
                
                <a href="#!" data-target="mobile-menu" className="sidenav-trigger">
                  <i className="material-icons">menu</i>
                </a>

                <ul className="right hide-on-med-and-down">
                  { this._renderAppLink() }
                  { this._renderLogOutLink() }
                  { this._renderSignInLink() }
                </ul>

              </div>
            </nav>

            <ul className="sidenav" id="mobile-menu">
              { this._renderAppLink() }
              { this._renderLogOutLink() }
              { this._renderSignInLink() }
            </ul>
    
            <div className="container">
            <Switch>
              <Route path="/" exact component={Landing} />
              
              <Route path="/events/:eventId/:posterId/" component={CreatorPoster} />
              
              <Route path="/sign-in/" component={SignIn} />
              <Route path="/log-out/" component={LogOut} />

              <Route path="/app/" exact component={Index} />
              <Route path="/app/posters/create/" exact component={CreatePoster} />
              <Route path="/app/posters/list/" exact component={ListPosters} />
              <Route path="/app/posters/:posterId/" exact component={ViewPoster} />
              
              <Route path="/p/:shortCodeId/" component={ViewerPoster} />
            </Switch>
            </div>
            
          </div>
        </Router>
      </AppProvider>
    );
  }
}

App.contextType = AppContext