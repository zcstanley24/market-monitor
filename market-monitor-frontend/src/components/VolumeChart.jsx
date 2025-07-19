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

  const CustomLegend = () => {
    return (
      <Stack direction="row" gap={3} sx={{alignItems: 'center', justifyContent: 'center'}}>
        <Stack direction="row" sx={{alignItems: 'center'}}>
          <svg width={20} height={14}>
            <rect width={14} height={14} fill={colors.secondaryBlue} />
          </svg>
          <Typography sx={{fontFamily: "system-ui"}}>
            Today's Volume
          </Typography>
        </Stack>
        <Stack direction="row" sx={{alignItems: 'center'}}>
          <svg width={20} height={14}>
            <rect width={14} height={14} fill="#82ca9d" />
          </svg>
          <Typography sx={{fontFamily: "system-ui"}}>
            Average Volume
          </Typography>
        </Stack>
        <Stack direction="row" gap={1} sx={{alignItems: 'center'}}>
          <svg width={20} height={14}>
            <line
                x1={0}
              y1={7}
              x2={20}
              y2={7}
              stroke='#ff7300'
              strokeWidth={2}
            />
          </svg>
          <Typography sx={{fontFamily: "system-ui"}}>
            Relative Volatility
          </Typography>
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
          <BarChart data={stockData} 
            margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
            series={[
              { id: 0, data: [10, 15], label: 'Series A', labelMarkType: 'line' },
              { id: 1, data: [15, 20], label: 'Series B', labelMarkType: 'line' },
              { id: 2, data: [20, 25], label: 'Series C' },
              { id: 3, data: [10, 15], label: 'Series D', labelMarkType: 'line' },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="symbol" tick={{style: { fontWeight: "500" }}} />
            <YAxis 
              yAxisId="left"
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
                return value;
              }}
              label={{ value: "Volume of Shares",  dx: -15, dy: 70, angle: -90, position: "insideLeft",
                style: { fontWeight: "bold", fontSize: 16 }
               }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: "Relative Volatility", dx: 15, dy: 70, angle: 90, position: "insideRight",
                style: { fontWeight: "bold", fontSize: 16 }
               }}
            />
            <Tooltip 
              content={<CustomVolumeChartTooltip />}
              cursor={{ fill: "#e2e8f0" }}
            />
            <Legend content={<CustomLegend />}
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