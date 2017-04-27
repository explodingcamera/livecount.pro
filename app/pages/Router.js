import React from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'mobx-react';
import {BrowserRouter} from 'react-router-dom';

export default class Router extends React.Component {
	render() {
		return (
			<Provider {...this.props.stores}>
				<BrowserRouter>
					{this.props.children}
				</BrowserRouter>
			</Provider>
		);
	}
}

Router.propTypes = {
	stores: PropTypes.object,
	children: PropTypes.element
};
