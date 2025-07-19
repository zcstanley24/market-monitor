import React from "react";
import {
  Typography,
  Stack,
  Paper,
} from '@mui/material';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Legend, Line,
} from "recharts";
import { colors } from "../styles/colors";
import CustomSevenDayChartTooltip from "./CustomSevenDayChartTooltip";

const SevenDayTimeSeries = ({data}) => {
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
          Recent Stock Price Changes
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="retrievalTime" />
            <YAxis domain={['auto', 'auto']} label={{ value: "Stock Price", dy: 40, angle: -90, position: "insideLeft",
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
            <Tooltip content={<CustomSevenDayChartTooltip />} />
            <Legend />
            <Line type="monotone" dataKey={`Apple, Inc. (AAPL)`} name="Apple (AAPL)" stroke={colors.secondaryPurple} strokeWidth={2} />
            <Line type="monotone" dataKey={`Amazon.com, Inc. (AMZN)`} name="Amazon (AMZN)" stroke={colors.secondaryBlue} strokeWidth={2} />
            <Line type="monotone" dataKey={`Alphabet, Inc. (GOOG)`} name="Google (GOOG)" stroke={colors.secondaryGreen} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Stack>
    </Paper>
  );
};

export default SevenDayTimeSeries