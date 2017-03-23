import React from 'react';
import {observer, inject} from 'mobx-react';
import Dialog from 'react-toolbox/lib/dialog';
import Dropdown from 'react-toolbox/lib/dropdown';
import Input from 'react-toolbox/lib/input';
import Switch from 'react-toolbox/lib/switch';
import Button from 'react-toolbox/lib/button';

import css from 'css/dialog.css';
import {apiBase} from './../constants';

@inject('uiStore') @inject('gridStore') @observer class App extends React.Component {
	handleAddGridItem = () => {
		console.log(1);
		this.props.gridStore.addGridItem({type: this.props.uiStore.options.selectedInput, username: this.props.uiStore.options.username, userId: this.props.uiStore.options.userId});
		this.props.uiStore.handleToggleDialog();
	}
	handleSearch = async () => {
		const url = `${apiBase}/youtube/search/user/${this.props.uiStore.options.username}`;
		const response = await fetch(url, {method: 'get'});
		const data = await response.json();
		const dropdown = data.map(channel => {
			return {
				value: channel.channelId,
				label: channel.title,
				img: channel.thumbnails.default.url
			};
		});

		this.props.uiStore.options.userId = dropdown[0].value;
		this.props.uiStore.searchResults = dropdown;
	}

	customDopdownItem(item) {
		const containerStyle = {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center'
		};

		const imageStyle = {
			display: 'flex',
			width: '32px',
			height: '32px',
			flexGrow: 0,
			marginRight: '8px',
			backgroundColor: '#ccc'
		};

		const contentStyle = {
			display: 'flex',
			flexDirection: 'column',
			flexGrow: 2
		};

		return (
			<div style={containerStyle}>
				<img src={item.img} style={imageStyle}/>
				<span style={contentStyle}>{item.label}</span>
			</div>
		);
	}

	render() {
		const {uiStore} = this.props;
		const actions = [
      {label: 'Cancel', onClick: uiStore.handleToggleDialog},
			{label: 'Add', onClick: this.handleAddGridItem}
		];
		const dropdownType = [
      {value: 'yt-subs', label: 'Youtube Subscribers'},
      {value: 'yt-views', label: 'YouTube Views'},
      {value: 'twitter-followers', label: 'Twitter Followers'},
      {value: 'twitch-followers', label: 'Twitch Followers'}
		];
		let form;

		const searchButtonDisabled = (
			uiStore.options.username === '' ||
			/https:\/\/|http:\/\|youtube.com|m.youtube.com|\/c\/|\/user\/|\/channel\//g.test(uiStore.options.username) ||
			(uiStore.options.username.indexOf('UC') === 0 && uiStore.options.username.length === 24)
		);

		const YouTubeUserSearch = (
			<div>
				<div className={css.searchWrapper}>
					<Input type="text" label="Username / ChannelId / URL" name="username" value={uiStore.options.username} onChange={uiStore.handleValueChange} onSubmit={searchButtonDisabled ? undefined : this.handleSearch}/>
					<Button label={'Search'} onClick={this.handleSearch} disabled={searchButtonDisabled} flat/>
				</div>
				{uiStore.searchResults ? (
					<div className={css.searchDropdown}>
						<Dropdown
							auto={false}
							source={uiStore.searchResults.peek()}
							onChange={uiStore.handleValueChange}
							value={uiStore.options.userId}
							template={this.customDopdownItem}
							name={'userId'}
							/>
					</div>
				) : (
					''
				)}
			</div>
		);

		switch (uiStore.options.selectedInput) {
			case 'yt-subs': {
				form = (
					<div>
						{YouTubeUserSearch}
						<Switch name="enablePicture" label="Display profile picture" checked={uiStore.options.enablePicture} onChange={uiStore.handleValueChange}/>
					</div>
				);
				break;
			}
			default: {
				form = (
					<div>
						<Input type="text" label="Username / URL" name="username" value={uiStore.options.username} onChange={uiStore.handleValueChange} onSubmit={this.handleAddGridItem}/>
						<Switch name="enablePicture" label="Display profile picture" checked={uiStore.options.enablePicture} onChange={uiStore.handleValueChange}/>
					</div>
				);
			}
		}
		return (
			<Dialog
				className={css.dialog}
				actions={actions}
				active={uiStore.dialogActive}
				onEscKeyDown={uiStore.handleToggleDialog}
				onOverlayClick={uiStore.handleToggleDialog}
				title="Add Livecounter"
				>
				<Dropdown
					auto
					onChange={uiStore.handleValueChange}
					source={dropdownType}
					value={uiStore.options.selectedInput}
					name={'selectedInput'}
					/>
				{form}
			</Dialog>
		);
	}
}

App.propTypes = {
	gridStore: React.PropTypes.object,
	uiStore: React.PropTypes.object
};

export default App;
