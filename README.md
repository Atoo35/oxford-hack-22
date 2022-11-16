# GiveSpace
## A social donation platform built on Lens Protocol that brings together donors and NGOs to augment impact through harnessing web3 innovation.

# Inspiration
Having been in the blockchain and web3 space for a while, we understood that blockchain technology can do much more than enable people to degen yield farm: It can be harnessed to create better infrastructure for social good too.


# Problems
In the donation space right now, the impact is limited potentially due to:

- No central platform bringing donors and different NGOs together
- Lack of access to an easily-verifiable proof of donation to signal support for cause (proof-of-support) and general social consciousness (proof-of-reputation)
- Limited demographic reach since only those who want to do good will donate, resulting in limited impact


# Opportunities - Web3 and Lens Protocol

## Web3
1. **Composability** Third-party dapps can easily plug into GiveSpace. Potential to create **ecosystem** for impact
2. **Instant verifiability by third parties** Use of blockchain technology: data transparency and immutability
3. **Ability to make payment in crypto** Time and Cost-Efficiency: Bring donors and NGOs from all over the world together efficiently without much transaction delay and without costly transfer fees. Removes potentially corrupt intermediaries: Allows donations to reach NGOs in countries with broken legal infrastructure

## Lens Protocol
1. **Social media platform** Amplify interaction between different stakeholders (donors and NGOs) to augment reach and impact (eg. using mirror publication functionality to reach other users in one's social network who probably care for the same cause as well)
2. **Ease of bootstrapping** GiveSpace only has to onboard NGOs since potential donors are already on Lens Protocol infrastructure


# GiveSpace - What it does
## Core Functionalities

- NGOs to **post donation drive as Lens Publication**, Lens users to **use collectNFT module to donate**.
- Publication collected to serve as an **immutable track record of the user’s impact footprint on web3: PROOF OF SUPPORT for specific causes**
- Users can **mirror publications of donation drives** they care about and **reach others in their social network who probably care as well** (Harness the power of social media)
- Proof-of-support are **easily verifiable by aligned third-party stakeholders** (eg. companies emphasizing corporate social responsibility) to **enable incentivisation possibilities**
- Donations provide $WATER for SEED NFT to allow it to grow (gamification → intrinsic motivation). **SEED NFT symbolises PROOF OF REPUTATION for general social consciousness → enable incentivisation possibilities** (as discussed)

## Note
Distinction to be made between:
1. **Proof-of-Support** (for specific causes) and **Proof-of-Reputation** (for general social consciousness)
2. **Extrinsic motivation** (incentivisation possibility through collaboration with aligned third-party stakeholders) and Intrinsic motivation ($Watering SEED: Element of fun embedded in the user journey)

The utility of the non-tradable $WATER tokens is limited currently, but there's potential for harnessing this for incentivisation when incorporated into the user journey of the NGOs as well to, for example, incentivise transparency and accountability in the post-donation stage.

How we built it
Client: Built the frontend using ReactJs and MUI. Used lens protocol graphql apis to talk to it and ether.js for interacting with the smart contracts. Blockchain: Solidity to deploy 2 contracts on polygon
