import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import axios from 'axios';
import {hot} from 'react-hot-loader';
import Map from './Map.js';
import GridData from './Grid.js';
import './App.css';


function TabContainer(props){
    return (
        <div>
            {props.children}
        </div>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
};

class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            value: 0,
            startDate: moment(),
            endDate: moment(),
            data: {}
        }

        this.theData = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
    }

    componentDidMount(){
        let that = this;
        axios.get("test.json")
            .then(res =>{
                that.setState((preveState) => ({data: res.data})); //console.log(res.data);
                this.theData = res.data;
            });
    }

    handleChange(event, value){
        this.setState({ value });
    };

    handleStart(date){ 
        this.setState({
            startDate: date
        });
    };

    handleEnd(date){
        this.setState({
            endDate: date
        });
    }

    render(){
        const { value } = this.state;
        return (
            <div className='app'>
                <div>
                    <AppBar position="static" color="primary">
                        <Toolbar>
                            <h6>
                                CVR Flyttemønster
                            </h6>
                            <DatePicker selected={this.state.startDate} onChange={this.handleStart} locale="da-dk"/>
                            <DatePicker selected={this.state.endDate} onChange={this.handleEnd} locale="da-dk"/>
                        </Toolbar>
                        <Tabs value={value} onChange={this.handleChange}>
                            <Tab label="Kort"/>
                            <Tab label="Tabel"/>
                        </Tabs>
                    </AppBar>
                    {value === 0 && <TabContainer><Map data={this.state.data}/></TabContainer>} 
                    {value === 1 && <TabContainer><GridData/></TabContainer>}
                </div>
            </div>
        );
    }
}

export default hot(module)(App);