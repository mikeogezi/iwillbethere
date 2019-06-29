import React from 'react';

import './App.css';

import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css';

import Index from './Components/Index';
import SignIn from './Components/SignIn';
import LogOut from './Components/LogOut';
import Landing from './Components/Landing';
import CustomizePoster from './Components/CustomizePoster';
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
      signedIn: false,
      user: null
    }
  }

  componentDidMount () {
    M.AutoInit()
  }

  _renderSignInLink = () => {
    if (!this.state.signedIn) {
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
      signedIn: !!user,
      user
    })
  }

  _renderLogOutLink = () => {
    if (this.state.signedIn) {
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
              
              <Route path="/sign-in/" component={SignIn} />
              <Route path="/log-out/" component={LogOut} />

              <Route path="/app/" exact
                render={ (props) => <Index {...props} signedIn={this.state.signedIn} /> }
              />
              <Route path="/app/posters/create/" exact 
                render={ (props) => <CreatePoster {...props} signedIn={this.state.signedIn} /> }
              />
              <Route path="/app/posters/list/" exact 
                render={ (props) => <ListPosters {...props} signedIn={this.state.signedIn} /> }
              />
              
              {/* TODO: Implement these two routes */}
              <Route path="/app/posters/:posterId/" exact
                render={ (props) => <ViewPoster {...props} signedIn={this.state.signedIn} /> }
              />
              
              <Route path="/p/:shortCode/" component={CustomizePoster} />
            </Switch>
            </div>
            
          </div>
          
          <footer className="page-footer transparent center-align">
            <div className="container">
              <div className="row">
                <div className="col s12">
                  <p className="grey-text text-darken-1 text-center" style={{ fontWeight: "bold" }}>
                    Designed with&nbsp;
                    <i className="material-icons red-text">favorite_outline</i>
                    &nbsp;by&nbsp;
                    <a href="https://github.com/okibeogezi">
                      Mike Ogezi
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </footer>
    
        </Router>
      </AppProvider>
    );
  }
}

App.contextType = AppContext