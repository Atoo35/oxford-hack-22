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

  const sendTx = async (transaction) => {
    const signer = getSigner();
    return signer.sendTransaction(transaction);
  }
  const pleaseWork = async () => {

    const tx = await sendTx({
      to: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
      from: "0x7935468Da117590bA75d8EfD180cC5594aeC1582",
      data: "0x095ea7b3000000000000000000000000fcda2801a31ba70dfe542793020a934f880d54ab0000000000000000000000000000000000000000000000008ac7230489e80000",
    });

    console.log('approve module: txHash', tx.hash);

    await tx.wait();

    console.log('approve module: txHash mined', tx.hash);
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
    <Card variant="outlined" sx={{ m: 2 }}>
      <CardMedia
        component="img"
        height={140}
        image={"https://picsum.photos/500/500?random=" + i}
        sx={{ objectFit: "cover" }}
      />
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

export default ProjectCard;
