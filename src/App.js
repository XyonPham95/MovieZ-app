import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl
} from "react-bootstrap";
import Movie from "./components/Movie";
import ReactModal from 'react-modal';
import YouTube from '@u-wave/react-youtube'

let apiKey = "f4938455c5bf9908345457f130ef67ba";


function App() {
  let keyword= '';
  let [movies, setMovies] = useState([]);
  let [genres, setGenres] = useState([]);
  let [movieList, setMovieList] = useState([]);
  let [modal, setModal] = useState(false);
  let [trailer, setTrailer] = useState('');

  let CurrentPlaying = async () => {
    let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`;
    let data = await fetch(url);
    let dataResult = await data.json();
    setMovieList(data.results);
    setMovies(dataResult.results);
    let GenreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;
    let GenreResponse = await fetch(GenreUrl);
    let genreListObject = await GenreResponse.json();
    setGenres(genreListObject.genres);
  };

  useEffect(CurrentPlaying, []);
  if (movies == null) {
    return <div>loading the movie</div>;
  }

  let searchByKeyWord = async (e) => {
    keyword = e.target.value;
    if(keyword === ''){
      setMovies(movieList); 
    } else {
      setMovies(movies.filter((movie) => movie.title.toLowerCase().includes(keyword.toLowerCase())));
    }
  } 

  let openModal = async (movieID) => {
    let url = `https://api.themoviedb.org/3/movie/${movieID}/videos?api_key=${apiKey}&language=en-US`;
    let response = await fetch(url);
    let data = await response.json();
    console.log('hehe data video:', data)
    setTrailer(data.results[0].key)
    setModal(true);
  }

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="#home">MovieZNixZ</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#features">Most Popular Show</Nav.Link>
            <Nav.Link href="#pricing">About</Nav.Link>
            <NavDropdown title="Catagories" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">
                Sort by Latest
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Sort by Name
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">
                Sort by Most Watched
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form inline>
            <FormControl
            type="text" onChange={(e)=>{searchByKeyWord(e)}} placeholder="Search Your Movie" className="mr-sm-2"
            />
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <Movie movieList={movies} genreList={genres} openModal={openModal}/>
      <ReactModal
      isOpen={modal}
      style={{overlay: {display:"flex",justifyContent:"center"}, content: {width:"70%",height:"70%", position:"relative"} }}
      onRequestClose={()=>setModal(false)}>
          <YouTube video={trailer} autoplay className="video"/>
      
      </ReactModal>
    </div>
  );
}

export default App;
