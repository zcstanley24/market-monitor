import React from "react";
import {
  Typography,
  Stack,
  Paper,
} from '@mui/material';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart,
  Bar, ErrorBar,
} from "recharts";
import { colors } from "../styles/colors";

const FiftyTwoWeekRangeChart = ({stockData}) => {
  const Custom52WeekChartTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;
  
    return (
      <Stack style={{ background: "#FFFFFF", border: '1px solid #CCCCCC', padding: "0.5rem" }}>
        <Typography sx={{fontWeight: "bold", fontFamily: "system-ui"}}>{data.symbol}</Typography>
        <Stack direction="row" gap={1}>
          <Stack sx={{display: 'flex', alignItems: 'flex-end'}}>
            <Typography sx={{fontFamily: "system-ui"}}>Latest Close:</Typography>
            <Typography sx={{fontFamily: "system-ui"}}>52-Week Low:</Typography>
            <Typography sx={{fontFamily: "system-ui"}}>52-Week High:</Typography>
          </Stack>
          <Stack sx={{display: 'flex', alignItems: 'flex-end'}}>
            <Typography sx={{fontFamily: "system-ui"}}>${data.close}</Typography>
            <Typography sx={{fontFamily: "system-ui"}}>${data.fifty_two_week_low}</Typography>
            <Typography sx={{fontFamily: "system-ui"}}>${data.fifty_two_week_high}</Typography>
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
          52-Week Price Variation
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={stockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="symbol" tick={{style: { fontWeight: "500" }}}/>
            <YAxis 
              label={{ value: "Stock Price", dx: -5, dy: 40, angle: -90, position: "insideLeft",
                style: { fontWeight: "bold", fontSize: 16 }
                }}
              tickFormatter={(value) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                }).format(value)
              }
            />
            <Tooltip 
              content={<Custom52WeekChartTooltip />}
              cursor={{
                stroke: "#e2e8f0",
                strokeWidth: 235,
              }}
            />
            <Bar dataKey="close" barSize={70} fill={colors.secondaryBlue}>
              <ErrorBar
                dataKey="fifty_two_week_range"
                width={8}
                strokeWidth={2}
                direction="y"
              />
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </Stack>
    </Paper>
  );
};

export default FiftyTwoWeekRangeChart