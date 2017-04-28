import {observable, action} from 'mobx';

const defaultItem = {
	type: 'yt-subs',
	userId: null,
	username: '',
	options: {
		enablePicture: true
	}
};

class UiStore {
	@observable editing = false;
	@observable item = {
		type: 'yt-subs',
		userId: null,
		username: '',
		options: {
			enablePicture: true
		}
	};
	@observable dialogActive = false;
	@observable disableContextMenu = false;
	@observable searchResults;

	@action handleToggleDialog = () => {
		if (!this.dialogActive) {
			this.editing = false;
		}
		this.dialogActive = !this.dialogActive;
		this.item = defaultItem;
		this.searchResults = null;
	}

	@action handleToggleEditDialog = opts => {
		this.editing = !this.dialogActive;

		this.dialogActive = !this.dialogActive;
		this.item = {
			...defaultItem,
			options: {
				...defaultItem.options,
				...opts.options
			},
			...opts
		};

		this.searchResults = null;
	}

	@action handleValueChange = (value, event) => {
		const names = event.target.name.split('.');
		if (names.length === 2) {
			this.item[names[0]][names[1]] = value;
		} else {
			this.item[event.target.name] = value;
		}
	}
}

const uiStore = new UiStore();
window.ui = uiStore;
export default uiStore;
export {UiStore};
