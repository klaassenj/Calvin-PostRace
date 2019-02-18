import React from 'react';
import ReactDOM from 'react-dom';
import Remarkable from 'remarkable';
import $ from 'jquery';
import { Router, Route, browserHistory } from 'react-router';

import '../css/base.css';

import CommentBox from './commentBox';
import CommentEdit from './commentEdit';
import { API_URL, POLL_INTERVAL } from './global';

ReactDOM.render((
	<Router history={browserHistory}>
		<Route path="/" component={CommentBox}/>
		<Route path="/:id" component={CommentEdit} />
		
	</Router>
    ),
    document.getElementById('content')
);

// tutorial2.js
