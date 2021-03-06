import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { routeActions } from 'react-router-redux';
import { asyncConnect } from 'redux-async-connect';
import Helmet from 'react-helmet';

// Bootstrap
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Alert from 'react-bootstrap/lib/Alert';

// Redux
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';

import config from '../../config';

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];

    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }

    return Promise.all(promises);
  }
}])
@connect(
  state => ({user: state.auth.user, location: state.routing.location}),
  {logout, pushState: routeActions.push})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    location: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState('/loginSuccess');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState('/');
    }
  }

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  };

  render() {
    const { user, location } = this.props;
    const styles = require('./App.scss');

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head}/>
        <Navbar fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to="/">
                <span>{config.app.title}</span>
              </IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle/>
          </Navbar.Header>

          <Navbar.Collapse eventKey={0}>
            <Nav navbar />
            <Nav navbar pullRight>
              {!user &&
              <LinkContainer to="/login">
                <NavItem eventKey={5}>Login</NavItem>
              </LinkContainer>}
              {user &&
                <NavItem eventKey={6.1} className={`subscription`}>
                  <form action="/api/subscriptions" method="POST">
                    <input type="hidden" defaultValue={user.phoneNumber} />
                    <script
                      src="https://checkout.stripe.com/checkout.js" className="stripe-button"
                      data-key={config.stripePublicKey}
                      data-name="Ridness"
                      data-description="Premium plan"
                      data-amount="500"
                      data-label="Go premium" >
                    </script>
                  </form>
                </NavItem>
              }
              {user &&
              <LinkContainer to="/logout">
                <NavItem eventKey={6} className="logout-link" onClick={this.handleLogout}>
                  Logout
                </NavItem>
              </LinkContainer>}
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className={styles.appContent}>
          {
            location && (location.query.success || location.query.error) &&
            <Alert bsStyle={location.query.error ? 'danger' : 'info'}>
              {location.query.success || location.query.error}
            </Alert>
          }
          {this.props.children}
        </div>
      </div>
    );
  }
}
