import { ethers } from 'ethers';
import LensHub from '../LensProtocol/lens-hub-contract-abi.json'

export const getLensHub = (signer) => (
    new ethers.Contract(
        '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82',
        LensHub,
        signer)
);