import React from 'react';
import {observer, inject} from 'mobx-react';
import Ripple from 'components/ripple';

import css from 'css/appComponent.css';

@inject('uiStore') @observer class App extends React.Component {
	render() {
		const {uiStore} = this.props;
		return (
			<div className={css.main}>
				<div className={css.appBar}>
					<h1>livecount.pro beta</h1>
					<Ripple>
						<i onClick={uiStore.handleToggleDialog} className={'material-icons'}>{'add'}</i>
					</Ripple>
				</div>
				{this.props.children}
			</div>
		);
	}
}

App.propTypes = {
	children: React.PropTypes.element,
	uiStore: React.PropTypes.object
};

export default App;
