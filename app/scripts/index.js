import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import '../css/base.css';
import Welcome from './welcome';
import PastRaces from './pastraces';
import AddRace from './addrace';
import Archives from './archives'
import Bugs from './bugs';
import Records from './records';
import Race from './race';

ReactDOM.render((
	<Router history={browserHistory}>
		<Route path="/" component={Welcome} />
		<Route path="/pastraces" component={PastRaces} />
		<Route path="/analysis" component={AddRace} />
		<Route path="/archives" component={Archives} />
		<Route path="/records" component={Records} />
		<Route path="/bugs" component={Bugs} />
		<Route path="/race" component={Race} />

	</Router>
),
	document.getElementById('content')
);
