import React from 'react';
import {observer, inject} from 'mobx-react';
import Dialog from 'react-toolbox/lib/dialog';
import Dropdown from 'react-toolbox/lib/dropdown';
import Input from 'react-toolbox/lib/input';
import Switch from 'react-toolbox/lib/switch';

import css from 'css/dialog.css';

@inject('uiStore') @inject('gridStore') @observer class App extends React.Component {
	handleAddGridItem = () => {
		this.props.gridStore.addGridItem({type: this.props.uiStore.options.selectedInput, username: this.props.uiStore.options.username});
		this.props.uiStore.handleToggleDialog();
	}
	render() {
		const {uiStore} = this.props;
		const actions = [
      {label: 'Cancel', onClick: uiStore.handleToggleDialog},
			{label: 'Add', onClick: this.handleAddGridItem}
		];
		const type = [
      {value: 'yt-subs', label: 'Youtube Subscribers'},
      {value: 'yt-views', label: 'YouTube Views'},
      {value: 'twitter-followers', label: 'Twitter Followers'},
      {value: 'twitch-followers', label: 'Twitch Followers'}
		];
		let form;
		switch (uiStore.options.selectedInput) {
			case 'yt-subs': {
				form = (
					<div>
						<Input type="text" label="Username / ChannelId / URL" name="username" value={uiStore.options.username} onChange={uiStore.handleValueChange} onSubmit={this.handleAddGridItem}/>
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
					source={type}
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
