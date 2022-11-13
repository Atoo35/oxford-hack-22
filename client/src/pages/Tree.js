import {
  Typography,
} from "@mui/material"; import { Box, Container, Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import { getUserNFTs } from '../components/utils/LensProtocol/publication'
import { getSeedContract, getSigner, getWaterContract } from "../components/utils/common";

const Tree = ({ handle }) => {
  const [level, setLevel] = useState(0)
  const [timetoupgrade, setTimetoupgrade] = useState(0)
  const getNFTS = async () => {
    const signer = getSigner();
    const address = await signer.getAddress()
    const request = {
      ownerAddress: address,
      chainIds: [80001],
    }
    const result = await getUserNFTs(request)
    console.log(result)
  }
  useEffect(() => {
    getNFTS()
    const signer = getSigner()
    getSeedNFT(signer.getAddress())
  })


  const getSeedNFT = async (address) => {
    const contract = getSeedContract();
    const res = await contract.balanceOf(address);
    const tokenDat = await contract.addressToTokenIds(address)
    const level = await contract.getLevels(parseInt(tokenDat))
    console.log('balance', res.toString())
    console.log('tokenId', parseInt(tokenDat))
    console.log('level', parseInt(level.level))
    console.log('timeToUpgrade', parseInt(level.timeToUpgrade))
    setLevel(parseInt(level.level))
    setTimetoupgrade(parseInt(level.timeToUpgrade))
  }


  return (
    <Box>
      <Container maxWidth="md">
        <Stack sx={{ mt: 5, textAlign: "center" }}>
          <Typography variant="h2" gutterBottom>
            @{handle}'s tree
          </Typography>
        </Stack>
      </Container>
      <Container maxWidth="md">
        <Stack sx={{ mt: 5, textAlign: "center" }}>
          <img src="Tree1.jpg" width="100" height="400" class="center" />
          <Typography>
            Level: {level}
          </Typography>
          <Typography>
            Time to upgrade: {timetoupgrade}
          </Typography>
        </Stack>
      </Container>
    </Box>

  );
};



export default Tree;