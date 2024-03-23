import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './components/login.jsx';
import Register from './components/register.jsx';
import Addpost from './components/myposts.jsx';
import Profile from './components/profile.jsx';

function App(){
	return(
		<div>
		<BrowserRouter>
			<Switch>
			<Route path='/login' component={Login} />
			<Route path='/register' component={Register} />
			<Route path='/profile'>
				<Profile dashboard={false}/>
			</Route>
			<Route path='/dashboard'>
				<Profile dashboard={true}/>
			</Route>
			<Route path='/' component={Login} />
			</Switch>
		</BrowserRouter>
		</div>
		);

}

export default App;
ReactDOM.render(<App/>,document.getElementById('index'));