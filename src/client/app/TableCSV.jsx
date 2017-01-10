import React from 'react';

import {Table, Column, Cell} from 'fixed-data-table';

/**
 * Computes and return the width of the given text of given font in pixels.
 */
function getTextWidth(text, font) {
	var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width*2.5;
}

class TextCell extends React.Component {
	render() {
		const {rowIndex, field, data, ...props} = this.props;
		return (
			<Cell {...props}> {data[rowIndex][field]} </Cell>
			);
		}
	}

class TableCSV extends React.Component {
	constructor(props) {
		super(props);
		var widths = this.returnColWidths(this.props.colNames);
		var totalSum=0;
		var screenAvailWidth = parseFloat(screen.availWidth);
		Object.keys(widths).forEach((w) => {
			totalSum+=widths[w];
		})
		//if sum of all widths not greater than screen size then ratio all widths to available space 
		if (totalSum < screenAvailWidth) {
			Object.keys(widths).forEach((w) => {
			widths[w]= (widths[w]/totalSum)*screenAvailWidth;
		})
	}
		this.state={
			colNames:this.props.colNames, 
			records:this.props.records, 
			colWidths: widths
		};
		this._onColumnResizeEndCallback = this._onColumnResizeEndCallback.bind(this);
	}
	returnColWidths(colNames) {
		if (colNames.length > 0) {
			var widths={};
			colNames.forEach((x) => {
				widths[x]= getTextWidth(x, "Helvetica");
			})
			return widths;
		}
	}
	componentWillMount() {
	}
	componentWillReceiveProps(nextProps) {
		this.setState({colNames: nextProps.colNames, 
			records: nextProps.records, 
			colWidths: this.returnColWidths(nextProps.colNames)});
	}
	_onColumnResizeEndCallback(newColumnWidth, columnKey) {
		this.setState(({colWidths}) => ({
			colWidths: {
				...colWidths,
				[columnKey]: newColumnWidth,
			}
		}));
	}

	renderRecords() {
		var {colNames, records, colWidths} = this.state;
		console.log(colWidths);
		if (records.length > 0) {
			return colNames.map((x, i) => {
				return (
					<Column
					columnKey={x}
					key={i}z
					header={<Cell><span>{x}</span></Cell>}
					cell={<TextCell data={records} field={x}/>}
					width={colWidths[x] || 50}
					isResizable={true}
					/>
				);
			});
		}
	}
	render() {
		return (
			<Table
			rowsCount={this.state.records.length}
			rowHeight={50}
			headerHeight={50}
			width={screen.availWidth}
			height={500}
			isColumnResizing={false}
			onColumnResizeEndCallback={this._onColumnResizeEndCallback}
			isColumnResizing={false}
			{...this.props}>
				{this.renderRecords()}
			</Table>
			);
	}
}

export default TableCSV;