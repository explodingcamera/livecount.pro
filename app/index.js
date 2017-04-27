import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import fixGridLayoutResize from 'util/gridLayoutResizeFix';
import removeConsoleError from 'util/removeConsoleError';

import 'css/global.css';

import stores from 'stores';
import Router from 'pages/Router';
import routes from 'pages/routes';

console.clear();

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// This dispatches a resize event when the page height changes
// so react-grid-layout adjusts it's width
fixGridLayoutResize();

window.odometerOptions = {auto: false};

const AppContainer = document.createElement('div');
AppContainer.id = 'app';
document.body.appendChild(AppContainer);

ReactDOM.render(
	<Router stores={stores}>
		{routes}
	</Router>,
	AppContainer
);
