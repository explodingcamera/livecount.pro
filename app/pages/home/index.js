import React from 'react';
import Grid from 'components/grid';
import Drawer from 'components/livecountDialog';

export default class Home extends React.Component {
	render() {
		return (
			<div>
				<Drawer/>
				<Grid/>
			</div>
		);
	}
}
Home.propTypes = {
};
