import React, {useEffect, useState} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import {useDispatch} from 'react-redux';
import { setToken } from '../../store/actions/authActions';

const Navigation = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const [search, setSearch] = useState('');

	history.listen(() => {
		setSearch('');
	});

	return (
		<Navbar bg="light" expand="lg">
			<Navbar.Brand>ArtDive</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="mr-auto">
					<Nav.Link onClick={() => history.push('/')}>Recommendations</Nav.Link>
					<Nav.Link onClick={() => history.push('/search')}>Movies</Nav.Link>
					<NavDropdown title={'Profile'}>
						<NavDropdown.Item onClick={() => history.push('/profile')}>Profile</NavDropdown.Item>
						<NavDropdown.Divider />
						<NavDropdown.Item onClick={() => dispatch(setToken(null))}>Sign out</NavDropdown.Item>
					</NavDropdown>
				</Nav>

				<Form inline>
					<FormControl type="text" placeholder="Search" className="mr-sm-2" value={search} onChange={e => setSearch(e.target.value)}/>
					<Button variant="outline-success" 
						onClick={() => history.push({pathname: '/search', search: `?search=${search}`})}>Search</Button>
				</Form>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default Navigation;