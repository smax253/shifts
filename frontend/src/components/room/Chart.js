import React from 'react';
import {LineChart, CartesianGrid, Line, XAxis, YAxis, ResponsiveContainer, Tooltip} from 'recharts';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

const Chart = ({data, setChartMode, chartMode}) => {

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
        <Button variant="contained" className={chartMode==='5d' && 'active'} onClick={() => setChartMode('5d')}>5d</Button>
        <Button variant="contained" className={chartMode==='15d' && 'active'} onClick={() => setChartMode('15d')}>15d</Button>
        <Button variant="contained" className={chartMode==='1m' && 'active'} onClick={() => setChartMode('1m')}>1m</Button>
        <Button variant="contained" className={chartMode==='3m' && 'active'} onClick={() => setChartMode('3m')}>3m</Button>
        <Button variant="contained" className={chartMode==='6m' && 'active'} onClick={() => setChartMode('6m')}>6m</Button>
        <Button variant="contained" className={chartMode==='1y' && 'active'} onClick={() => setChartMode('1y')}>1y</Button>
        <Button variant="contained" className={chartMode==='3y' && 'active'} onClick={() => setChartMode('3y')}>3y</Button>
        <Button variant="contained" className={chartMode==='5y' && 'active'} onClick={() => setChartMode('5y')}>5y</Button>

      </div>
    </div>
  )

}

Chart.propTypes = {
  data: PropTypes.array.isRequired,
  setChartMode: PropTypes.func.isRequired,
  chartMode: PropTypes.string.isRequired
}

export default Chart;