import React from "react";
import Chart from "react-google-charts";
import PropTypes from 'prop-types';

export class ViewChart extends React.Component {
  static propTypes = {
    chartData: PropTypes.array,
    chartType: PropTypes.string
  }
  render() {
    return (
      <div className="App">
        <Chart
          width={'500px'}
          height={'300px'}
          chartType={this.props.chartType}
          loader={<div>Loading Chart</div>}
          data={[
            ['Products Category', 'Sales', 'Expense', 'Profit'],
            ...this.props.chartData
          ]}
          options={{
            title: 'Products Market',
            chartArea: { width: '50%' },
            isStacked: true,
            hAxis: {
              title: 'Market',
            },
            xAxis: {
              title: 'Products Category',
              minValue: 0,
            },

          }}
          rootProps={{ 'data-testid': '3' }}
        />
      </div>
    );
  }
}

export default ViewChart
