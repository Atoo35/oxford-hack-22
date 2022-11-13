import {
    Card,
    CardContent,
    CardMedia,
    Typography,
  } from "@mui/material";
  import { Stack } from "@mui/system";
  import React from "react";
  
  const ProfileCard = ({data, i}) => {
  
    return (
      <Card variant="outlined" sx={{ m: 2 }}>
        <CardMedia
          component="img"
          height={500}
          image={data.originalContent.uri !==""? data.originalContent.uri:data.contentURI}
          sx={{ objectFit: "contain" }}
        />
        <CardContent>
          <Typography>
            {data.collectionName}
          </Typography>
  
          <Typography>{data.description}</Typography>
          <Stack
            mt={3}
            justifyContent="space-between"
            direction="row"
            alignItems="center"
          >
          </Stack>
        </CardContent>
      </Card>
    );
  };
  
  export default ProfileCard;