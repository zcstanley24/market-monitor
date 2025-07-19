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
          Price Range Over the Last 7 Days
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="retrievalTime" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="Apple, Inc. (AAPL)"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
              name="Apple (AAPL)"
            />
            <Area
              type="monotone"
              dataKey="Amazon.com, Inc. (AMZN)"
              stackId="1"
              stroke="#ffc658"
              fill="#ffc658"
              name="Amazon (AMZN)"
            />
            <Area
              type="monotone"
              dataKey="Alphabet, Inc. (GOOG)"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
              name="Google (GOOG)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Stack>
    </Paper>
  );
};

export default SevenDayVariationChart