import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';
import { useHistory } from 'react-router-dom';
import {useDispatch} from 'react-redux';
import { setToken } from '../../store/actions/authActions';

const SignUp = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [age, setAge] = useState('');
	const [nickname, setNickname] = useState('');
	const { addToast } = useToasts();
	const history = useHistory();
	const dispatch = useDispatch();

	const submitForm = () => {
		axios.post('http://localhost:8080/user/create', {
			email: email,
			password: password,
			age: age,
			nickname: nickname
		})
			.then(res => {
				dispatch(setToken(res.data.token));
				history.push('/');
			})
			.catch(() => addToast('Error', { appearance: 'error', autoDismiss: true, })); 
		
	};
    
	return <>
		<div className={'login'}>
			<Form className={'form'}>
				<Form.Group>
					<Form.Label>Email</Form.Label>
					<Form.Control
						type="email"
						placeholder="Email"
						value={email}
						onChange={e => setEmail(e.target.value)}/>
				</Form.Group>

				<Form.Group>
					<Form.Label>Имя пользователя</Form.Label>
					<Form.Control
						type="text"
						placeholder="Имя пользователя"
						value={nickname}
						onChange={e => setNickname(e.target.value)}/>
				</Form.Group>

				<Form.Group>
					<Form.Label>Возраст</Form.Label>
					<Form.Control
						placeholder="Возраст"
						onChange={e => setAge(e.target.value)}
						value={age}/>
				</Form.Group>

				<Form.Group>
					<Form.Label>Пароль</Form.Label>
					<Form.Control
						type="password"
						placeholder="Пароль"
						onChange={e => setPassword(e.target.value)}
						value={password}/>
				</Form.Group>
                
				<Button variant="primary" onClick={submitForm}>
                    Зарегестрироваться
				</Button>
			</Form>
		</div>
	</>;
};

export default SignUp;