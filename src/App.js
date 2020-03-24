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
import YouTube from '@u-wave/react-youtube';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import Pagination from "react-js-pagination";


let apiKey = "f4938455c5bf9908345457f130ef67ba";
let keyword= '';



function App() {
  let [movies, setMovies] = useState([]);
  let [genres, setGenres] = useState([]);
  let [movieList, setMovieList] = useState([]);
  let [modal, setModal] = useState(false);
  let [trailer, setTrailer] = useState('');
  let [rate, setRate] = useState(0);
  let [page, setPage] = useState(1);
  let [totalResult, setTotalResult] = useState(0);

  let CurrentPlaying = async () => {
    let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`;
    let data = await fetch(url);
    let dataResult = await data.json();
    setTotalResult(dataResult.total_results);
    setMovieList(dataResult.results);
    setMovies(dataResult.results);
    let GenreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;
    let GenreResponse = await fetch(GenreUrl);
    let genreListObject = await GenreResponse.json();
    setGenres(genreListObject.genres);
  };

  let next = async () => {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=1&sort_by=popularity.desc`
    let data = await fetch(url)
    let dataResult = await data.json();
    movieList = dataResult.results;
  };

  useEffect(CurrentPlaying, [], []);
  useEffect(next, []);

  useEffect(CurrentPlaying, []);
 

  let searchByRate = (value) => {
    setRate(value);
    let filteredData = movieList.filter((movie) => movie.vote_average >= value)
    setMovies(filteredData)
  }

  let handlePageChange = async pageNumber => {
    setPage(pageNumber);
    let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=${pageNumber}`
    let data = await fetch(url)
    let dataResult = await data.json();
    setMovies(dataResult.results);
  
  }

  let searchByKeyWord = e => {
    keyword = e.target.value;
    console.log("movieList",movieList)
    if(keyword === ''){
      console.log("here");
      console.log("movieList2",movieList)
      setMovies(movieList); 
    } else {
      setMovies(movies.filter((movie) => movie.title.toLowerCase().includes(keyword.toLowerCase())));
    }
  } 
  

  let mostToLeast = (key) => {
    if(!movies){
      setMovies(movieList);
    } else {
      let mostToLeast = [...movies].sort((a,b)=>b[key] - a[key])
      setMovies(mostToLeast);
    }
  }

  let openModal = async (movieID) => {
    let url = `https://api.themoviedb.org/3/movie/${movieID}/videos?api_key=${apiKey}&language=en-US`;
    let response = await fetch(url);
    let data = await response.json();
    setTrailer(data.results[0].key)
    setModal(true);
  }
  if (movies == null) {
    return (<div>loading the movie</div>);
  }

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="#home">MovieZNixZ</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#features" onClick={()=>mostToLeast('popularity')}>Most Popular Show</Nav.Link>
            <Nav.Link href="#pricing">About</Nav.Link>
            <NavDropdown title="Catagories" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">
                Sort by Latest
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Sort by Name
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3" onClick={()=>mostToLeast('popularity')}>
                Sort by Most Watched
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form inline>
            <FormControl
             onChange={(e)=>{searchByKeyWord(e)}} placeholder="Search Your Movie" className="mr-sm-2"
            />
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <div className="range container-fluid bg-dark" >
      <InputRange
        maxValue={10}
        minValue={0}
        value={rate}
        onChange={value => searchByRate(value)} /> </div>
      <Movie movieList={movies} genreList={genres} openModal={openModal}/>
      <ReactModal
      isOpen={modal}
      style={{overlay: {display:"flex",justifyContent:"center"}, content: {width:"70%",height:"70%", position:"relative"} }}
      onRequestClose={()=>setModal(false)}>
          <YouTube video={trailer} autoplay className="video"/>
      
      </ReactModal>
      <div className = "d-flex justify-content-center bg-dark">
      <Pagination
        prevPageText='prev'
        nextPageText='next'
        firstPageText='first'
        lastPageText='last'
        activePage={page}
        itemsCountPerPage={20}
        totalItemsCount={totalResult}
        pageRangeDisplayed={5}
        onChange={handlePageChange.bind(this)}
        itemClass="page-item"
        linkClass="page-link"
      /></div>
    </div>
  );
}

export default App;
