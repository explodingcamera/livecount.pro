import React from 'react';

import {apiBase} from './../../constants';

export default function update(item) {
	switch (item.type) {
		case 'yt-subs': {
			item.icon = <span className={`socicon-youtube`}/>;
			item.api = `${apiBase}/youtube/subscribers/${item.userId}`;
			item.options.time = item.options.time || 2000;
			break;
		}
		case 'yt-views': {
			item.icon = <i className={`material-icons`}>remove_red_eye</i>;
			item.api = `${apiBase}/youtube/views/${item.userId}`;
			item.options.time = item.options.time || 10 * 60 * 1000;
			break;
		}
		case 'twitter-followers': {
			item.icon = <span className={`socicon-twitter`}/>;
			item.api = `${apiBase}/twitter/followers/${item.username}`;
			item.options.time = item.options.time || 4000;
			break;
		}
		case 'twitch-followers': {
			item.icon = <span className={`socicon-twitch`}/>;
			item.api = `${apiBase}/twitch/followers/${item.userId}`;
			item.options.time = item.options.time || 3000;
			break;
		}
		case 'instagram-followers': {
			item.icon = <span className={`socicon-instagram`}/>;
			item.api = `${apiBase}/instagram/followers/${item.userId}`;
			item.options.time = item.options.time || 2000;
			break;
		}
		default: {
			item.api = `${apiBase}/youtube/subscribers/${item.userId}`;
			item.options.time = item.options.time || 2000;
			break;
		}
	}
	return item;
}
