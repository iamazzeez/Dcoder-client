import React, { Component } from 'react'
import "./floatingButton.css"
import CreateThreadModel from './newThreadModel';


export default class Threads extends Component {
    state = {
        data: '',
        search: '',
        filteredTitles: '',
        }


    
  
        onChangeSearch = (e) => {
          let filteredTitles =   Object.values(this.state.data).filter(thread =>{
              return  thread.title.indexOf(this.state.search) !== -1
          })
    
           this.setState({
               search: e.target.value,
               filteredTitles : filteredTitles
           })
        }
    
  
    componentDidMount(){
        this.getAll()

          
          }
      
      
          getAll = () => {
              fetch('http://localhost:5000/threads', {
                  method: 'GET',
                  body: null,
                  headers: {
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('token')
                
                  }
                })
                .then(
                  (response) => {
                    if (response.status !== 200) {
                      console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                      return;
                    }
                
                    // Examine the text in the response
                    response.json().then((data) => {
                      if (data.error) {
                        return this.setState({ error: data.message });
                      }
                    
                     console.log(data)
                        return this.setState({ data: data, filteredTitles: data })
                    
                  
                    })
                  }
                  )
          }

    render() {
       
        return (
            <div className="container ">
                {/* <Search data={this.state.data} /> */}.
                <div className="container m-2" style={{maxWidth: "30rem"}}>
                <input className="form-control mr-sm-2" 
                type="text" 
                placeholder="Search Titles"
                value={this.state.search}
                onChange={this.onChangeSearch.bind(this)}
                ></input>
            </div>
                 {Object.values(this.state.filteredTitles).map(thread => ( 
                <div className="card border-secondary m-4" style={{maxWidth : "60rem"}}>
                <div className="card-body">
                <h4 className="card-title"> {thread.title} </h4>
                <p className="card-text">{thread.description}</p>
                <div className="card-text" style={{display: 'flex', justifyContent: "space-between"}}>
                <div style={{display: 'flex', flexWrap: "wrap", justifyContent: "space-around",}}>
                {thread.tags[0].split(',').map(tag => (
                <p> <span  className="badge badge-pill badge-info m-1">{tag}</span></p>
                ))}
                </div>
                <div style={{display: 'flex', flexWrap: "wrap", justifyContent: "space-around",}}>
                <p> <span className="badge badge-success m-1">{thread.email}</span></p>
                <p> <span className="badge badge-success m-1">{thread.date}</span></p>
                </div>
                </div>
             </div>
            </div>
                 ))}
          <CreateThreadModel />
            </div>
        )
    }
}
