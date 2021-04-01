import '../App.css';
import {Table, Container, Row, Button, ButtonGroup, Form, Col, Jumbotron, Toast } from 'react-bootstrap';
import React, { Component, useState } from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { Link } from 'react-router-dom';

class  Playlists extends Component {

    state = {
        getPlaylists: [],
        play: '',
        searching: ''
    }

    getTracks = async() => {
        const response = await fetch('/api/playlists');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    //get all the playlists
    componentDidMount() {
        this.getTracks()
          .then(res => {
            this.setState({ getPlaylists: res });
          })
    }

    //delete playlist by id
    deleteItem = async (item) => {

      const settings = {
        method: 'DELETE'
      };
      try {
        const fetchResponse = await fetch(`http://localhost:8080/api/playlists/${item}`, settings);
        const data = await fetchResponse.json();
        alert('item deleted');
        window.location.reload();
        return data;
      } catch (e) {
        alert('error');
        return e;
      }    

    } 
    
    //edit one of the items in the list
    handleInputChange(event){
      let val = event.target.value;
      //set value for editItem
      this.state.play = val;
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
      const response = await fetch(`/api/playlists/search/${val}`);
      const body = await response.json();
      if (response.status !== 200) throw Error(body.message);

      let message;
      if (body.error) {
        message = body.error
      }
      else{
        let data = body[0].Name;
        let id = body[0].PlaylistId;
        message = `id: ${id} ${data}`;
      }
      
      //show results
      document.getElementById("results").classList.remove("hide");
      document.getElementById("results").classList.add("show");
      document.getElementById("results").innerHTML = message;
      
      return body;
    }

    //edit item
    async editItem(id) {

      const val = this.state.play;

      const settings = {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name: val})
      };
      try {
        const fetchResponse = await fetch(`http://localhost:8080/api/playlists/${id}`, settings);
        const data = await fetchResponse.json();
        alert('item saved');
        return data;
      } catch (e) {
        alert('error');
        return e;
      }    

    }
      
    render() {
        const { getPlaylists } = this.state;

        //get all playlists (home)
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
              { getPlaylists.map(playlist => 
                <tr>
                  <td>{playlist.PlaylistId}</td>
                  <td>
                    <input
                    type="text"
                    className="form-control"
                    id={playlist.PlaylistId}
                    defaultValue={playlist.Name}
                    onChange={(event) => this.handleInputChange(event)}
                    />
                  </td>
                  {/* <td>{playlist.Name}</td> */}
                  <td>
                  <ButtonGroup>
                    <Link className="btn btn-secondary btn-sm" role="button" onClick={() => this.editItem(playlist.PlaylistId, playlist.Name)}>save</Link>
                    {/* to="/playlist/add" */}
                    <Link className="btn btn-secondary btn-sm" role="button" onClick={() => this.deleteItem(playlist.PlaylistId)}>X</Link> 
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
                            placeholder="Playlist name"
                            required
                            onChange={(event) => this.handleSearchChange(event)}
                         /> 
                      </Form.Group>
                      <Button variant="primary" type="submit" >
                        Search
                      </Button>
                    </Form>

                    {/* search resulsts */}
                    <div className="mt-5 hide" id="results">
                      <p>{this.state.searchResults}</p>
                    </div>

                  </Jumbotron>
                </Col>  
              </Row>
            </Container>
          );
          
        };

        //add new playlist
        const AddPlaylist = () => {

          function PlayListForm() {

            //state using hook
            const [playlistName,setPlaylistName] = useState();
          
            const handleSubmit = (event) => {          
              event.preventDefault();
              event.stopPropagation();   
              savePlaylist(playlistName);
            };

            const handlePlaylistChange = (event) => {
              setPlaylistName(event.target.value);
            };

            const savePlaylist = async (list) => {
              const settings = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: list})
              };
              try {
                const fetchResponse = await fetch(`http://localhost:8080/api/playlists`, settings);
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
                      <Form.Label>Add a new playlist</Form.Label>
                      <Form.Control onChange={handlePlaylistChange} type="text" placeholder="Playlist name" required/>
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
          return(<PlayListForm />);

        };

        return(
            <div>
              <Router>
                <Switch>
                  <Container>
                    <h3>
                      Playlists ({getPlaylists.length})
                      <ButtonGroup className="ml-2">
                        <Link className="btn btn-secondary btn-sm" role="button" to="/playlist/add">add</Link>
                        <Link className="btn btn-secondary btn-sm" role="button" to="/playlist/search">search</Link>
                        {/* the component should update */}
                        <Link className="btn btn-secondary btn-sm" role="button" onClick={() => {window.location.href="/playlists"}}>list</Link>
                      </ButtonGroup>
                    </h3>    
                    <Route path="/playlists" exact component={Home} />
                    <Route path="/playlist/add" component={AddPlaylist} />
                    <Route path="/playlist/search" component={SearchPlaylist} />
                  </Container>
                </Switch>
              </Router>
            </div>
         );
        }

}

export default Playlists;