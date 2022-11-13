import {
    Card,
    CardContent,
    CardMedia,
    Typography,
  } from "@mui/material";
  import { Stack } from "@mui/system";
  import React from "react";
  import { ethers, Contract } from "ethers";
  import { collectPublication } from "./utils/LensProtocol/publication";
  import { signedTypeData, splitSignature } from "./utils/LensProtocol/utils";
  import { getLensHub } from "./utils/LensProtocol/lens-hub";
  import { getSigner, getWaterContract } from "./utils/common";
  
  const ProfileCard = ({ data, i}) => {
  
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