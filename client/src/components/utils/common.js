import { ethers, Contract } from "ethers";
import { SEED_CONTRACT_ADDRESS, WATER_CONTRACT_ADDRESS } from "./constants";
import waterABI from './waterABI.json'
import seedABI from './seedABI.json'
export const getSeedContract = () => (
  new Contract(SEED_CONTRACT_ADDRESS, seedABI, getSigner())
)

export const getWaterContract = () => (
  new Contract(WATER_CONTRACT_ADDRESS, waterABI, getSigner())
)

export const getSigner = () => {
  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(ethereum);
  return provider.getSigner();
}