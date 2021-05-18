import React from 'react';
import {LineChart, CartesianGrid, Line, XAxis, YAxis, ResponsiveContainer, Tooltip} from 'recharts';
import PropTypes from 'prop-types';

const Chart = ({data, setChartMode}) => {

  // eslint-disable-next-line no-console
  console.log('render', data);
  return (
    
    <div className="stock-chart">
      {data.length > 0 ? (
        <ResponsiveContainer width="90%" height="90%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="value" stroke="#000" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis
              tickCount={15}
              domain={[dataMin => Math.round(dataMin * 0.8), dataMax => Math.round(dataMax * 1.2)]}
              interval={0}
            />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>)
        :<div className="stock-chart">Not enough data.</div>
      }
      <div className="stock-chart-controls">
        <button onClick={() => setChartMode('5d')}>5d</button>
        <button onClick={() => setChartMode('15d')}>15d</button>
        <button onClick={() => setChartMode('1m')}>1m</button>
        <button onClick={() => setChartMode('3m')}>3m</button>
        <button onClick={() => setChartMode('6m')}>6m</button>
        <button onClick={() => setChartMode('1y')}>1y</button>
        <button onClick={() => setChartMode('3y')}>3y</button>
        <button onClick={() => setChartMode('5y')}>5y</button>

      </div>
    </div>
  )

}

Chart.propTypes = {
  data: PropTypes.array.isRequired,
  setChartMode: PropTypes.func.isRequired,
}

export default Chart;