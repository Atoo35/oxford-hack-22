import {
    Button,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Typography,
  } from "@mui/material";import { Box, Container, Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import {getUserNFTs} from '../components/utils/LensProtocol/publication'
import { ethers, Contract } from "ethers";
import { collectPublication } from "../components/utils/LensProtocol/publication";
import { signedTypeData, splitSignature } from "../components/utils/LensProtocol/utils";
import { getLensHub } from "../components/utils/LensProtocol/lens-hub";
import { getSigner, getWaterContract } from "../components/utils/common";

const Tree = ({handle}) => {
    const [level,  setLevel] =useState(0)
    const [timetoupgrade, setTimetoupgrade] =useState(0)
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
    setTimetoupgrade(parseInt(timeToUpgrade.timeToUpgrade))
  }


  const handleCollect = async () => {
    const signer = getSigner();
    const collectRequest = {
      publicationId,
    };
    const result = await collectPublication(collectRequest);
    const typedData = result.data.createCollectTypedData.typedData;
    console.log('collect: typedData', typedData);

    const signature = await signedTypeData(signer, typedData.domain, typedData.types, typedData.value);
    console.log('collect: signature', signature);

    const { v, r, s } = splitSignature(signature);
    const lensHub = getLensHub(signer);
    const tx = await lensHub.collectWithSig(
      {
        collector: signer.getAddress(),
        profileId: typedData.value.profileId,
        pubId: typedData.value.pubId,
        data: typedData.value.data,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      },
      { gasLimit: 1000000 }
    );
    console.log('collect: tx hash', tx.hash);
  };
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
            <img src="Tree1.jpg" width="100" height="400" class="center"/>
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
  return (
    <Card variant="outlined" sx={{ m: 2 }}>
      <CardContent>
        <Typography>
          NGO Name
        </Typography>
        <Typography color="text.secondary" variant="subtitle2">
          {handle}
        </Typography>
        <Typography variant="h5" gutterBottom>
          {data.content}
        </Typography>

        <Typography>{data.description}</Typography>
        <Stack
          mt={3}
          justifyContent="space-between"
          direction="row"
          alignItems="center"
        >
          <Button size="small">
            <img src="/CommentIcon.png" width="20" height="20"/>
          </Button>
          <Button vsize="small">
            <img src="/MirrorIcon.png" width="20" height="20"/>
          </Button>
          <Button vsize="small">
            <img src="/LikeIcon.png" width="20" height="20"/> 
          </Button>
          <Button size="small" onClick={handleCollect}>
            <img src="/DonateIcon.png" width="20" height="20"/>
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};



export default Tree;