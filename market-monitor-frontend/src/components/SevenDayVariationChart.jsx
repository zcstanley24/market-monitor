import React from "react";
import {
  Typography,
  Stack,
  Paper,
} from '@mui/material';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Legend, Area,
} from "recharts";
import { colors } from "../styles/colors";
import CustomSevenDayChartTooltip from "./CustomSevenDayChartTooltip";

const SevenDayVariationChart = ({data}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 2,
        p: 1.5
      }}
    >
      <Stack>
        <Typography variant="h6" fontFamily="system-ui" mb={1} fontWeight="400">
          Recent Stock Price Intra-Day Variation
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="retrievalTime" />
            <YAxis label={{ value: "Price Range", dx: 10, dy: 40, angle: -90, position: "insideLeft",
              style: { fontWeight: "bold", fontSize: 16 }
              }}
              tickFormatter={(value, index) =>
                index === 0 ? '' : new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                }).format(value)
              }
            />
            <Tooltip content={CustomSevenDayChartTooltip} />
            <Legend />
            <Area
              type="monotone"
              dataKey="Alphabet, Inc. (GOOG)"
              stackId="1"
              stroke={colors.secondaryGreen}
              fill={colors.secondaryGreen}
              name="Google (GOOG)"
            />
            <Area
              type="monotone"
              dataKey="Apple, Inc. (AAPL)"
              stackId="1"
              stroke={colors.secondaryPurple}
              fill={colors.secondaryPurple}
              name="Apple (AAPL)"
            />
            <Area
              type="monotone"
              dataKey="Amazon.com, Inc. (AMZN)"
              stackId="1"
              stroke={colors.secondaryBlue}
              fill={colors.secondaryBlue}
              name="Amazon (AMZN)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Stack>
    </Paper>
  );
};

export default SevenDayVariationChart