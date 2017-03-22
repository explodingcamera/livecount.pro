import {observable, action} from 'mobx';

class UiStore {
	@observable options = {
		username: '',
		enablePicture: true,
		selectedInput: 'yt-subs'
	}
	@observable dialogActive = false;
	@observable disableContextMenu = false;

	@action handleToggleDialog = () => {
		this.dialogActive = !this.dialogActive;
		this.username = '';
	}
	@action handleValueChange = (value, event) => {
		this.options[event.target.name] = value;
	}
}

const uiStore = new UiStore();
export default uiStore;
export {UiStore};
