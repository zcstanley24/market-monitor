import React from "react";
import {
  Paper,
  Typography,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  Bar, BarChart,
} from "recharts";
import { colors } from "../styles/colors";

const VolumeChart = ({stockData}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const CustomVolumeChartTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;
  
    return (
      <Stack style={{ background: "#FFFFFF", border: '1px solid #CCCCCC', padding: "0.5rem" }}>
        <Typography sx={{fontWeight: "bold", fontFamily: "system-ui"}}>{data.symbol}</Typography>
        <Stack direction="row" gap={1}>
          <Stack sx={{display: 'flex', alignItems: 'flex-end'}}>
            <Typography sx={{fontFamily: "system-ui"}} style={{color: colors.secondaryBlue, fontWeight: "500"}}>Today's Volume:</Typography>
            <Typography sx={{fontFamily: "system-ui"}} style={{color: colors.secondaryGreen, fontWeight: "500"}}>Average Volume:</Typography>
            <Typography sx={{fontFamily: "system-ui"}} style={{color: colors.secondaryPurple, fontWeight: "500"}}>Relative Volatility:</Typography>
          </Stack>
          <Stack sx={{display: 'flex', alignItems: 'flex-end'}}>
            <Typography sx={{fontFamily: "system-ui"}} style={{color: colors.secondaryBlue, fontWeight: "500"}}>{Number(data.volume).toLocaleString()}</Typography>
            <Typography sx={{fontFamily: "system-ui"}} style={{color: colors.secondaryGreen, fontWeight: "500"}}>{Number(data.average_volume).toLocaleString()}</Typography>
            <Typography sx={{fontFamily: "system-ui"}} style={{color: colors.secondaryPurple, fontWeight: "500"}}>{data.relative_volatility}</Typography>
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
          <Typography sx={{fontFamily: "system-ui"}} style={{color: colors.secondaryBlue}}>
            Today's Volume
          </Typography>
        </Stack>
        <Stack direction="row" sx={{alignItems: 'center'}}>
          <svg width={20} height={14}>
            <rect width={14} height={14} fill={colors.secondaryGreen} />
          </svg>
          <Typography sx={{fontFamily: "system-ui"}} style={{color: colors.secondaryGreen}}>
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
              stroke={colors.secondaryPurple}
              strokeWidth={2}
            />
          </svg>
          <Typography sx={{fontFamily: "system-ui"}} style={{color: colors.secondaryPurple}}>
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
        p: 1.5,
      }}
      width="100%"
    >
      <Stack>
        <Typography variant="h6" mb={1} fontFamily="system-ui" fontWeight="400">
          Trading Volume and Volatility
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stockData} 
            marginRight={isSmallScreen ? 0 : 20}
            marginLeft={isSmallScreen ? 0 : 20}
            margin={{ top: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="symbol" tick={{style: { fontWeight: "500" }}} />
            <YAxis 
              yAxisId="left"
              tickFormatter={(value) => {
                if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
                if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
                return value;
              }}
              label={
                !isSmallScreen ? { 
                  value: "Volume of Shares",  dx: -15, dy: 70, angle: -90, position: "insideLeft",
                  style: { fontWeight: "bold", fontSize: 16 }
               } : null }
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={
                !isSmallScreen ? { 
                  value: "Relative Volatility", dx: 15, dy: 70, angle: 90, position: "insideRight",
                  style: { fontWeight: "bold", fontSize: 16 }
               } : null }
            />
            <Tooltip 
              content={<CustomVolumeChartTooltip />}
              cursor={{ fill: "#e2e8f0" }}
            />
            {!isSmallScreen && (<Legend content={<CustomLegend />}
            />)}
            {isSmallScreen && (
              <Legend wrapperStyle={{
              overflow: 'visible',
              fontSize: '0.85rem',
              bottom: -7
            }}/>)}
            <Bar yAxisId="left" dataKey="volume" fill={colors.secondaryBlue} name="Today's Volume" />
            <Bar yAxisId="left" dataKey="average_volume" fill={colors.secondaryGreen} name="Average Volume" />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="relative_volatility"
              stroke={colors.secondaryPurple}
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