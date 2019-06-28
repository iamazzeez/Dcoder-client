import React, { Component } from 'react';
import FormValidator from "../utils/FormValidator";
import AuthContext from "../utils/auth-context";


class Login_Register extends Component {

   static contextType = AuthContext;

  constructor() {
    super();

    this.validator = new FormValidator([
      { 
        field: 'email', 
        method: 'isEmpty', 
        validWhen: false, 
        message: 'Email is required.' 
      },
      { 
        field: 'email',
        method: 'isEmail', 
        validWhen: true, 
        message: 'That is not a valid email.'
      },
      { 
        field: 'password', 
        method: 'isEmpty', 
        validWhen: false, 
        message: 'Password is required.'
      }
    ]);

    this.state = {
      email: '',
      password: '',
      validation: this.validator.valid(),
      registerMessage: '',
    }

    this.submitted = false;
  }

  handleInputChange = event => {
    event.preventDefault();

    this.setState({
      [event.target.name]: event.target.value,
    });
  }
    //Login
  handleLogin = event => {
    event.preventDefault();

    const validation = this.validator.validate(this.state);
    this.setState({ validation });
    this.submitted = true;

    if (validation.isValid) {
      // handle actual form submission here
      console.log(this.state.email, this.state.password)

      const requestBody = {           
        email: this.state.email,
        password: this.state.password
        }
       
fetch('http://localhost:5000/login', {
  method: 'POST',
  body: JSON.stringify(requestBody),
  headers: {
    'Content-Type': 'application/json',

  }
}).then(res => {
  if(res.status !== 200 && res.status !== 201){
    this.setState({
      registerMessage: 'Auth Failed'
    }) 
    throw new Error('Failed!')
    
  } 
  res.json().then(resData => {
 if(resData.token)
  
  localStorage.setItem('token', resData.token)
  localStorage.setItem('email', resData.email)
  localStorage.setItem('userId', resData.userId)
  this.context.login(resData.token, resData.userId, resData.email)
  this.setState({
    registerMessage: 'Auth Successful'
  }) 
})
})
.catch(err => {
  console.log(err)
}) 

    }
  }

  //Register
  handleRegister = event => {
    event.preventDefault();

    const validation = this.validator.validate(this.state);
    this.setState({ validation });
    this.submitted = true;

    if (validation.isValid) {
      // handle actual form submission here
      console.log(this.state.email, this.state.password)

      const requestBody = {           
        email: this.state.email,
        password: this.state.password
        }
       
fetch('http://localhost:5000/register', {
  method: 'POST',
  body: JSON.stringify(requestBody),
  headers: {
    'Content-Type': 'application/json',

  }
}).then(res => {
  if(res.status === 409){
    this.setState({
      registerMessage: 'Mail Exists'
    }) 
  } else
  if(res.status !== 200 && res.status !== 201){
    this.setState({
      registerMessage: 'Failed'
    })
    throw new Error('Failed!')
    
  }  else
  res.json().then(resData => {
    this.setState({
      registerMessage: 'User Created Please Login to Continue'
    })
})
})
.catch(err => {
  console.log(err)
}) 

    }
  }

  render() {
    let validation = this.submitted ?                         // if the form has been submitted at least once
                      this.validator.validate(this.state) :   // then check validity every time we render
                      this.state.validation                   // otherwise just use what's in state

    return (
      <div className="container"style={{maxWidth: '25rem'}} >
      <form className="demoForm">
        <h2  className='dispaly-3 my-4 text-center' >Login/Register</h2>

       
        <div className={validation.email.isInvalid && 'has-error'}>
          <label htmlFor="email">Email address</label>
          <input type="email" className="form-control"
            name="email"
            placeholder="john@doe.com"
            onChange={this.handleInputChange}
          />
          <span className="help-block">{validation.email.message}</span>
        </div>

        <div className={validation.password.isInvalid && 'has-error'}>
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control"
            name="password"
            onChange={this.handleInputChange}
          />
          <span className="help-block">{validation.password.message}</span>
        </div>

        <br/>
        <div className='m-4' style={{display: 'flex', justifyContent: "space-around"}}>
        <button onClick={this.handleLogin} className="btn btn-primary">
          Login
        </button>
        <button onClick={this.handleRegister} className="btn btn-primary">
          Register
        </button>
        </div>
      </form>
      <h6 className="text-center text-danger">{this.state.registerMessage}</h6>
      </div>
    )
  }
}
export default Login_Register;