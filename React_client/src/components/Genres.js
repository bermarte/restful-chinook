import '../App.css';
import {Table, Container, Row, Button, ButtonGroup, Form, Col, Jumbotron } from 'react-bootstrap';
import React, { Component, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

class  Genres extends Component {

    state = {
        getGenreslists: [],
        genre: '',
        searching:''
    }

    getGenres = async() => {
        const response = await fetch('/api/genres');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    //get all the genres
    componentDidMount() {
        this.getGenres()
          .then(res => {
            this.setState({ getGenreslists: res });
          })
    }
    //delete playlist by id
    deleteItem = async (item) => {

        const settings = {
          method: 'DELETE'
        };
        try {
          const fetchResponse = await fetch(`http://localhost:8080/api/genres/${item}`, settings);
          const data = await fetchResponse.json();
          alert('item deleted');
          window.location.reload();
          return data;
        } catch (e) {
          alert('error');
          return e;
        }    
  
    }

    handleInputChange(event){
        let val = event.target.value;
        //set value for editItem
        this.state.genre = val;
    }  
  
      //search by id or name
      handleSearchChange(event){
        let val = event.target.value;     
        this.state.searching = val;
    }

    //search item
    handleSearch = async (event) => {
        event.preventDefault();
        const val = this.state.searching;
        const response = await fetch(`/api/genres/search/${val}`);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
  
        let message;
        if (body.error) {
          message = body.error
        }
        else{
          let data = body[0].Name;
          let id = body[0].GenreId;
          message = `id: ${id} ${data}`;
        }
        
        //show results
        document.getElementById("results").classList.remove("hide");
        document.getElementById("results").classList.add("show");
        document.getElementById("results").innerHTML = message;
        
        return body;
    }

    //edit item
    async editItem(id, nam) {
        //no modifications are added
        const val = (this.state.genre==='') ? nam : this.state.genre;
  
        const settings = {
          method: 'PUT',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({name: val})
        };
        try {
          const fetchResponse = await fetch(`http://localhost:8080/api/genres/${id}`, settings);
          const data = await fetchResponse.json();
          alert('item saved');
          return data;
        } catch (e) {
          alert('error');
          return e;
        }    
  
      }
      
    render() {
        const { getGenreslists } = this.state;

        //get all genres (home)
        const Home = () => (
            <Row>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th> </th>
                  </tr>
                </thead>
                <tbody>
                { getGenreslists.map(genre => 
                  <tr key={genre.GenreId}>
                    <td>{genre.GenreId}</td>
                    <td>
                      <input
                      type="text"
                      className="form-control"
                      id={genre.GenreId}
                      defaultValue={genre.Name}
                      onChange={(event) => this.handleInputChange(event)}
                      />
                    </td>
                    {/* <td>{playlist.Name}</td> */}
                    <td>
                      <ButtonGroup>
                        <Button className="btn btn-secondary btn-sm" role="button" onClick={() => this.editItem(genre.GenreId, genre.Name)}>save</Button>
                        {/* to="/playlist/add" */}
                        <Button className="btn btn-secondary btn-sm" role="button" onClick={() => this.deleteItem(genre.GenreId)}>X</Button> 
                        {/* to="/playlist/search" */}
                      </ButtonGroup>
                    </td>
                  </tr>)
                }
                </tbody>
              </Table>
            </Row>
        );

        //search component
        const SearchPlaylist = () => {

            return (
              <Container className="mt-5">
                <Row className="justify-content-md-center">
                  <Col xs lg="6">
                    <Jumbotron>
                    {/* onSubmit={handleSearch} */}
                      <Form onSubmit={(event) => this.handleSearch(event)}>
                        <Form.Group>
                          <Form.Label>Search by id or by name</Form.Label>
                          <Form.Control 
                              type="text"
                              placeholder="Genre name"
                              required
                              onChange={(event) => this.handleSearchChange(event)}
                           /> 
                        </Form.Group>
                        <Button variant="primary" type="submit" >
                          Search
                        </Button>
                      </Form>
  
                      {/* search results */}
                      <div className="mt-5 hide" id="results">
                        <p>{this.state.searchResults}</p>
                      </div>
  
                    </Jumbotron>
                  </Col>  
                </Row>
              </Container>
            );
            
        };

        //add new genre
        const AddGenrelist = () => {

            function GenreListForm() {
  
              //state using hook
              const [genrelistName,setGenrelistName] = useState();
            
              const handleSubmit = (event) => {          
                event.preventDefault();
                event.stopPropagation();   
                saveGenrelist(genrelistName);
              };
  
              const handleGenrelistChange = (event) => {
                setGenrelistName(event.target.value);
              };
  
              const saveGenrelist = async (list) => {
                const settings = {
                  method: 'POST',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({name: list})
                };
                try {
                  const fetchResponse = await fetch(`http://localhost:8080/api/genres`, settings);
                  const data = await fetchResponse.json();
                  alert('new item added');
                  return data;
                } catch (e) {
                  alert('error');
                  return e;
                }    
  
              }
            
              return(
              <Container className="mt-5">
              <Row className="justify-content-md-center">
                <Col xs lg="6">
                  <Jumbotron>
                    <Form onSubmit={handleSubmit} >
                      <Form.Group>
                        <Form.Label>Add a new genre</Form.Label>
                        <Form.Control onChange={handleGenrelistChange} type="text" placeholder="Genre name" required/>
                      </Form.Group>
                      <Button variant="primary" type="submit" >
                        Submit
                      </Button>
                    </Form>
                  </Jumbotron>
                </Col>
              </Row>
            </Container>
              )
            }
            return(<GenreListForm />);
  
        };

        return(
            <div>
              <Router>          
                  <Container>
                    <h3>
                      Genres ({getGenreslists.length})
                      <ButtonGroup className="ml-2">
                        <Link className="btn btn-secondary btn-sm" role="button" to="/genre/add">add</Link>
                        <Link className="btn btn-secondary btn-sm" role="button" to="/genre/search">search</Link>
                        {/* the component should update */}
                        <Link className="btn btn-secondary btn-sm" role="button" onClick={() => {window.location.href="/genres"}} to="/#">list</Link>
                      </ButtonGroup>
                    </h3>  
                    <Switch>
                      <Route path="/genres" exact component={Home} />
                      <Route path="/genre/add" component={AddGenrelist} />
                      <Route path="/genre/search" component={SearchPlaylist} />
                    </Switch>
                  </Container>         
              </Router>
            </div>
         );
        }
}

export default Genres;