import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

const UniversityPageSkeleton = () => {
  return (
    <div className="container">
      <div className="sub-container">
        <Box sx={{ flexGrow: 1 }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={4}>
              <Skeleton variant="circular" width={80} height={80} />
            </Grid>
            <Grid item xs={8}>
              <Skeleton variant="text" width={200} height={100} />
            </Grid>
          </Grid>
        </Box>

        <Skeleton variant="text" height={80} />

        <Box mt={2}>
          <SingleCardSkeleton />
          <SingleCardSkeleton />
        </Box>
      </div>
    </div>
  );
};

const SingleCardSkeleton = () => {
  return (
    <Box p={2}>
      <Skeleton variant="rectangular" width="100%" height={100} />
    </Box>
  );
};

export default UniversityPageSkeleton;
