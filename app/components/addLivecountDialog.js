import React from 'react';
import {observer, inject} from 'mobx-react';
import Dialog from 'react-toolbox/lib/dialog';
import Dropdown from 'react-toolbox/lib/dropdown';
import Input from 'react-toolbox/lib/input';
import Switch from 'react-toolbox/lib/switch';
import Button from 'react-toolbox/lib/button';

import customDopdownItem from './customDropdownItem';
import css from 'css/dialog.css';
import {apiBase} from './../constants';

@inject('uiStore') @inject('gridStore') @observer class App extends React.Component {
	handleAddGridItem = async () => {
		const item = this.props.uiStore.item;

		if (item.id) {
			await this.props.gridStore.editGridItem(this.props.uiStore.item);
		}	else {
			await this.props.gridStore.addGridItem(this.props.uiStore.item);
		}

		this.props.uiStore.handleToggleDialog();
	}
	handleSearch = async () => {
		const url = `${apiBase}/youtube/search/user/${this.props.uiStore.item.username}`;
		const response = await fetch(url, {method: 'get'});
		const data = await response.json();
		const dropdown = data.map(channel => {
			return {
				value: channel.channelId,
				label: channel.title,
				img: channel.thumbnails.default.url
			};
		});

		this.props.uiStore.item.userId = dropdown[0].value;
		this.props.uiStore.searchResults = dropdown;
	}

	render() {
		const {uiStore} = this.props;
		const actions = [
      {label: 'Cancel', onClick: uiStore.handleToggleDialog},
			{label: this.props.uiStore.item.id ? 'Edit' : 'Add', onClick: this.handleAddGridItem}
		];
		const dropdownType = [
      {value: 'yt-subs', label: 'Youtube Subscribers'},
      {value: 'yt-views', label: 'YouTube Views'},
      {value: 'twitter-followers', label: 'Twitter Followers'},
      {value: 'twitch-followers', label: 'Twitch Followers'},
			{value: 'instagram-followers', label: 'Instagram Followers'}
		];
		let form;

		const searchButtonDisabled = (
			uiStore.item.username === undefined || uiStore.item.username === '' ||
			/https:\/\/|http:\/\|youtube.com|m.youtube.com|\/c\/|\/user\/|\/channel\//g.test(uiStore.item.username) ||
			(uiStore.item.username.indexOf('UC') === 0 && uiStore.item.username.length === 24)
		);

		const YouTubeUserSearch = (
			<div>
				<div className={css.searchWrapper}>
					<Input type="text" label="Username / ChannelId / URL" name="username" value={uiStore.item.username || ''} onChange={uiStore.handleValueChange} onSubmit={searchButtonDisabled ? undefined : this.handleSearch}/>
					<Button label={'Search'} onClick={this.handleSearch} disabled={searchButtonDisabled} flat/>
				</div>
				{uiStore.searchResults ? (
					<div className={css.searchDropdown}>
						<Dropdown
							auto={false}
							source={uiStore.searchResults.peek()}
							onChange={uiStore.handleValueChange}
							value={uiStore.item.userId}
							template={customDopdownItem}
							name={'userId'}
							/>
					</div>
				) : (
					''
				)}
			</div>
		);

		switch (uiStore.item.selectedInput) {
			case 'yt-subs': {
				form = (
					<div>
						{YouTubeUserSearch}
						<Switch name="options.enablePicture" label="Display profile picture" checked={uiStore.item.options.enablePicture} onChange={uiStore.handleValueChange}/>
					</div>
				);
				break;
			}
			default: {
				form = (
					<div>
						<Input type="text" label="Username / URL" name="username" value={uiStore.item.username || ''} onChange={uiStore.handleValueChange} onSubmit={this.handleAddGridItem}/>
						<Switch name="options.enablePicture" label="Display profile picture" checked={uiStore.item.options.enablePicture} onChange={uiStore.handleValueChange}/>
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
				title={`${this.props.uiStore.item.id ? 'Edit' : 'Add'} Livecounter`}
				>
				<Dropdown
					auto
					onChange={uiStore.handleValueChange}
					source={dropdownType}
					value={uiStore.item.type}
					name={'type'}
					/>
				{form}
			</Dialog>
		);
	}
}

App.propTypes = {
	gridStore: React.PropTypes.object, // eslint-disable-line react/no-unused-prop-types
	uiStore: React.PropTypes.object
};

export default App;
