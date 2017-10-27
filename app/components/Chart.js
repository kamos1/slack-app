import React from 'react'
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';

export const Chart = (props) => {
  const count = [
    {type: 'wins', count: props.state.wins},
    {type: 'losses', count: props.state.losses}
  ]

  if (!props.state.wins && !props.state.losses) {
    return <div>No wins or losses!</div>
  } else {
    return (
      <div>
        <VictoryChart
          domainPadding={50}
          theme={VictoryTheme.material}
        >
          <VictoryAxis
            tickValues = {[1, 2]}
            tickFormat={["wins", "losses"]}
          />
          <VictoryAxis
            dependentAxis={true}
          />
          <VictoryBar 
            data={count} 
            x="type"
            y="count"
          />          
        </VictoryChart>
      </div>
    ) 
  }
};