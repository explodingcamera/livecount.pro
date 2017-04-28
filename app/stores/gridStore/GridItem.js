import {observable, action, autorun} from 'mobx';
import {persist} from 'mobx-persist';

import {defaultOptions} from './../../constants';
import getUser from './getUser';
import pageWidth from 'util/pageWidth';

import updateItem from './updateItem';

export default class GridItem {
	@observable fontSize;
	@observable icon;

	@persist @observable _fontLg = 50;
	@persist @observable _fontSm = 40;

	@persist @observable id;
	@persist @observable type;
	@persist @observable username;
	@persist @observable userId;
	@persist @observable url;
	@persist @observable number = 0;
	@persist @observable profileImage;
	@persist('object') @observable options;

	// ACTIONS
	@action('handleChangeFontSize') handleChangeFontSize = val => {
		if (this.pageWidth > 1000) {
			this._fontLg = val;
		} else {
			this._fontSm = val;
		}
	}

	setFontSize = () => {
		this.fontSize = this.pageWidth > 1000 ?
		this._fontLg			:
		this._fontSm;
	}

	// NORMAL FUNCTIONS
	constructor(options) {
		Object.assign(this, options);

		this.pageWidth = pageWidth;
		this.setFontSize();
		autorun(this.setFontSize);

		if (this.options) {
			Object.assign(this, updateItem(this));
		}
	}

	async init() {
		const user = await getUser(this);
		if (user.error) {
			return Promise.reject(user.error);
		}
		Object.assign(this, user);
		Object.assign(this.options, {
			...defaultOptions,
			...this.options
		});
		Object.assign(this, updateItem(this));
	}

	async edit(args) {
		const user = await getUser(args);
		if (user.error) {
			return Promise.reject(user.error);
		}
		Object.assign(this, args, user);
		Object.assign(this.options, {
			...defaultOptions,
			...this.options
		});
		Object.assign(this, updateItem(this));
	}

	updateItem() {
		Object.assign(this, updateItem(this));
	}
}
