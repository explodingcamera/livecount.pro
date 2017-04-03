import React from 'react';

export default function	customDopdownItem(item) {
	const containerStyle = {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	};

	const imageStyle = {
		display: 'flex',
		width: '32px',
		height: '32px',
		flexGrow: 0,
		marginRight: '8px',
		backgroundColor: '#ccc'
	};

	const contentStyle = {
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 2
	};

	return (
		<div style={containerStyle}>
			<img src={item.img} style={imageStyle}/>
			<span style={contentStyle}>{item.label}</span>
		</div>
	);
}
