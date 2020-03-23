import React from "react";
import { Card, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Movie(props) {
  let htmlMovie = props.movieList.map(movie => {
    let genreNames = [];
    for (let i = 0; i < movie.genre_ids.length; i++) {
      if (props.genreList.length > 0) {
        let genreName = props.genreList.find(
          genre => genre.id === movie.genre_ids[i]
        ).name;
        genreNames.push(genreName);
      }
    }

    return (
      <Card
        className="col-md-4 p-3 bg-dark align-text-top"
        style={{ width: "30rem" }}
      >
        <Card.Img onClick={()=>props.openModal(movie.id)}
          variant="top"
          src={`https://image.tmdb.org/t/p/w1280${movie.poster_path}`}
          thumbnail
        />
        <Card.Body>
          <Card.Title className="text-light">{movie.title}</Card.Title>
          <Card.Text>
            {genreNames.map(genre => (
              <Badge pill variant="warning" className="my-1">
                <div style={{ fontSize: 11 }}>{genre}</div>
              </Badge>
            ))}
          </Card.Text>
        </Card.Body>
        <Card.Text className="text-light ">{movie.overview}</Card.Text>
        <Card.Footer className="d-flex row justify-content-between">
          <div className="text-light" style={{ fontSize: 15 }}>
            <span className="text-warning h5">&#9733;</span>
            {movie.vote_average}
          </div>
          <p className="text-light" style={{ fontSize: 15 }}>
            <span className="text-warning">&hearts;</span>
            {movie.popularity}
          </p>
        </Card.Footer>
      </Card>
    );
  });
  return (
    <div className="d-flex flex-wrap main justify-content-center align-items-strech bg-dark">
      {htmlMovie}
    </div>
  );
}
