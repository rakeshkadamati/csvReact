import React from 'react';
import {render} from 'react-dom';

import InputCSV from './InputCSV.jsx';
import TableCSV from './TableCSV.jsx';

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {uploaded: false, lastUploaded: "", colNames:[], records:[]};
		this.handleUpload = this.handleUpload.bind(this);
	}
	handleUpload(lastUploaded, colNames, records) {
		this.setState({
			uploaded: true,
			lastUploaded: lastUploaded,
			colNames: colNames,
			records: records,
		});
	}
	displayTable() {
		if(this.state.uploaded) {
			return (
				<div id="tablePreview">
					<div className="alert alert-info" role="alert">
					Preview <a href={'csv/'+this.state.lastUploaded}>{this.state.lastUploaded}</a> ({this.state.records.length} lines).
					</div>
					<TableCSV colNames = {this.state.colNames} records={this.state.records}/>
				</div>
				);
		}
	}
	render() {
		return (
			<div>
				<div className='container'>
					<h1 className="page-header">Reactive CSV</h1>
					<InputCSV onUpload={this.handleUpload}/>
					<FileList />
				</div>
				{this.displayTable()}
			</div> 
			);
	}
}

class FileList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {fileList: __fileList};
	}
	render() {
		if (this.state.fileList.length > 0)
		return(
			<div id='fileList' className='well'>
			<h4>Recently uploaded:</h4>
				<ul className="list-inline">
				{ this.state.fileList.length > 0 &&
					(
						this.state.fileList.map((f, i) => 
						<li key={i}><a href={'csv/'+f}>{f}</a></li>
						)
					)
				}
				</ul>
			</div>
		);
		else return<div/>;
	}
}

render(<Index/>, document.getElementById('homeIndex'));