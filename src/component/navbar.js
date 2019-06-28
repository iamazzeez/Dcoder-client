
import AuthContext from "../utils/auth-context";
import React, { Component } from 'react';

export default class MainNavbar extends Component {

    handelLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('email')
        window.location = "/auth"
    }
    render() {
        return (
            <AuthContext.Consumer>
            {(context) => {
                  return (
                    <div>
                         <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                      <h4 className="navbar-brand">Dcoder</h4>
                     {localStorage.getItem('token') && <button class="btn btn-danger my-2 my-sm-0" onClick={this.handelLogout} type="submit">Logout
                     </button>}
                    </nav>
                    </div>
                )
         }}
        </AuthContext.Consumer>
        )
    }
}

