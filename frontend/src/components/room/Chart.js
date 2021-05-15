import React from 'react';
import {LineChart, CartesianGrid, Line, XAxis, YAxis, ResponsiveContainer, Tooltip} from 'recharts';
import PropTypes from 'prop-types';

const Chart = ({data}) => {

  // eslint-disable-next-line no-console
  console.log('render', data);
  return(
    <div className="stock-chart">
      <ResponsiveContainer width="90%" height="90%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="price" stroke="#000"/>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
          <XAxis dataKey="date"/>
          <YAxis />
          <Tooltip/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  )

}

Chart.propTypes = {
  data: PropTypes.array.isRequired
}

export default Chart;