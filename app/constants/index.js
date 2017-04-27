const apiBase = process.env.NODE_ENV === 'production' ? 'https://explodingcamera.xyz/api/v1' : 'http://localhost:3000/api/v1';

const dropdownTypes = [
	{value: 'yt-subs', label: 'Youtube Subscribers'},
	{value: 'yt-views', label: 'YouTube Views'},
	{value: 'twitter-followers', label: 'Twitter Followers'},
	{value: 'twitch-followers', label: 'Twitch Followers'},
	{value: 'instagram-followers', label: 'Instagram Followers'}
];

const defaultOptions = {
	time: 2000,
	enableLink: true,
	enablePicture: true,
	enableSlider: true,
	draggable: true
};

const socialUrlRegex = /http:\/\/|https:\/\/|m.youtube.com|youtube.com|twitter.com|twitch.tv|\/c\/|\/user\/|\/channel\//g;

export {
	apiBase,
	dropdownTypes,
	defaultOptions,
	socialUrlRegex
};
