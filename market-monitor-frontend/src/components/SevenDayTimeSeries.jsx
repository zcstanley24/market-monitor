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
          Stock Price Over the Last 7 Days
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="retrievalTime" />
            <YAxis domain={['auto', 'auto']} label={{ value: "Stock Price", dy: 40, angle: -90, position: "insideLeft",
              style: { fontWeight: "bold", fontSize: 16 }
              }}/>
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={`Apple, Inc. (AAPL)`} name="Apple (AAPL)" stroke="#1976d2" strokeWidth={2} />
            <Line type="monotone" dataKey={`Amazon.com, Inc. (AMZN)`} name="Amazon (AMZN)" stroke="#f57c00" strokeWidth={2} />
            <Line type="monotone" dataKey={`Alphabet, Inc. (GOOG)`} name="Google (GOOG)" stroke="#2e7d32" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Stack>
    </Paper>
  );
};

export default SevenDayTimeSeries