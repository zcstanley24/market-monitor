import React from "react";
import {
  Typography,
  Stack,
} from '@mui/material';
import { colors } from "../styles/colors";

const CustomSevenDayChartTooltip = ({ active, payload }) => {
      if (!active || !payload || !payload.length) return null;
      const data = payload[0].payload;
    
  return (
    <Stack style={{ background: "#FFFFFF", border: '1px solid #CCCCCC', padding: "0.5rem" }}>
      <Typography sx={{fontWeight: "bold", fontFamily: "system-ui"}}>{data.retrievalTime}</Typography>
      <Stack direction="row" gap={1}>
        <Stack sx={{display: 'flex', alignItems: 'flex-end'}}>
          <Typography sx={{fontFamily: "system-ui"}} style={{color: colors.secondaryBlue, fontWeight: "500"}}>Amazon:</Typography>
          <Typography sx={{fontFamily: "system-ui"}} style={{color: colors.secondaryPurple, fontWeight: "500"}}>Apple:</Typography>
          <Typography sx={{fontFamily: "system-ui"}} style={{color: colors.secondaryGreen, fontWeight: "500"}}>Google:</Typography>
        </Stack>
        <Stack sx={{display: 'flex', alignItems: 'flex-end'}}>
          <Typography sx={{fontFamily: "system-ui"}} style={{color: colors.secondaryBlue, fontWeight: "500"}}>${Number(data["Amazon.com, Inc. (AMZN)"]).toFixed(2).toLocaleString()}</Typography>
          <Typography sx={{fontFamily: "system-ui"}} style={{color: colors.secondaryPurple, fontWeight: "500"}}>${Number(data["Apple, Inc. (AAPL)"]).toFixed(2).toLocaleString()}</Typography>
          <Typography sx={{fontFamily: "system-ui"}} style={{color: colors.secondaryGreen, fontWeight: "500"}}>${Number(data["Alphabet, Inc. (GOOG)"]).toFixed(2).toLocaleString()}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CustomSevenDayChartTooltip
