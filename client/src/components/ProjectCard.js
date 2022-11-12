import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { ethers, Contract } from "ethers";
import { collectPublication } from "./utils/LensProtocol/publication";
import { signedTypeData, splitSignature } from "./utils/LensProtocol/utils";
import { getLensHub } from "./utils/LensProtocol/lens-hub";
import { getSigner, getWaterContract } from "./utils/common";

const ProjectCard = ({ data, i, handle, publicationId }) => {

  const mintWTRTokens = async () => {
    const contract = getWaterContract();
    const res = await contract.mint(getSigner().getAddress(), ethers.utils.parseUnits("1", 18));
    alert(res)
  }

  const handleCollect = async () => {
    const signer = getSigner();
    const collectRequest = {
      publicationId,
    };
    const result = await collectPublication(collectRequest);
    const typedData = result.typedData;
    console.log('collect: typedData', typedData);

    const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
    console.log('collect: signature', signature);

    const { v, r, s } = splitSignature(signature);
    const lensHub = getLensHub();
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
    <Card variant="outlined" sx={{ m: 2 }}>
      <CardMedia
        component="img"
        height={140}
        image={"https://picsum.photos/500/500?random=" + i}
        sx={{ objectFit: "cover" }}
      />
      <CardContent>
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
          <Button variant="contained" onClick={handleCollect}>
            Donate
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
