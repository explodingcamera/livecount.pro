import React, {PropTypes} from 'react';
import Grid from 'components/grid';
import Drawer from 'components/livecountDialog';
import Snackbar from 'react-toolbox/lib/snackbar';
import {inject, observer} from 'mobx-react';

@inject('uiStore') @observer class Home extends React.Component {
	render() {
		return (
			<div>
				<Snackbar
					active={this.props.uiStore.errorActive}
					label={this.props.uiStore.errorMessage}
					type="cancel"
					/>
				<Drawer/>
				<Grid/>
			</div>
		);
	}
}

Home.propTypes = {
	uiStore: PropTypes.object
};

export default Home;
