import React from 'react'
import { Modal } from 'react-bootstrap';
import FormValidator from "../utils/FormValidator";


export default class CreateThreadModel extends React.Component {
    constructor(props, context) {
      super(props, context);
  
      this.handleShow = this.handleShow.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.onChangeTitle = this.onChangeTitle.bind(this);
      this.onChangeDescription = this.onChangeDescription.bind(this);
      this.onChangeTags = this.onChangeTags.bind(this);
      this.onSubmit = this.onSubmit.bind(this);

      this.validator = new FormValidator([
        { 
          field: 'title', 
          method: 'isEmpty', 
          validWhen: false, 
          message: 'Title is required.' 
        },
        { 
          field: 'description',
          method: 'isEmpty', 
          validWhen: false, 
          message: 'Description is required'
        },
        { 
          field: 'tags', 
          method: 'isEmpty', 
          validWhen: false, 
          message: 'Tag is required.'
        }
      ]);
  
  
      this.submitted = false;
  
      this.state = {
        show: false,
        title: '',
        description: '',
        tags: [],
        validation: this.validator.valid(),
        email: localStorage.getItem('email'),
        userId: localStorage.getItem('userId')
      };
    }
  
    handleClose() {
      this.setState({ show: false });
    }
  
    handleShow() {
      this.setState({ show: true });
    }

    onChangeTitle = event => {
      this.setState({
         title : event.target.value,
      });
    }

    onChangeDescription = event => {
      this.setState({
         description : event.target.value,
      });
    }
    onChangeTags = event => {
      this.setState({
         tags : event.target.value,
      });
    }

    onSubmit = (e) => {
      e.preventDefault()
      const validation = this.validator.validate(this.state);
      this.setState({ validation });
      this.submitted = true;

      const data = { title: this.state.title,
        description: this.state.description, 
        tags: this.state.tags, 
        email: this.state.email, 
        userId: this.state.userId  }


        if (validation.isValid) {
      e.preventDefault()
      fetch('http://localhost:5000/threads', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem('token')
      }
    }).then(res => {
      if(res.status !== 200 && res.status !== 201){
        throw new Error('Failed!')
      } 
      res.json().then(resData => {
      console.log(resData);
    })
    })
    .catch(err => {
      console.log(err)
    }) 

        this.setState({
          title: '',
          description: '',
          tags: [],
    });
    this.handleClose()
    window.location.reload();
      }
    }
    render() {

      console.log({title: this.state.title,
        description: this.state.description, 
        tags: this.state.tags, 
        email: this.state.email, 
        userId: this.state.userId} )

        let validation = this.submitted ?                         // if the form has been submitted at least once
        this.validator.validate(this.state) :   // then check validity every time we render
        this.state.validation                   // otherwise just use what's in state


      return (
        <>
           <button className="btn pmd-btn-fab pmd-ripple-effect btn-primary app-fab--absolute" onClick={this.handleShow} type="button">
                  <i class="material-icons pmd-sm">add</i>
             </button>
  
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Create New Thread</Modal.Title>
            </Modal.Header>
            <form className="form-group container" >    
            <label className="form-label" for="inputDefault">*Title</label>
            <input  type="text"
                                className="form-control"
                                value={this.state.title}
                                onChange={this.onChangeTitle}
                                placeholder="Enter Title"
                                />
                                 <span className="help-block  text-danger">{validation.title.message}</span>

              <div class="form-group">
           <label for="exampleTextarea">*Description</label>
            <textarea class="form-control"
             id="exampleTextarea"
             placeholder="Enter Description"
            rows="3"
            value={this.state.description}
            onChange={this.onChangeDescription}
            ></textarea>
             <span className="help-block  text-danger">{validation.description.message}</span>
             </div>
            <label className="form-label" for="inputDefault">*Tags</label>
            <input  type="text"
                                className="form-control"
                                value={this.state.tags}
                                onChange={this.onChangeTags}
                                placeholder="Use Comma to seperate tags"
                                />
                                 <span className="help-block  text-danger">{validation.tags.message}</span>
            <Modal.Footer>
            <button type="submit" onClick={this.onSubmit} class="btn btn-success">Create</button>
            </Modal.Footer>
            </form>
          </Modal>
        </>
      );
    }
  }
  
