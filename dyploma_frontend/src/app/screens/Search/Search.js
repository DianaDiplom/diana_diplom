import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import './search.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import PaginationCustom from '../../components/Pagination';


const Search = () => {
	const [ pager, setPager ] = useState({});
	const [films, setFilms] = useState([]);
	const history = useHistory();
	let location = useLocation();

	useEffect(() => {
		if(location.search.replace('?search=','') !== '') {
			getSearch();
		}
		else {
			getFilms();
		}
	}, []);

	useEffect(() => {
		if (location.search.replace('?search=','') !== '') {
			getSearch();
		}
		else {
			getFilms();
		}
	}, [location]);

	useEffect(() => {
		if (location.search.replace('?search=','') === '') {
			getFilms();
		}
	}, [pager.currentPage]);

	const handleClick = (pageNumber) => {
		setPager({ currentPage: pageNumber});
	};

	const getFilms = () => {
		axios.get(`http://localhost:8080/movies/all?page=${pager.currentPage ?  pager.currentPage : 1}`)
			.then(res => {
				setPager(res.data.pager);
				setFilms(res.data.pageOfItems);
			})
			.catch(err => console.log(err));
	};

	const getSearch = () => {
		axios.get(`http://localhost:8080/movies/search?search=${location.search.replace('?search=','')}`)
			.then(res => {
				setFilms(res.data);
			})
			.catch(err => console.log(err));
	};

	const renderFilms = () => {
		if (films.length === 0 ) return (<>No films for now</>);
		else {
			return (
				<Row>
					{films.map((film, index) => {
						return <Col sm={12} lg={3} md={4} key={index} onClick={() => history.push(`/movie/${film.id}`)}
							className={'filmCard'}>
							<Card>
								<Card.Img variant="top" src={`https://image.tmdb.org/t/p/original/${film.poster_path}`}/>
								<Card.Body>
									<Card.Title>{film.title}</Card.Title>
									{film.overview && (
																			<Card.Text className={'overview'}>
																			{film.overview.length > 25 ? `${film.overview.slice(0,25)}...` : film.overview}
																		</Card.Text>
									)}
									<Button variant="primary">Read about</Button>
								</Card.Body>
							</Card>
						</Col>;
					})}
				</Row>
			);
		}
	};

	return <div className={'search'}>
		{pager.currentPage && location.search.replace('?search=','') === '' && <PaginationCustom pager={pager} handleClick={handleClick}/>}
		{renderFilms()}
	</div>;
};

export default Search;