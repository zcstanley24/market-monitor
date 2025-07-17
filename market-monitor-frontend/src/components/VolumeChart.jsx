import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import {
  Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  Bar, BarChart,
} from "recharts";

const VolumeChart = ({stockData}) => {

  const CustomVolumeChartTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;
  
    return (
      <div className="custom-tooltip" style={{ color: 'black', background: '#fff', border: '1px solid #ccc', padding: 10 }}>
        <p><strong>{data.symbol}</strong></p>
        <p>Today's Volume: {Number(data.volume).toLocaleString()}</p>
        <p>Average Volume: {Number(data.average_volume).toLocaleString()}</p>
        <p>Relative Volatility: {data.relative_volatility}</p>
      </div>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Trading Volume and Volatility
        </Typography>
        <Box height={300} width={700}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="symbol" />
              <YAxis 
                yAxisId="left"
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
                  return value;
                }}
                label={{ value: "Volume of Shares",  dx: -15, dy: 70, angle: -90, position: "insideLeft" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: "Relative Volatility", dx: 15, dy: 70, angle: 90, position: "insideRight" }}
              />
              <Tooltip content={<CustomVolumeChartTooltip />} />
              <Legend />
              <Bar yAxisId="left" dataKey="volume" fill="#8884d8" name="Today's Volume" />
              <Bar yAxisId="left" dataKey="average_volume" fill="#82ca9d" name="Average Volume" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="relative_volatility"
                stroke="#ff7300"
                strokeWidth={2}
                name="Relative Volatility"
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VolumeChart