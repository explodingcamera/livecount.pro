import {observable} from 'mobx';
import {persist} from 'mobx-persist';
import GridItem from './GridItem';

export default class Grid {
	constructor(...args) {
		Object.assign(this, args);
	}

	@persist @observable name = '';
	@persist @observable index = -1;
	@persist('list', GridItem) @observable items = [];
	@persist('object') @observable layouts;
}
