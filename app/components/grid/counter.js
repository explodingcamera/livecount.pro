import React from 'react';
import {autorun} from 'mobx';
import {observer} from 'mobx-react';
import Odometer from 'odometer/odometer';
import Slider from 'react-toolbox/lib/slider';
import Link from 'components/ripple';

import css from 'css/grid.css';

@observer class GridItem extends React.Component {
	componentDidMount() {
		this.odometer = new Odometer({
			el: this.counter,
			value: 0,
			format: '(,ddd).dd',
			theme: 'default'
		});
		this.odometer.render();
		this.odometer.update(this.props.item.number);
		autorun(() => {
			this.odometer.update(this.props.item.number);
		});
		if (this.props.demo) {
			setInterval(() => {
				this.props.item.number = Math.random() * 1000;
			}, 2000);
		}
	}
	componentWillUnmount() {

	}
	setCounterRef = ref => {
		this.counter = ref;
	}
	render() {
		const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		const {item} = this.props;
		return (
			<div className={`${mobile ? '' : 'draggable'} ${css.gridItem} ${this.props.className || ''}`} style={{fontSize: `${item.fontSize}%`}}>
				{mobile && (
					<i className={`material-icons ${css.dragIcon} draggable`}>reorder</i>
				)}
				{item.options.enablePicture && (
					<img src={item.profileImage}/>
				)}
				{item.options.enableLink && (
				<Link
					className={`nonDraggable ${css.link}`}
					href={this.props.item.url}
					target="_blank"
					rel="noopener noreferrer"
					>
					<h1>
						<span className={css.icon}>
							{item.icon}
						</span>
						{item.username}
					</h1>
				</Link>
					)}
				{this.props.children}
				<div
					className={css.counter}
					ref={this.setCounterRef}
					/>
				{item.options.enableSlider && (
				<Slider min={30} max={mobile ? 170 : 400} className={css.slider} value={item.fontSize} onChange={this.props.item.handleChangeFontSize}/>
					)}
			</div>
		);
	}
}

GridItem.propTypes = {
	demo: React.PropTypes.bool,
	item: React.PropTypes.object,
	children: React.PropTypes.element,
	className: React.PropTypes.string
};

export default GridItem;
