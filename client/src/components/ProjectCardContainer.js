import { Card, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { explorePublications, getUserNFTs } from "./utils/LensProtocol/publication";
import { source } from './utils/constants'
import { getSigner } from "./utils/common";
const ProjectCardContainer = () => {

  // const request = {
  //   ownerAddress: accounts[0],
  //   chainIds: [80001],
  // }
  // const result = await getUserNFTs(request)
  // console.log(result)
  const [cardData, setCardData] = useState([]);

  const getPublications = async () => {
    const request = {
      sortCriteria: "LATEST",
      publicationTypes: ["POST"],
      sources: [source],
    };
    const publications = await explorePublications(request);
    setCardData(publications.data.explorePublications.items);
  };



  useEffect(() => {
    getPublications();
  }, []);

  return (
    <Grid container sx={{ mt: 3 }}>
      {cardData &&
        cardData.map((data, i) => (
          <Grid item xs={6}>
            <ProjectCard
              data={data.metadata}
              key={i}
              i={i}
              handle={data.profile.handle}
              publicationId={data.id}
            />
          </Grid>
        ))}
    </Grid>
  );
};

export default ProjectCardContainer;
