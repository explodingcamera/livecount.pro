import React from 'react';
import {observer, inject} from 'mobx-react';
import Dialog from 'react-toolbox/lib/dialog';
import Dropdown from 'react-toolbox/lib/dropdown';
import Input from 'react-toolbox/lib/input';

import css from 'css/dialog.css';

@inject('uiStore') @inject('gridStore') @observer class App extends React.Component {
	render() {
		const {uiStore, gridStore} = this.props;
		const actions = [
      {label: 'Cancel', onClick: uiStore.handleToggleDialog},
			{label: 'Add', onClick: () => {
				gridStore.addGridItem({type: uiStore.selectedInput, username: uiStore.username});
				uiStore.handleToggleDialog();
			}}
		];
		const type = [
      {value: 'yt-subs', label: 'Youtube Subscribers'},
      {value: 'yt-views', label: 'YouTube Views'},
      {value: 'twitter-followers', label: 'Twitter Followers'},
      {value: 'twitch-followers', label: 'Twitch Followers'}
		];
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
					onChange={uiStore.handleTypeUpdate}
					source={type}
					value={uiStore.selectedInput}
					/>
				<Input type="text" label="Username" name="username" value={uiStore.username} onChange={uiStore.handleUsernameChange}/>
			</Dialog>
		);
	}
}

App.propTypes = {
	gridStore: React.PropTypes.object,
	uiStore: React.PropTypes.object
};

export default App;
