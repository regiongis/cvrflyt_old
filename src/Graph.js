import React, {  Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { VictoryBar, VictoryChart, Bar } from 'victory';

const getSummaryData = (dat) => { console.log('from graph');console.log(data);
    let data1 = [
        {status: "Tilflytter", "cvr-nummer":"123"},
        {status: "Fraflytter", "cvr-nummer":"123"},
        {status: "Fraflytter", "cvr-nummer":"123"},
        {status: "Nystartet", "cvr-nummer":"123"},
        {status: "Nystartet", "cvr-nummer":"123"},
        {status: "Tilflytter", "cvr-nummer":"123"}
    ];
    let data = dat.map(feature => feature.properties);
    let tilfl = (data.filter(x => {
        //console.log('logging x');
        //console.log(x.status === "Tilflytter");
        return x.status === 'Tilflytter'
    
    })).length; //console.log('til ', tilfl);
    let frafl = (data.filter(x => x.status === 'Fraflytter')).length;console.log('fra ', frafl);
    let oph = (data.filter(x => x.status === 'Ophørt')).length; //console.log('op ', oph);
    let ny = (data.filter(x => x.status === 'Nystartet')).length; //console.log('ny ', ny);
    return [
        {x:"Fraflytter", y: frafl},
        {x:"Tilflytter", y: tilfl},
        {x: "Ophørt", y: oph},
        {x: "Nystartet", y: ny}
    ];
}

class GraphData extends React.Component {
    constructor() {
      super();
      this.state = {
        clicked: false,
        style: {
          data: { fill: "tomato" }
        }
      };
    }
  
    render() {
      const handleMouseOver = () => {
        const fillColor = this.state.clicked ? "blue" : "tomato";
        const clicked = !this.state.clicked;
        this.setState({
          clicked,
          style: {
            data: { fill: fillColor }
          }
        });
      };

      let catData = getSummaryData(this.props.data);
  
      return (
        <div>
          <Paper style={{height: '600px'}}>
            <VictoryChart height={400} width={400}
                domainPadding={{ x: 50, y: [0, 20] }}
                scale={{ x: "time" }}
            >
                <VictoryBar
                dataComponent={
                    <Bar events={{ onMouseOver: handleMouseOver }}/>
                }
                style = {{
                    data: {
                        fill: (d) => {
                            if(d.x === 'Fraflytter') return 'orange';
                            if(d.x === 'Tilflytter') return 'green';
                            if(d.x === 'Ophørt') return 'red';
                            if(d.x === 'Nystartet') return 'blue';
                        }
                    }
                      
                    
                }}
                
                data={ catData }

                labels={(d) => d.y}
                />
            </VictoryChart>
          </Paper>  
        </div>
      );
    }
   }

   export default GraphData;