import React from 'react';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';

import Counter from './counter';

@observer class GridItem extends React.Component {
	componentWillMount() {
		this.props.item.updateItem();
		this.disabled = false;
		this.updateCounter();
	}

	updateCounter = async () => {
		const {item} = this.props;

		try {
			if (this.disabled) {
				return;
			}
			const response = await fetch(item.api, {method: 'get'});
			const data = await response.json();
			if (data === 'error') {
				setTimeout(this.updateCounter, item.options.time + 2000);
				return;
			}
			const count = data;
			item.number = count;
			setTimeout(this.updateCounter, item.options.time);
		} catch (e) {
			setTimeout(this.updateCounter, item.options.time + 2000);
		}
	};
	componentWillUnmount() {
		this.disabled = true;
	}
	render() {
		return (
			<Counter item={this.props.item}/>
		);
	}
}

GridItem.propTypes = {
	item: PropTypes.object
};

export default GridItem;
