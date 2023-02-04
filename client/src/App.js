import { Container } from '@material-ui/core';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from "./components/Home/Home.js";
import Navbar from './components/Navbar/Navbar.js';
import Auth from './components/Auth/Auth.js';
import PostDetails from './components/PostDetails/PostDetails.jsx';

const App = () => {
	let user = null;
	if (localStorage.getItem('profile')) {
		user = JSON.parse(localStorage.getItem('profile'));
	} else if (localStorage.getItem('localprofile')) {
		user = JSON.parse(localStorage.getItem('localprofile'));
	}

	return (
		<BrowserRouter>
			<Container maxwidth="xl">
				<Navbar />
				<Routes>
					<Route path='/' exact element={<Navigate replace to="/posts" />} />
					<Route path="/posts" exact element={<Home />} />
					<Route path="/posts/search" exact element={<Home />} />
					<Route path="/posts/:id" element={<PostDetails />} />
					<Route path='/auth' exact element={!user ? <Auth /> : <Navigate replace to="/posts" />} />
				</Routes>
			</Container>
		</BrowserRouter>
	);
}

export default App;
