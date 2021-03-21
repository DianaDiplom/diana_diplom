import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useSelector} from 'react-redux';

const Profile = () => {
	const token = useSelector(state => state.user.token);
	const [info, setInfo] = useState(null);
    
	useEffect(() => {
		axios.get(`http://localhost:8080/user/info?token=${token}`)
			.then(res => {
				setInfo(res.data);
			})
			.catch(err => console.log(err));
	}, []);
    
	return (
		<>
			{info && <div style={{margin: 20}}>
				<p>Nickname: {info.nickname}</p>
				<p>Age: {info.age}</p>
				<p>Email: {info.email}</p>
			</div>}   
		</>
	);
};

export default Profile;