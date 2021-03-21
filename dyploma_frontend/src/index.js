import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import App from './app/App';
import store from './app/store/store';
import { Provider } from 'react-redux';
import { ToastProvider } from 'react-toast-notifications';

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<ToastProvider>
				<App />
			</ToastProvider>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);
