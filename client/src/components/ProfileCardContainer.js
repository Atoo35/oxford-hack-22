import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import { getUserNFTs } from "./utils/LensProtocol/publication";
import { getSigner } from "./utils/common";
const ProfileCardContainer = () => {

  const getNFTS= async()=>{
    const signer = getSigner();
    const address = await signer.getAddress()
    const request = {
        ownerAddress: address,
        chainIds: [80001],
      }
      const result = await getUserNFTs(request);
      setCardData(result.data.nfts.items)
  }

  useEffect(()=>{
    getNFTS();   
  }, [])

  const [cardData, setCardData] = useState([]);

  return (
    <Grid container sx={{ mt: 3 }}>
      {cardData &&
        cardData.map((data, i) => (
          <Grid item xs={6}>
            <ProfileCard
              data={data}
              key={i}
              i={i}
            />
          </Grid>
        ))}
    </Grid>
  );
};

export default ProfileCardContainer;