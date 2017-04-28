import React from 'react';
import {observer, inject} from 'mobx-react';
import Dialog from 'react-toolbox/lib/dialog';
import Dropdown from 'react-toolbox/lib/dropdown';
import Input from 'react-toolbox/lib/input';
import Switch from 'react-toolbox/lib/switch';
import Button from 'react-toolbox/lib/button';
import PropTypes from 'prop-types';

import search from './search';
import customDopdownItem from './customDropdownItem';
import css from 'css/dialog.css';
import {dropdownTypes} from './../../constants';

@inject('uiStore') @inject('gridStore') @observer class App extends React.Component {
	handleAddGridItem = async () => {
		const item = this.props.uiStore.item;
		try {
			await this.props.gridStore.addGridItem(item);
			this.props.uiStore.handleToggleDialog();
		} catch (e) {
			console.error(e);
		}
	}
	handleEditGridItem = async () => {
		const item = this.props.uiStore.item;
		try {
			await this.props.gridStore.editGridItem(item);
			this.props.uiStore.handleToggleDialog();
		} catch (e) {
			console.error(e);
		}
	}

	handleSearch = async () => {
		const {username} = this.props.uiStore.item;
		try {
			const {dropdown} = await search.youtube({username});
			this.props.uiStore.searchResults = dropdown;
			this.props.uiStore.item.userId = dropdown[0].value;
		} catch (e) {
			this.props.uiStore.searchResults = [];
		}
	}

	render() {
		const {uiStore} = this.props;
		const actions = [
			{label: 'Cancel', onClick: uiStore.handleToggleDialog}
		];
		actions.push(
			this.props.uiStore.editing ? (
				{label: 'Edit', onClick: this.handleEditGridItem}
			) : (
				{label: 'Add', onClick: this.handleAddGridItem}
			)
		);

		const searchButtonDisabled = (
			uiStore.item.username === undefined || uiStore.item.username === '' ||
			/https:\/\/|http:\/\|youtube.com|m.youtube.com|\/c\/|\/user\/|\/channel\//g.test(uiStore.item.username) ||
			(uiStore.item.username.indexOf('UC') === 0 && uiStore.item.username.length === 24)
		);

		const YouTubeUserSearch = (
			<div>
				<div className={css.searchWrapper}>
					<Input type="text" label="Username / ChannelId / URL" name="username" value={uiStore.item.username || ''} onChange={uiStore.handleValueChange} onSubmit={searchButtonDisabled ? undefined : this.handleSearch}/>
					<Button flat label={'Search'} disabled={searchButtonDisabled} onClick={this.handleSearch}/>
				</div>
				{uiStore.searchResults ? (
					<div className={css.searchDropdown}>
						<Dropdown
							auto={false}
							source={uiStore.searchResults.peek()}
							value={uiStore.item.userId}
							template={customDopdownItem}
							name={'userId'}
							onChange={uiStore.handleValueChange}
							/>
					</div>
				) : (
					''
				)}
			</div>
		);

		let inputItem;
		if (uiStore.item.type.indexOf('yt') === 0) {
			inputItem = (
				<div>
					{YouTubeUserSearch}
					<Switch name="options.enablePicture" label="Display profile picture" checked={uiStore.item.options.enablePicture} onChange={uiStore.handleValueChange}/>
				</div>
			);
		} else {
			inputItem = (
				<div>
					<Input type="text" label="Username / URL" name="username" value={uiStore.item.username || ''} onChange={uiStore.handleValueChange} onSubmit={this.handleAddGridItem}/>
					<Switch name="options.enablePicture" label="Display profile picture" checked={uiStore.item.options.enablePicture} onChange={uiStore.handleValueChange}/>
				</div>
			);
		}
		return (
			<Dialog
				className={css.dialog}
				actions={actions}
				active={uiStore.dialogActive}
				title={`${this.props.uiStore.item.id ? 'Edit' : 'Add'} Livecounter`}
				onEscKeyDown={uiStore.handleToggleDialog}
				onOverlayClick={uiStore.handleToggleDialog}
				>
				<Dropdown
					auto
					name={'type'}
					source={dropdownTypes}
					value={uiStore.item.type}
					onChange={uiStore.handleValueChange}
					/>
				{inputItem}
			</Dialog>
		);
	}
}

App.propTypes = {
	gridStore: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
	uiStore: PropTypes.object
};

export default App;
