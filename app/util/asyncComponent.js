// Modified version of https://gist.github.com/acdlite/a68433004f9d6b4cbc83b5cc3990c194 by acdlite

import React from 'react';

export default function asyncComponent(getComponent) {
	return class AsyncComponent extends React.Component {
		static Component = null;
		state = {Component: AsyncComponent.Component};

		componentWillMount() {
			if (!this.state.Component) {
				getComponent.then(module => {
					const Component = module.default;
					AsyncComponent.Component = Component;
					this.setState({Component});
				});
			}
		}

		render() {
			const spinner = <div> {/* Spinner */} </div>;
			const {Component} = this.state;
			if (Component) {
				return <Component {...this.props}/>;
			}
			return spinner;
		}
  };
}
