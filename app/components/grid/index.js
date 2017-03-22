import {Responsive as ResponsiveGridLayout, WidthProvider as widthProvider} from 'react-grid-layout';
import React from 'react';
import {observer, inject} from 'mobx-react';
import {ContextMenuTrigger} from 'react-contextmenu/es6';

import DynamicGridMenu from 'components/dynamicGridMenu';
import css from 'css/grid.css';
import GenericGridItem from './genericGridItem';

const GridLayout = widthProvider(ResponsiveGridLayout);

@inject('uiStore') @inject('gridStore') @observer class App extends React.Component {
	onCollect = props => props;
	handleItemClick = (...args) => {
		const opts = args[1];
		switch (opts.action) {
			case 'REMOVE_ITEM': {
				this.props.gridStore.removeGridItem(opts.itemId);
				break;
			}
			case 'ADD_ITEM': {
				this.props.uiStore.handleToggleDialog();
				break;
			}
			default:

		}
	}
	render() {
		const {gridStore} = this.props;
		const cols = {lg: 6, sm: 4};

		return (
			<ContextMenuTrigger
				className={css.main}
				id="grid"
				holdToDisplay={-1}
				collect={this.onCollect}
				onItemClick={this.handleItemClick}
				>
				<DynamicGridMenu id="grid"/>
				{gridStore.enableGrid && (
					<GridLayout
						breakpoints={{lg: 1000, sm: 0}}
						measureBeforeMount
						rowHeight={120}
						className={css.layout}
						onLayoutChange={gridStore.onLayoutChange} // eslint-disable-line react/jsx-handler-names
						layouts={gridStore.layouts}
						cols={cols}
						draggableCancel={'nonDraggable'}
						verticalCompact={false}
						>
						{gridStore.items.map(item => {
							let GridItem;
							switch (item.type) {
								case 'someweirdtype':

									break;
								default: {
									GridItem = <GenericGridItem item={item}/>;
								}
							}
							return (
								<div key={item.id}>
									<ContextMenuTrigger
										style={{height: '100%'}}
										id="grid"
										holdToDisplay={-1}
										collect={this.onCollect}
										onItemClick={this.handleItemClick}
										itemId={item.id}
										gridItem
										>
										{GridItem}
									</ContextMenuTrigger>
								</div>
							);
						})}
					</GridLayout>
				)}
			</ContextMenuTrigger>
		);
	}
}

App.propTypes = {
	gridStore: React.PropTypes.object,
	uiStore: React.PropTypes.object
};

export default App;
