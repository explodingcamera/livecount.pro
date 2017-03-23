import React from 'react';
import {observer} from 'mobx-react';

import Counter from './counter';
import {apiBase} from './../../constants';

@observer class GridItem extends React.Component {
	componentWillMount() {
		const {item} = this.props;
		switch (item.type) {
			case 'yt-sub': {
				item.icon = 'socicon-youtube';
				item.api = `${apiBase}/youtube/subscribers/${item.userId}`;
				item.options.time = item.options.time || 2000;
				break;
			}
			case 'yt-views': {
				item.icon = 'socicon-youtube';
				item.api = `${apiBase}/youtube/views/${item.userId}`;
				item.options.time = item.options.time || 10 * 60 * 1000;
				break;
			}
			case 'twitter-followers': {
				item.icon = 'socicon-twitter';
				item.api = `${apiBase}/twitter/followers/${item.username}`;
				item.options.time = item.options.time || 4000;
				break;
			}
			case 'twitch-followers': {
				item.icon = 'socicon-twitch';
				item.api = `${apiBase}/twitch/followers/${item.userId}`;
				item.options.time = item.options.time || 3000;
				break;
			}
			default: {
				item.api = `${apiBase}/youtube/subscribers/${item.userId}`;
				item.options.time = item.options.time || 2000;
				break;
			}
		}

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
	item: React.PropTypes.object
};

export default GridItem;
