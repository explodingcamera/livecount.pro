import {observable, action} from 'mobx';

class UiStore {
	@observable username = '';
	@observable selectedInput = 'yt-subs';
	@observable dialogActive = false;

	@action handleToggleDialog = () => {
		this.dialogActive = !this.dialogActive;
	}
	@action handleUsernameChange = val => {
		this.username = val;
	}
	@action handleTypeUpdate = val => {
		this.selectedInput = val;
	}
}

const uiStore = new UiStore();
export default uiStore;
export {UiStore};
