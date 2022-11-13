import {
  Button,
  Input,
  Typography,
} from "@mui/material"; import { Box, Container, Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import { getUserNFTs } from '../components/utils/LensProtocol/publication'
import { getSeedContract, getSigner, getWaterContract } from "../components/utils/common";
import { getProfile } from "../components/utils/LensProtocol/profile";

const Tree = () => {
  const [level, setLevel] = useState(0)
  const [timetoupgrade, setTimetoupgrade] = useState(0)
  const [imageshown, setImageshown] = useState("0")
  const [water, setWater] = useState(0)
  const [handle, setHandle] = useState("")
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

  const fetchProfile = async () => {
    const signer = getSigner();
    const address = await signer.getAddress()
    const profileDat = await getProfile(address);
    if (profileDat)
      setHandle(profileDat.handle)
  }

  useEffect(() => {
    fetchProfile()
    getNFTS()
    getSeedNFT()
  })

  const handleChange = async (e) => {
    e.preventDefault()
    setWater(e.target.value)
  }
  const handleUpgrade = async () => {
    const signer = getSigner()
    const address = await signer.getAddress()
    const contract = getSeedContract()
    const tokenDat = await contract.addressToTokenIds(address);
    await contract.train(parseInt(tokenDat), water)
  }

  const getSeedNFT = async () => {
    const signer = getSigner()
    const address = await signer.getAddress()
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
    if (parseInt(level.level) == 0) {
      setImageshown("Tree1.png")
    } else if (parseInt(level.level) == 1) {
      setImageshown("Tree2.png")
    } else if (parseInt(level.level) == 2) {
      setImageshown("Tree3.png")
    } else if (parseInt(level.level) == 3) {
      setImageshown("Tree4.png")
    } else {
      setImageshown("Tree5.png")
    }
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
          <img src={imageshown} width="800" height="350" className="center" />
          <Typography>
            Level: {level}
          </Typography>
          <Typography>
            Time to upgrade: {timetoupgrade}
          </Typography>
        </Stack>
      </Container>
      {timetoupgrade > 0 ? <Container maxWidth="md">
        <Stack sx={{ mt: 5, textAlign: "center" }}>
          <Input type="number" placeholder="Enter amount of water" onChange={handleChange} />
          <Button size='small' onClick={handleUpgrade}>Water</Button>
        </Stack>
      </Container> : null}
    </Box>

  );
};



export default Tree;