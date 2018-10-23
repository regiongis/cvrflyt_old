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
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import 'moment/locale/da';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons';
import CloudDownload from '@material-ui/icons/CloudDownload';
import Map from '@material-ui/icons/Map';
import TableChart from '@material-ui/icons/TableChart';
import BarChart from '@material-ui/icons/BarChart';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';
import {hot} from 'react-hot-loader';
import MapData from './Map.js';
import GridData from './Grid.js';
import GraphData from './Graph.js';
import { CSVLink } from 'react-csv';
import './App.css';
import classnames from 'classnames';

moment.locale('da');


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

const theme = createMuiTheme({
    typography: {
      useNextVariants: true,
      suppressDeprecationWarnings: true
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
            startDate: moment().format('Y')+'-'+ moment().format('M') + '-01',
            endDate: moment().format('YYYY-MM-DD'),
            data: [],
            filteredData: [],
            kommuner: [],
            komkode:'165',
            Fraflytter: true,
            Tilflytter: true,
            Ophørt: true,
            Nystartet:true,
            csvData: []
        }

        this.theData = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleChecked = this.handleChecked.bind(this);
    
    }

    getCsv(){
        const csv = this.state.data.map(feature => {
            let s = feature.properties['fuldt ansvarlige deltagere'];
            if(s !== null && s.length > 0){
                feature.properties['fuldt ansvarlige deltagere'] = s.replace(/\"/g,'');
            }
            return feature.properties;
        
        });
        console.log(csv);
        return csv;
    }

    

    filterData(feature){console.log(feature);
        const {data, Fraflytter, Tilflytter, Ophørt, Nystartet }= this.state;
        const checked = [];
        if(Fraflytter) checked.push('Fraflytter');
        if(Tilflytter) checked.push('Tilflytter');
        if(Ophørt) checked.push('Ophørt');
        if(Nystartet) checked.push('Nystartet');
        return checked.indexOf(feature.properties.status) > -1;

    }

    getKommuner(){
        let komUrl = "https://drayton.mapcentia.com/api/v1/sql/ballerup?q=select right(komkode, 3)::int komkode, "
                        +"komnavn from data.kommune group by komkode, komnavn order by komnavn";
        let that = this;
        $.ajax({
            url: komUrl,
            type: 'GET',
            dataType: 'jsonp',
            success: function(res){
                let koms = res.features.map(feature => feature.properties);
                that.setState((preveState) => ({kommuner: koms}));
            }
        });
    }

    getData(komkode,startDate, endDate){ 
        this.setState((preveState) => ({csvData: []}));
        let that = this;
        let dataUrl = "https://drayton.mapcentia.com/api/v1/sql/ballerup?q=SELECT * FROM cvr.flyt_fad("  
                    + komkode + ",'" + startDate + "','" + endDate + "')&srs=4326";
        $.ajax({
            url: dataUrl,
            type: 'GET',
            dataType: 'jsonp',
            success: function(res){
                that.setState((preveState) => ({data: res.features}));
                // console.log(res.features);
                let csv = res.features.map(feature => feature.properties);
                that.setState((prevState) => ({csvData: csv}));
            }
        });
    }

    handleChecked(event){
        event.persist();
        let {data, Fraflytter, Tilflytter, Ophørt, Nystartet }= this.state;
        this.setState((preveState) => ({[event.target.value]: event.target.checked}),() =>{
            Fraflytter = this.state.Fraflytter;
            Tilflytter = this.state.Tilflytter;
            Ophørt = this.state.Ophørt;
            Nystartet  = this.state.Nystartet;
        } );    
               
        console.log(event.target.value,' = ', event.target.checked);
        const _checked = [];
        if(Fraflytter) _checked.push('Fraflytter');
        if(Tilflytter) _checked.push('Tilflytter');
        if(Ophørt) _checked.push('Ophørt');
        if(Nystartet) _checked.push('Nystartet');
       
        let newData = data.filter((feature) => {
            // console.log(feature.properties.status);
            return _checked.indexOf(feature.properties.status) > -1;
        });
        console.log(_checked);
        //console.log(newData);
        console.log('call setstate');
        this.setState({data: newData});

        

    }
    handleSelect(event){ 
        event.persist();
        console.log(event.target.value);
        let kom = event.target.value;
        let {startDate, endDate} = this.state;
        this.setState((prevState) => ({komkode : event.target.value}));
        this.getData(kom, startDate, endDate);
    }

    componentDidMount(){
        let that = this;
        let { komkode, startDate, endDate } = this.state;
        this.getData(komkode, startDate, endDate);
        this.getKommuner();
    }

    handleChange(event, value){
        this.setState({ value });
    };

    handleStart(date){ 
        this.setState({
            startDate: date.format('YYYY-MM-DD')
        });
        let startDate = date.format('YYYY-MM-DD');
        let {komkode, endDate} = this.state;
        this.getData(komkode, startDate, endDate);
    };

    handleEnd(date){ 
        this.setState({
            endDate: date.format('YYYY-MM-DD')
        });
        let endDate = date.format('YYYY-MM-DD');
        let {komkode, startDate} = this.state;
        this.getData(komkode, startDate, endDate);
    }
  
    render(){
        const { value, startDate, endDate, kommuner } = this.state;
        const locale = 'da';
        const _csvData = this.getCsv();
        return (
            <MuiThemeProvider theme={theme}>
            
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
                                        {
                                            this.state.csvData.length > 0 &&
                                             (<CSVLink 
                                                    data={this.state.csvData}
                                                    filename={"my-file.csv"}
                                                    target="_blank"
                                                >
                                                <CloudDownload/>
                                                </CSVLink>)    

                                        }
                                       
                                          

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
                                <Tab icon={<BarChart/>}/>
                            </Tabs>
                        {value === 0 && <TabContainer><MapData data={this.state.data}/></TabContainer>} 
                        {value === 1 && <TabContainer><GridData data={this.state.data} /></TabContainer>}
                        {value === 2 && <TabContainer><GraphData data={this.state.data} /></TabContainer>}
                    </div>
                  
                </div>
                        <FormGroup row>
                            <FormControlLabel 
                                control={
                                    <Switch
                                        checked={this.state.Fraflytter}
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
                                        checked={this.state.Tilflytter}
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
                                        checked={this.state.Ophørt}
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
                                        checked={this.state.Nystartet}
                                        onChange={this.handleChecked}
                                        color="primary"
                                        value="Nystartet"
                                    />
                                }
                                label="Nystartet"
                            />
                        </FormGroup>
            </MuiThemeProvider>
        );
    }
}
/*


*/
export default hot(module)(App);

/*
TODO: 

 First do the graph data with Victory library!!! then filters!!!!
 1. Implement filters: use switches or dropdown with checkboxes.
 

 Next => use filterData, til show only checked values

 FIX THE FILTERING OF DATA
*/