import React from "react";
import {
  Paper,
  Typography,
  Stack,
} from '@mui/material';
import {
  Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  Bar, BarChart,
} from "recharts";
import { colors } from "../styles/colors";

const VolumeChart = ({stockData}) => {

  const CustomVolumeChartTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;
  
    return (
      <Stack style={{ background: "#FFFFFF", border: '1px solid #CCCCCC', padding: "0.5rem" }}>
        <Typography sx={{fontWeight: "bold", fontFamily: "system-ui"}}>{data.symbol}</Typography>
        <Stack direction="row" gap={1}>
          <Stack sx={{display: 'flex', alignItems: 'flex-end'}}>
            <Typography sx={{fontFamily: "system-ui"}}>Today's Volume:</Typography>
            <Typography sx={{fontFamily: "system-ui"}}>Average Volume:</Typography>
            <Typography sx={{fontFamily: "system-ui"}}>Relative Volatility:</Typography>
          </Stack>
          <Stack sx={{display: 'flex', alignItems: 'flex-end'}}>
            <Typography sx={{fontFamily: "system-ui"}}>{Number(data.volume).toLocaleString()}</Typography>
            <Typography sx={{fontFamily: "system-ui"}}>{Number(data.average_volume).toLocaleString()}</Typography>
            <Typography sx={{fontFamily: "system-ui"}}>{data.relative_volatility}</Typography>
          </Stack>
        </Stack>
      </Stack>
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 2,
        p: 1.5
      }}
    >
      <Stack>
        <Typography variant="h6" mb={1} fontFamily="system-ui" fontWeight="400">
          Trading Volume and Volatility
        </Typography>
        <ResponsiveContainer width={750} height={300}>
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
            <Tooltip 
              content={<CustomVolumeChartTooltip />}
              cursor={{ fill: "#e2e8f0" }}
            />
            <Legend 
              payload={[
                { value: "Today's Volume", type: "square", color: colors.secondaryBlue, dataKey: "volume" },
                { value: "Average Volume", type: "square", color: "#82ca9d", dataKey: "average_volume" },
                { value: "Relative Volatility", type: "line", color: "#ff7300", dataKey: "relative_volatility" },
              ]}
            />
            <Bar yAxisId="left" dataKey="volume" fill={colors.secondaryBlue} name="Today's Volume" />
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
      </Stack>
    </Paper>
  );
};

export default VolumeChart