import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect, Switch, Route} from 'react-router-dom';

import Login_Register from "./pages/login_register";
import Threads from './pages/threads';
import AuthContext from "./utils/auth-context";
import MainNavbar from './component/navbar';

class App extends Component {
  state = {
    token: null,
    userId: null,
    email: null,
  }
  login = (token, userId, email) => {
    this.setState({
     token: localStorage.getItem('token'), 
     userId: localStorage.getItem('userId'), 
     email: localStorage.getItem('email')

    })
  }

  logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('email')
     this.setState({
      token: null,
     userId: null,
     email: null,

     })
  };

  render() {
    console.log(localStorage.getItem('token'))
    return (
      <Router>
        <AuthContext.Provider 
        value={{
          token: this.state.token,
          userId: this.state.userId,
          email: this.state.email,
          login: this.login,
          logout: this.logout
        }}>
   <div>
       <MainNavbar />
      <Switch>
        {!localStorage.getItem('token') && <Redirect from="/" to="/auth" exact />}
        {localStorage.getItem('token') && <Redirect from="/" to="/threads" exact />}
        {localStorage.getItem('token') && <Redirect from="/auth" to="/threads" exact />}
        <Route path="/auth" exact strict component={Login_Register} />
        {localStorage.getItem('token') && <Route path="/threads" exact strict component={Threads} />}
        </Switch>
  </div>
  </AuthContext.Provider>
      </Router>
    
    );
  }
}

export default App;
