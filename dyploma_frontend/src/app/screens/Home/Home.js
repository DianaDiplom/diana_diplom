import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './home.scss';
import axios from 'axios';
import {useSelector} from 'react-redux';


const Home = () => {
	const [ films, setFilms ] = useState([]);
	const token = useSelector(state => state.user.token);
	const history = useHistory();

	useEffect(() => {
		getSimilarityRecommendations();
	}, []);

	const getSimilarityRecommendations = () => {
		axios.get(`http://localhost:8080/movies/recommendations/simmilarity?token=${token}`)
			.then(res => {
				const films = res.data.filter((v,i,a)=>a.findIndex(t=>(t.title === v.title))===i);
				setFilms(films);
			})
			.catch(err => console.log(err));
	};

	const renderFilms = () => {
		if (films.length > 0 ) {
			return (
				<Row>
					{/*<Button onClick={() => getSimilarityRecommendations()}>Similarity</Button>*/}
					{films.map((film, index) => {
						return <Col sm={12} lg={3} md={4} key={index} onClick={() => history.push(`/movie/${film.id}`)} 
							className={'filmCard'}>
							<Card>
								<Card.Img variant="top" src={`https://image.tmdb.org/t/p/original/${film.poster_path}`}/>
								<Card.Body>
									<Card.Title>{film.title}</Card.Title>
									<Card.Text className={'overview'}>
										{film.overview.length > 75 ? `${film.overview.slice(0,75)}...` : film.overview}
									</Card.Text>
									<Button variant="primary">Read about</Button>
								</Card.Body>
							</Card>
						</Col>;
					})}
				</Row>
			);
		}
	};

	return (
		<div className={'home'}>
			<h2 className={'title'}>Your recomendations</h2>
			<Container fluid>
				{renderFilms()}
				{films.length === 0 && <p style={{color: 'white'}}>Please rate more movies for recommendations provide</p>}
			</Container>
		</div>
	);
};

export default Home;