import React from 'react';

import TableCSV from './TableCSV.jsx';

class InputCSV extends React.Component {
  constructor(props) {
    super(props);
    this.state={uploading: false};
    this.handleChange = this.handleChange.bind(this);
    this.parseCSV = this.parseCSV.bind(this);
  }
  handleChange(event) {
    $('#target').submit();
    var file = event.target.files[0];
    var fileNode = document.createTextNode(file.name);
    document.getElementById('fileSelectName').innerText = fileNode.textContent;
    //parse file into lines
	  this.parseCSV(file);
  }
  parseCSV(file) {
  	Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        var data = results.data;
        var cols = Object.keys(data[0])

        var numCols = cols.length;
        var numRows = data.length;
        var records = [];
        for (var k = 0; k < numRows; k++)  {
          records = records.concat(data[k]);
        }
        this.props.onUpload(file.name, cols, records);
      }
    });
  }
  render() {
    return (
      <div>
        <form id="target" method = "post" encType="multipart/form-data">
        <label>
          <div>
            <span style={{fontSize: '2.0em'}} className="glyphicon glyphicon-folder-open"></span>
            <span id="fileSelectName" style={{paddingLeft: '0.7em', fontSize: '1.3em'}}>Upload CSV...</span>
          </div>
          <input id="csvFile" type="file" name="csv" onChange={this.handleChange} accept="text/cvs" style={{display:'none'}}/>
        </label>
        </form>
        {this.state.uploading && 
          (<div className="progress">
          <div className="progress-bar progress-bar-striped active" role="progressbar" 
          aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style={{width: "45%"}}>
          <span className="sr-only">45% Complete</span>
          </div>
        </div>)}
      </div>
      );
  }
}

export default InputCSV;