import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import Rating from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './movie.scss';
import {useSelector} from 'react-redux';

const Movie = () => {
	const { id } = useParams();
	const [movie, setMovie] = useState({});
	const [initialRating, setInitialRating] = useState(0);
	const token = useSelector(state => state.user.token);

	useEffect(() => {
		axios.get(`http://localhost:8080/movies/${id}`)
			.then(res => setMovie(res.data))
			.catch(err => console.log(err));
		axios.get(`http://localhost:8080/movies/rated/${id}`, { params: { token: token}})
			.then(res => setInitialRating(res.data.value))
			.catch(err => console.log(err));
	}, []);

	const rateMovie = (value) => {
		axios.post(`http://localhost:8080/movies/rate/${id}`, {value: value, token: token})
			.then(res => console.log(res))
			.catch(err => console.log(err));
	};

	return (
		<>
			{console.log(movie)}
			{movie &&
				<div className={'movieContainer'}>
					<Image src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} fluid className={'image'}/>
					<div className={'info'}>
						<h2 style={{color: 'whitesmoke'}}>{movie.title}</h2>
						<p>Overview: {movie.overview}</p>
						<p>Release: {movie.release_date}</p>
						<p>Rate this movie:</p>
						<Rating
							className={'rate'}
							emptySymbol={<FontAwesomeIcon icon={faStar} size={'2x'} color={'white'}/>}
							fullSymbol={<FontAwesomeIcon icon={faStar} size={'2x'} color={'gold'}/>}
							fractions={2}
							onChange={value => rateMovie(value)}
							initialRating={initialRating}
						/>
					</div>
				</div>
			}
		</>
	);

};

export default Movie;