import React from 'react';
import ripple from 'react-toolbox/lib/ripple';

const CustomLink = props => {
	const aProps = Object.assign({}, props);
	delete aProps.theme;
	return (
		<a {...aProps} style={{position: 'relative', display: 'flex'}}>
			{props.children}
		</a>
	);
};

CustomLink.propTypes = {
	children: React.PropTypes.array
};

const RippleLink = ripple({spread: 3, centered: true})(CustomLink);
export default RippleLink;
