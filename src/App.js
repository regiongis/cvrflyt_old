import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
//import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import 'moment/locale/da';
import Select from '@material-ui/core/Select';
import Menuitem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons';
import CloudDownload from '@material-ui/icons/CloudDownload';
import Map from '@material-ui/icons/Map';
import TableChart from '@material-ui/icons/TableChart';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';
import axios from 'axios';
import {hot} from 'react-hot-loader';
import MapData from './Map.js';
import GridData from './Grid.js';
import './App.css';
import classnames from 'classnames';

moment.locale('da');
const options = [
    { value: 'chocolate', label: 'Chocolate'},
    { value: 'strawberry', label: 'Strawberry'},
    { value: 'vanilla', label: 'Vanilla'}
];

const styles = theme => ({
    root: {
        flexGrow: 1
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 300,
    }
});

//TODO: complete the select  comp!!!

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
            startDate: moment().format(),
            endDate: moment().format(),
            data: {},
            kommuner: [],
            komkode:'165',
            selectedOption: null,
            fraflyttet: true,
            tilflyttet: true,
            ophoert: true,
            nystartet:true
        }

        this.theData = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleChecked = this.handleChecked.bind(this);
    }

    filterData(feature){
        const {data, fraflyttet, tilflyttet, ophoert, nystartet }= this.state;
        const checked = [];
        if(fraflyttet) checked.push('Fraflytter');
        if(tilflyttet) checked.push('Tilflytter');
        if(ophoert) checked.push('Ophørt');
        if(nystartet) checked.push('Nystartet');
        return checked.indexOf(feature.properties.status) > -1;

    }

    handleChecked(event){
        event.persist();
        this.setState((preveState) => ({[event.target.value]: event.target.checked}));
        console.log(event.target.value,' = ', event.target.checked);
    }
    handleSelect(event){ 
        event.persist();
        console.log(event.target.value);
        this.setState((prevState) => ({komkode : event.target.value}));
    }

    componentDidMount(){
        let that = this;
        axios.get("test.json")
            .then(res =>{
                that.setState((preveState) => ({data: res.data.features})); //console.log(res.data);
                this.theData = res.data;
            });

        axios.get("kommuner.json")
            .then(res =>{
                let koms = res.data.features.map(feature => feature.properties);
                this.setState((proevState) => ({kommuner : koms}));
            });
    }

    handleChange(event, value){
        this.setState({ value });
    };

    handleStart(date){ console.log(date.format('YYYY-MM-DD'));
        this.setState({
            startDate: date.format()
        });
    };

    handleEnd(date){ console.log(date.format('YYYY-MM-DD'));
        this.setState({
            endDate: date.format()
        });
    }
   // <DatePicker selected={this.state.startDate} onChange={this.handleStart} locale="da-dk"/>
   // <DatePicker selected={this.state.endDate} onChange={this.handleEnd} locale="da-dk"/>

   /*<Select 
       value={selectedOption}
       onChange={this.handleSelect}
       options={options}
   /> */
    render(){
        const { value, selectedOption, startDate, endDate, kommuner } = this.state;
        const locale = 'da';
        return (
            <div className='app'>
                <div>
                    <AppBar position="static" color="default">
                        <Toolbar>
                            <Grid container spacing={24}>
                                <Grid item xs={4}>
                                    <Typography variant="h6" color="inherit">
                                        CVR Flyttemønster
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <form className={classnames.container} noValidate autoComplete="off">
                                        <TextField 
                                            id="standard-select"
                                            select
                                            label="Kommune"
                                            className={classnames.textField}
                                            value={this.state.komkode}
                                            onChange={this.handleSelect}
                                            SelectProps={{
                                                native: true,
                                                
                                            }}
                                            helperText=""
                                            
                                        >
                                        {kommuner.map(kom =>(
                                            <option key={kom.komkode} value={kom.komkode}>
                                                {kom.komnavn}
                                            </option>
                                        ))}      
                                        </TextField>
                                    </form>
                                </Grid>
                                <Grid item xs={2}>
                                     <MuiPickersUtilsProvider utils={MomentUtils} locale={locale} moment={moment}>
                                         <DatePicker 
                                            value={startDate}
                                            label="Startdato"
                                            format="DD MMM YYYY"
                                            onChange={this.handleStart}
                                         />   
                                     </MuiPickersUtilsProvider>       
                                </Grid>
                                <Grid item xs={2}>
                                     <MuiPickersUtilsProvider utils={MomentUtils}>
                                         <DatePicker 
                                            value={endDate}
                                            label="Slutdato"
                                            format="DD MMM YYYY"
                                            onChange={this.handleEnd}
                                         />   
                                     </MuiPickersUtilsProvider>       
                                </Grid>
                                <Grid item xs={2}>
                                     <IconButton arial-label="csv">
                                       <CloudDownload/>
                                     </IconButton>       
                                </Grid>
                            </Grid>
                        </Toolbar>
                    </AppBar>
                        <Tabs 
                            value={value} 
                            onChange={this.handleChange}
                            centered
                            >
                            <Tab icon={<Map/>}/>
                            <Tab icon={<TableChart/>}/>
                        </Tabs>
                    {value === 0 && <TabContainer><MapData data={this.state.data}/></TabContainer>} 
                    {value === 1 && <TabContainer><GridData/></TabContainer>}
                </div>
                <FormGroup row>
                    <FormControlLabel 
                        control={
                            <Switch
                                checked={this.state.fraflyttet}
                                onChange={this.handleChecked}
                                color="primary"
                                value="Fraflytter"
                            />
                        }
                        label="Fraflyttet"
                    />
                    <FormControlLabel 
                        control={
                            <Switch
                                checked={this.state.tilflyttet}
                                onChange={this.handleChecked}
                                color="primary"
                                value="Tilflytter"
                            />
                        }
                        label="Tilflyttet"
                    />
                    <FormControlLabel 
                        control={
                            <Switch
                                checked={this.state.ophoert}
                                onChange={this.handleChecked}
                                color="primary"
                                value="Ophørt"
                            />
                        }
                        label="Ophørt"
                    />
                    <FormControlLabel 
                        control={
                            <Switch
                                checked={this.state.nystartet}
                                onChange={this.handleChecked}
                                color="primary"
                                value="Nystartet"
                            />
                        }
                        label="Nystartet"
                    />
                </FormGroup>
            </div>
        );
    }
}

export default hot(module)(App);

/*
TODO: 
 1. Implement filters: use switches or dropdown with checkboxes.
 3. use real ajax data
 2. move data in a common store.

 Next => use filterData, til show only checked values
*/