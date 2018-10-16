import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing.unit * 2,
      overflowX: 'auto',
    },
    table: {
      minWidth: 700,
    },
  });

const colLabels = [
    {name:'status',header:'Status'},
    {name:'cvr-nummer',header:'CVR nummer'},
    {name:'p-nummer',header:'P nummer'},
    {name:'hovedbranche',header:'Branche'},
    {name:'navn',header:'Virksomhedsnavn'},
    {name:'fuldt ansvarlige deltagere',header:'Kontaktperson'},
    {name:'kommunekode',header:'Kommunekode'},
    {name:'vejnavn',header:'Vejnavn'},
    {name:'husnummer',header:'Husnummer'},
    {name:'postnummer',header:'Postnummer'},
    {name:'postdistrikt',header:'By'},
    {name:'emailadresse',header:'Email'},
    {name:'indlæst dato',header:'Indlæst dato'},
];

const columns = colLabels.map(col => col.name);


class TableData extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
            columns: []
        }
    }

    componentDidMount(){
        axios.get("test.json")
            .then(res =>{
               //that.setState((preveState) => ({data: res.data}));
               // console.log(res.data.features);
                console.log(res.data.forGrid);
                let cols = res.data.forStore.map((d) => { 
                    //console.log(d.name);    
                    return d.name;
                }).filter(word => word !== 'geom' && word !== 'startdato');
               // console.log(cols);
                this.setState({columns : cols});
                this.setState({data : res.data.features});
            });
    }

    render(){
       // console.log(this.state.columns);
     ///   return <div>Table data here</div>
        const { classes } = this.props;
        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Status</TableCell>
                            <TableCell>CVR nummer</TableCell>
                            <TableCell>P nummer</TableCell>
                            <TableCell>Branche</TableCell>
                            <TableCell>Virksomhedsnavn</TableCell>
                            <TableCell>Kontaktperson</TableCell>
                            <TableCell>Kommunekode</TableCell>
                            <TableCell>Vejnavn</TableCell>
                            <TableCell>Husnummer</TableCell>
                            <TableCell>Postnummer</TableCell>
                            <TableCell>By</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Indlæst data</TableCell>
                        </TableRow>
                    </TableHead>
                    
                        <TableBody>
                            {
                                this.state.data.map(row =>{
                                    return (
                                        <TableRow>
                                            {
                                                this.state.columns.map(col => {
                                                    return (
                                                        <TableCell>{row.properties[col]}</TableCell>
                                                    );
                                                })
                                            }   
                                        </TableRow>
                                    );
                                })
                            }
                        </TableBody> 
                </Table>
            </Paper>
        );

    }
}
/*
*/

export default withStyles(styles)(TableData);

/* 

    TODO: 
    
    1. finish table component.
    2. move data into a common store, so that ajax requests are done in the parent component.
    3. finish datepicker and kommune dropdown
    4. Add filters to the data: postnumber, branch, status .... 
*/