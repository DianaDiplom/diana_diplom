import React from 'react';
import './App.scss';
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from 'react-router-dom';
import Login from './screens/Login/Login';
import SignUp from './screens/SignUp/SignUp';
import Home from './screens/Home/Home';
import Movie from './screens/Movie/Movie';
import Search from './screens/Search/Search';
import Profile from './screens/Profile/Profile';
import GuardedRoute from './routing/GuardedRoute';
import {useSelector} from 'react-redux';
import Navigation from './components/Navigation/Navigation';

const App = () => {
	const token = useSelector(state => state.user.token);

	return (
		<>
			<Router>
				{token && <Navigation/>}
				<Switch>
					<Route path={'/login'} component={Login}/>
					<Route path={'/signup'} component={SignUp}/>
					<GuardedRoute path={'/movie/:id'} component={Movie}/>
					<GuardedRoute name='home' exact path={'/'} component={Home}/>
					<GuardedRoute path={'/search'} component={Search}/>
					<GuardedRoute path={'/profile'} component={Profile}/>
				</Switch>
			</Router>
		</>
	);
};

export default App;
