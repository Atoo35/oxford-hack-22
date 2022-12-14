import {
  AppBar,
  Button,
  Card,
  Chip,
  IconButton,
  Modal,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import PowerSettingsNew from "@mui/icons-material/PowerSettingsNew";
import { ethers, Contract, BigNumber } from "ethers";
import { generateChallenge, authenticate } from "./utils/LensProtocol/login";
import { createProfile, getProfile } from "./utils/LensProtocol/profile";
import { uploadToIPFS } from "./utils/ipfs";
import { v4 as uuidv4 } from "uuid";
import { Link as RouterLink } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  createPostTypedData,
  explorePublications,
  getUserNFTs,
} from "./utils/LensProtocol/publication";
import { signedTypeData, splitSignature } from "./utils/LensProtocol/utils";
import { getLensHub } from "./utils/LensProtocol/lens-hub";
import { pollUntilIndexed } from "./utils/LensProtocol/transactions";
import { source } from "./utils/constants";
import { getSeedContract, getWaterContract } from "./utils/common";



import { css } from '@emotion/css'

export function SearchInput ({
  placeholder, onChange, value, onKeyDown = null
}) {
  return (
    <input
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      className={inputStyle}
      onKeyDown={onKeyDown}
    />
  )
}

const inputStyle = css`
  outline: none;
  border: none;
  padding: 15px 20px;
  font-size: 16px;
  border-radius: 25px;
  border: 2px solid rgba(0, 0, 0, .04);
  transition: all .4s;
  width: 300px;
  background-color: #fafafa;
  &:focus {
    background-color: white;
    border: 2px solid rgba(0, 0, 0, .1);
  }
`

