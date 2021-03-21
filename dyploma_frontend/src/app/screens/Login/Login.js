import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './login.scss';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../../store/actions/authActions';
import { useToasts } from 'react-toast-notifications';


const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const history = useHistory();
	const dispatch = useDispatch();
	const { addToast } = useToasts();

	const login = () => {
		axios.post('http://localhost:8080/user/login', {
			email: email,
			password: password
		})
			.then(res => {
				dispatch(setToken(res.data.token));
				history.push('/');
			})
			.catch(() =>
				addToast('Неверный email или пароль', { appearance: 'error', autoDismiss: true, })
			);
	};

	return (
		<div className={'login'}>
			<Form className={'form'}>
				<Form.Group>
					<Form.Label>Email</Form.Label>
					<Form.Control
						type="email"
						placeholder="Email"
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
				</Form.Group>

				<Form.Group value={password}>
					<Form.Label>Пароль</Form.Label>
					<Form.Control
						type="password"
						placeholder="Пароль"
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				</Form.Group>
				<div>
					<Button variant="primary" onClick={login}>
						Войти
					</Button>
					<p className={'redirectToSignup'}>
						Создайте аккаунт, если это необходимо.
						<span onClick={() => history.push('/signup')} className={'redirectLink'}
						> Перейти</span>
					</p>
				</div>
			</Form>
		</div>
	);
};

export default Login;