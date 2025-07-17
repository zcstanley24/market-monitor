import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart,
  Bar, ErrorBar,
} from "recharts";

const FiftyTwoWeekRangeChart = ({stockData}) => {
  const Custom52WeekChartTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;
  
    return (
      <div className="custom-tooltip" style={{ background: '#fff', border: '1px solid #ccc', padding: 10 }}>
        <p><strong>{data.symbol}</strong></p>
        <p>Close: {data.close}</p>
        <p>52w Low: {data.fifty_two_week_low}</p>
        <p>52w High: {data.fifty_two_week_high}</p>
      </div>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          52-Week Price Range
        </Typography>
        <Box height={300} width={700}>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={stockData}>
              <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
              <XAxis dataKey="symbol" />
              <YAxis />
              <Tooltip content={<Custom52WeekChartTooltip />} />
              <Bar dataKey="close" barSize={20} fill="#8884d8">
                <ErrorBar
                  dataKey="fifty_two_week_range"
                  width={4}
                  strokeWidth={2}
                  direction="y"
                />
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FiftyTwoWeekRangeChart