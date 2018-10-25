import React, {  Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { VictoryBar, VictoryChart, Bar } from 'victory';

const getSummaryData = (dat) => { 
    let data = dat.map(feature => feature.properties);
    let tilfl = (data.filter(x => {
        return x.status === 'Tilflytter'
    })).length;
    let frafl = (data.filter(x => x.status === 'Fraflytter')).length;
    let oph = (data.filter(x => x.status === 'Ophørt')).length; 
    let ny = (data.filter(x => x.status === 'Nystartet')).length;
    return [
        {x:"Fraflytter", y: frafl},
        {x:"Tilflytter", y: tilfl},
        {x: "Ophørt", y: oph},
        {x: "Nystartet", y: ny}
    ];
};

const getSummaryPerCategory = (data) => {
  let _data = data.map(feature => feature.properties);
  let stats = {
    fraflytter : {},
    tilflytter: {},
    ophoert: {},
    nystartet: {}
  };
  let summary = {
    fraflytter : _data.filter(x => x.status === 'Fraflytter'),
    tilflytter : _data.filter(x => x.status === 'Tilflytter'),
    ophoert: _data.filter(x => x.status === 'Ophørt'),
    nystartet: _data.filter(x => x.status === 'Nystartet')
  }; 
  for(let key in summary){ console.log('key in summary =>', key);
    let elem = summary[key];
    elem.forEach(category => {// console.log('category name =>', category);
      let k = category.hovedbranche;
      if(k in stats[key]){ console.log('key => ', k);
        stats[key][k] = stats[key][k] + 1;
      }else{  console.log('key not found => ', k);
        stats[key][k] = 1;
      }
    });
  }
  return stats;
}
const getBrancheData = (data) => {
  let _data = data.map(feature => feature.properties);
  let stats = {};
  _data.forEach(element => {
    let key = element.hovedbranche;
    //(key in stats) ? stats[key] = stats[key] + 1 : stats[key] = 0;
    if(key in stats){ console.log(key);
      stats[key] = stats[key] + 1;
    }else{
      stats[key] = 0;
    }
  }); 
  return stats;
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
      let sumData = getSummaryPerCategory(this.props.data);
      console.log(sumData);
  
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