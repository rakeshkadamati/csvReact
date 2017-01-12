import React from 'react';
import {render} from 'react-dom';

import TableCSV from './TableCSV.jsx';

class FullTable extends React.Component {
    constructor(props) {
        super(props);
        console.log(__csvname);
    }
    componentDidMount() {
        $.get('/api/'+__csvname, (data) => {
            this.setState ({
                colNames: Object.keys(data[0]),
                records: data
            });
        })
    }
    render() {
        if (this.state) {
            return (
                <div>
                <span>{__csvname} ({this.state.records.length} lines)</span>
					<TableCSV colNames = {this.state.colNames} records={this.state.records}/>
				</div>
            );
        } else return <span>Retrieving records...</span>
    }
}

render(<FullTable />, document.getElementById('fullTable'));