import React from 'react';
import Paper from '@material-ui/core/Paper';
import {
    SortingState,
    IntegratedSorting,
    FilteringState,
    IntegratedFiltering
  } from '@devexpress/dx-react-grid';
import { 
    Grid, 
    Table, 
    TableHeaderRow,
    TableFilterRow,
    TableColumnReordering,
    TableColumnResizing
    } from '@devexpress/dx-react-grid-material-ui';
import axios from 'axios';


class GridData extends React.PureComponent{
    constructor(props){
        super(props);
        this.state = {
            rows: [],
            sorting: [{ columnName: 'hovedbranche', direction: 'desc' }]
        };
        this.changeSorting = sorting => this.setState({ sorting });
    }

    componentDidMount(){
        axios.get("test.json")
            .then(res =>{
                this.setState({rows : res.data.features.map(feature => feature.properties)});
            });
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


        const { rows, sorting } = this.state;
      return(
          <Paper>
            <Grid
                rows={rows}
                columns={cols}
            >
                <FilteringState defaultFilters={[]} />
                <IntegratedFiltering />
                <SortingState defaultSorting={[{ columnName: 'status', direction: 'desc' }]} />
                <IntegratedSorting />
                <Table/>
                <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
                <TableHeaderRow showSortingControls />
                <TableFilterRow />
            </Grid>

          </Paper>

      )   
    }
}

export default GridData