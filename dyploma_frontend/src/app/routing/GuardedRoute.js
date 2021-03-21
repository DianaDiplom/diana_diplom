import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const GuardedRoute = ({ component: Component, ...rest}) => {
	const token = useSelector(state => state.user.token);

	return (<Route {...rest} render={props => (token ?
		<Component {...props}/> :
		<Redirect to={'/login'}/>
	)}/>);
};

export default GuardedRoute;