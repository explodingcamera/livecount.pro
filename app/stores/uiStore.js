import {observable, action} from 'mobx';

const defaultOptions = {
	userId: null,
	username: '',
	enablePicture: true,
	selectedInput: 'yt-subs'
};

class UiStore {
	@observable options = defaultOptions;
	@observable dialogActive = false;
	@observable disableContextMenu = false;
	@observable searchResults;

	@action handleToggleDialog = () => {
		this.dialogActive = !this.dialogActive;
		this.options = defaultOptions;
		this.searchResults = null;
	}

	@action handleValueChange = (value, event) => {
		this.options[event.target.name] = value;
	}
}

const uiStore = new UiStore();
export default uiStore;
export {UiStore};
