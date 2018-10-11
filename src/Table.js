import React from 'react';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import IconButton from '@material-ui/core/IconButton';


class Table extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: {}
        }
    }

    componentDidMount(){
        axios.get("test.json")
            .then(res =>{
                that.setState((preveState) => ({data: res.data}));
            });
    }

    render(){
        

    }
}

/* 

    TODO: 
    
    1. finish table component.
    2. move data into a common store, so that ajax requests are done in the parent component.
    3. finish datepicker and kommune dropdown
    4. Add filters to the data: postnumber, branch, status .... 
*/