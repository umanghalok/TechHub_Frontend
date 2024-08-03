import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useMediaQuery, useTheme } from '@mui/material';
import ContentLoader from 'react-content-loader';

const AnalysisLoader = () => (
  <StyledBox>
    <ContentLoader 
      speed={2}
      width={500}
      height={500}
      viewBox="0 0 500 500"
      backgroundColor="#f3f3f3"
      foregroundColor="#b0b0b0"
    >
      <circle cx="250" cy="250" r="200" /> 
      <rect x="20" y="470" rx="4" ry="4" width="460" height="30" />
    </ContentLoader>
  </StyledBox>
);

const StyledBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  backgroundColor: "#f5f5f5",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
});

export default function Analysis({ title, count, Tags }) {
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); 
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <AnalysisLoader />;
  }

  return (
    <StyledBox>
      <Typography variant="h5" sx={{ color: "#000" }} gutterBottom>
        {title}
      </Typography>
      <Chart
        type="pie"
        width={isSmallScreen ? 400 : 500}
        height={isSmallScreen ? 400 : 500}
        series={count}
        options={{
          noData: { text: "Empty Data" },
          labels: Tags
        }}
      />
    </StyledBox>
  );
}