const Navbar = () => {
  const [connectModal, setConnectModal] = useState(false);
  const [lensHandle, setLensHandle] = useState("");
  const [profile, setProfile] = useState(null)
  const [tokenBalance, setTokenBalace] = useState(0)



  const getSeedNFT = async (address) => {
    const contract = getSeedContract();
    const res = await contract.balanceOf(address);
    const tokenDat = await contract.addressToTokenIds(address)
    const level = await contract.getLevels(parseInt(tokenDat))
    console.log('balance', res.toString())
    console.log('tokenId', parseInt(tokenDat))
    console.log('level', parseInt(level.level))
    console.log('timeToUpgrade', parseInt(level.timeToUpgrade))
  }

  const getTokenBalance = async (address) => {
    const contract = getWaterContract();
    const res = await contract.balanceOf(address)
    const ethValue = ethers.utils.formatEther(res);
    setTokenBalace(ethValue)
  }

  const getPublications = async () => {
    const request = {
      sortCriteria: "LATEST",
      publicationTypes: ["POST"],
      sources: [source],
    };
    const publications = await explorePublications(request);
    console.log(publications);
  };
  const postToLens = async (title, description, raiseAmt, maxCollectCount) => {
    const metadata_id = uuidv4();
    const ipfsResult = await uploadToIPFS({
      version: "2.0.0",
      metadata_id,
      locale: "en-us",
      mainContentFocus: "TEXT_ONLY",
      description,
      content: title,
      external_url: null,
      image: null,
      imageMimeType: null,
      name: title,
      attributes: [],
      tags: [],
      media: [],
      appId: source,
    });
    console.log(ipfsResult);
    const payload = {
      profileId: lensProfileId,
      contentURI:
        "https://" + ipfsResult + ".ipfs.dweb.link/" + metadata_id + ".json",
      collectModule: {
        limitedFeeCollectModule: {
          collectLimit: `${maxCollectCount}`,
          amount: {
            currency: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
            value: `${raiseAmt / maxCollectCount}`,
          },
          recipient: profile.ownedBy,
          referralFee: 0,
          followerOnly: false
        }
      },
      referenceModule: {
        "followerOnlyReferenceModule": false
      }
    };
    console.log("payload", payload);
    console.log("lens profile id", lensProfileId);
    console.log(payload.contentURI);

    const result = await createPostTypedData(payload);
    const typedData = result.data.createPostTypedData.typedData;
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const signature = await signedTypeData(
      signer,
      typedData.domain,
      typedData.types,
      typedData.value
    );
    console.log("create post: signature", signature);

    const { v, r, s } = splitSignature(signature);
    console.log("Signature Split");
    const lensHub = getLensHub(signer);

    const tx = await lensHub.postWithSig({
      profileId: typedData.value.profileId,
      contentURI: typedData.value.contentURI,
      collectModule: typedData.value.collectModule,
      collectModuleInitData: typedData.value.collectModuleInitData,
      referenceModule: typedData.value.referenceModule,
      referenceModuleInitData: typedData.value.referenceModuleInitData,
      sig: {
        v,
        r,
        s,
        deadline: typedData.value.deadline,
      },
    });
    console.log("here");
    console.log(tx.hash);
    const res = await pollUntilIndexed(tx.hash);
    setLoading(false);
    setOpen(false);
    window.location.reload(false);
    console.log(res);
  };
  useEffect(() => {
    getPublications();
  }, []);
  const [currAcc, setCurrAcc] = useState("");
  const [lensProfileId, setLensProfileId] = useState("");
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrAcc(account);
        // alert(account)
        sessionStorage.setItem("address", account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrAcc(accounts[0]);
      getTokenBalance(accounts[0])
      getSeedNFT(accounts[0])
      sessionStorage.setItem("address", accounts[0]);
      await signInWithLens(accounts[0]);

      const profile = await getProfile(accounts[0]);
      console.log("profile", profile);
      if (profile) {
        setProfile(profile);
        setLensProfileId(profile.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setAuthenticationToken = (authenticate) => {
    const { accessToken, refreshToken } = authenticate;
    sessionStorage.setItem("lens-access-token", accessToken);
    sessionStorage.setItem("lens-refresh-token", refreshToken);
  };

  const signInWithLens = async (address) => {
    try {
      const { ethereum } = window;
      const challengeResponse = await generateChallenge(address);
      console.log(challengeResponse);
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(
        challengeResponse.data.challenge.text
      );
      console.log("--isSignstring", signature);
      const accessTokens = await authenticate(address, signature);
      console.dir(accessTokens, { depth: null });
      setAuthenticationToken(accessTokens.data.authenticate);
    } catch (err) {
      console.log(err);
    }
  };

  const createLensProfile = async (handle) => {
    try {
      const request = {
        handle,
        profilePictureUri: null,
        followNFTURI: null,
        followModule: null,
      };

      const createProfileResponse = await createProfile(request);
      const profile = await getLensProfile();
      console.log(profile);
    } catch (error) {
      console.log("error in create profile", error);
    }
  };

  const getLensProfile = async () => {
    const profile = await getProfile(currAcc);
    console.log(profile);
    return profile;
  };

  const style = {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
  };

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AppBar position="static">
      <Modal open={connectModal} sx={style}>
        <Card sx={{ padding: 5 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              placeholder="Enter your New Lens Handle"
              onChange={(e) => {
                setLensHandle(e.target.value);
              }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={async () => {
                await createLensProfile(lensHandle);
                setConnectModal(false);
              }}
            >
              Submit
            </Button>
          </Stack>
        </Card>
      </Modal>
      <Modal open={open} sx={style}>
        <Card sx={{ padding: 5 }}>
          <Stack spacing={3}>
            <Typography variant="h4" textAlign={"center"}>
              Add your drive to GiveSpace
            </Typography>
            <TextField
              name="title"
              fullWidth
              placeholder="Title"
              onChange={handleChange}
            />
            <TextField
              name="description"
              fullWidth
              placeholder="Description"
              onChange={handleChange}
            />
            <TextField
              name="raiseAmt"
              type="number"
              fullWidth
              placeholder="Raise Amount"
              onChange={handleChange}
            />
            <TextField
              name="maxCollectCount"
              type="number"
              fullWidth
              placeholder="Max Collect Count"
              onChange={handleChange}
            />
            <Stack spacing={2}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                disabled={loading}
                onClick={() => {
                  postToLens(formData.title, formData.description, formData.raiseAmt, formData.maxCollectCount);
                  setLoading(true);
                }}
              >
                {!loading ? <span>Submit</span> : <span>Submitting</span>}
              </Button>
              <Button
                fullWidth
                onClick={() => {
                  setFormData({});
                  setOpen(false);
                }}
                color="error"
                variant="contained"
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Modal>
      <Toolbar sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h4">GiveSpace</Typography>
        </Box>
        <Box>

        </Box>
        <Stack direction="row" spacing={3}>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          {currAcc === "" ? (
            <Button
              onClick={connectWallet}
              color="success"
              variant="contained"
              endIcon={<PowerSettingsNew />}
            >
              Connect Wallet
            </Button>
          ) : null}
          <Button color="inherit" component={RouterLink} to="/tree">
              Tree
          </Button>
          {currAcc !== "" && lensProfileId === "" ? (
            <Button
              onClick={() => setConnectModal(true)}
              color="success"
              variant="contained"
            >
              Create Profile
            </Button>
          ) : null}
          {lensProfileId !== "" ? (
            <Stack alignItems="center" spacing={2} direction="row">
              <Typography variant="h5">{tokenBalance || 0} WTR</Typography>
              <IconButton component={RouterLink} to = "/profile">
                <AccountCircleIcon
                  sx={{ color: "white", width: 30, height: 30 }}
                />
              </IconButton>

              <Button
                color="success"
                variant="contained"
                onClick={() => setOpen(true)}
              >
                Add Donation Drive
              </Button>
            </Stack>
          ) : null}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
