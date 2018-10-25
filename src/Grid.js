import React from 'react';
import Paper from '@material-ui/core/Paper';
import {
    SortingState,
    IntegratedSorting,
    FilteringState,
    IntegratedFiltering,
    DataTypeProvider
  } from '@devexpress/dx-react-grid';
import { 
    Grid, 
    Table, 
    VirtualTable,
    TableHeaderRow,
    TableFilterRow,
    TableColumnReordering,
    TableColumnResizing
    } from '@devexpress/dx-react-grid-material-ui';
import axios from 'axios';

const getColor = (status) => { //console.log('status = ',status);
    if(status === 'Fraflytter') return 'orange';
    else if(status === 'Tilflytter') return 'green';
    else if(status === 'Nystartet') return 'blue';
    else if(status === 'Ophørt') return 'red';
    else return 'blue';
};

const StatusFormatter = ({value}) =>{
    let color = getColor(value);
    return (
        <b style={{ color: color}}>
            {value}
        </b>
    );
}

const StatusTypeProvider = props => (
    <DataTypeProvider 
        formatterComponent={StatusFormatter}
        {...props}
    />
);
const HighlightedCell = ({ value, style }) => {
    let color = getColor(value);
   return (<Table.Cell
        style={{
            backgroundColor: color, 
        }}
    >

    </Table.Cell>);
};

const getRowId = row => {
  //  console.log('row id => ',row['cvr-nummer']);
    return row['keyIndex'];

};

const Cell = (props) => {
    const { column } = props; //console.log('column name == ', column.name);
    if(column.name === 'status'){
        return <HighlightedCell {...props} />;
    }
    return <Table.Cell {...props} />;
};

class GridData extends React.PureComponent{
    constructor(props){
        super(props);
        this.state = {
            rows: [],
            data: [],
            sorting: [{ columnName: 'hovedbranche', direction: 'desc' }],
            statusColumns: ['status']
        };
        this.changeSorting = sorting => this.setState({ sorting });
    }

    componentDidMount(){
       
    }

    componentDidUpdate(){

    }




    render(){

        const cols = [
            {name:'status',title:'Status'},
            {name:'cvr-nummer',title:'CVR nummer'},
            {name:'p-nummer',title:'P nummer'},
            {name:'hovedbranche',title:'Branche'},
            {name:'navn',title:'Virksomhedsnavn'},
            {name:'fuldt ansvarlige deltagere',title:'Kontaktperson'},
            {name:'kommunekode',title:'Kommunekode'},
            {name:'vejnavn',title:'Vejnavn'},
            {name:'husnummer',title:'Husnummer'},
            {name:'postnummer',title:'Postnummer'},
            {name:'postdistrikt',title:'By'},
            {name:'emailadresse',title:'Email'},
            {name:'indlæst dato',title:'Indlæst dato'},
        ];
        
        const defaultColumnWidths = [
            {columnName:'status',width:120},
            {columnName:'cvr-nummer',width:120},
            {columnName:'p-nummer',width:120},
            {columnName:'hovedbranche',width:150},
            {columnName:'navn',width:150},
            {columnName:'fuldt ansvarlige deltagere',width:120},
            {columnName:'kommunekode',width:120},
            {columnName:'vejnavn',width:120},
            {columnName:'husnummer',width:120},
            {columnName:'postnummer',width:120},
            {columnName:'postdistrikt',width:120},
            {columnName:'emailadresse',width:120},
            {columnName:'indlæst dato',width:120}
        ];


        const { sorting, statusColumns } = this.state;
        const rows = this.props.data.map((feature, index) => {
            feature.properties['keyIndex'] = index;
            return feature.properties;
        
        });
        
       // console.log(rows);
      return(
          <Paper style={{height: '600px'}}>
            <Grid
                rows={rows}
                columns={cols}
                getRowId={getRowId}
                style={{ height: '100%'}}
            >
                <FilteringState defaultFilters={[]} />
                <IntegratedFiltering />
                <SortingState defaultSorting={[{ columnName: 'status', direction: 'desc' }]} />
                <IntegratedSorting />
                <StatusTypeProvider 
                    for={statusColumns}
                />
                <VirtualTable
                    height="auto"
                />
                <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
                <TableHeaderRow showSortingControls />
                <TableFilterRow />
            </Grid>

          </Paper>

      )   
    }
}

export default GridData