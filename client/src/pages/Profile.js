import { Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import React, { useEffect } from "react";
import { getSigner } from "../components/utils/common";
import {getUserNFTs} from '../components/utils/LensProtocol/publication'
import ProfileCardContainer from "../components/ProfileCardContainer";

const Profile = () => {
  const getNFTS= async()=>{
    const signer = getSigner();
    const address = await signer.getAddress()
    const request = {
        ownerAddress: address,
        chainIds: [80001],
      }
      const result = await getUserNFTs(request)
      console.log(result)
  }
  useEffect(()=>{
    getNFTS()
  })
  return (
    <Box>
      {/* <Container maxWidth="md">
        <Stack sx={{ mt: 5 }}>
          <Typography variant="h2" gutterBottom>
            tst
          </Typography>
        </Stack>
      </Container> */}
      <ProfileCardContainer />
    </Box>
  );
};

export default Profile;
