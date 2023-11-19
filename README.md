# GlassDAO - A magnifying glass for DAOs

_ETHGlobal Istambul hackathon project_

A platform designed for people to access anonymous reviews of DAOs and view a trustworthy list of their contributors.

## Project Description

GlassDAO is a platform that lets you read anonymous reviews about DAOs and see a reliable list of their contributors. It solves two main issues:

Anonymous Reviews: Posting anonymous reviews about DAOs on centralized apps can be risky because your identity might be revealed. GlassDAO ensures your anonymity, through a ZK solution.
Verifying Contributors: It's hard to verify if someone actually contributed to a DAO and if they're truthful about their involvement. GlassDAO ensures credibility by requiring agreement from both the DAO and the contributor on their role and time period.
Here's how it works:

DAO Flow: DAOs sign up with their ENS domain, providing details like name, sector, creation date, and a brief description. They can then add contributors with their ETH address or ENS, role, and start/end dates.
Contributor Flow: Contributors sign up using their ETH address or ENS. They can share personal info such as name, location, role, and a short bio, or stay anonymous. This won’t affect the anonymous reviews. They will then need to connect their Auro Wallet (with a Mina Protocol address) to ensure anonymity through ZK proofs. After connecting it, they confirm their contribution to the DAO and then will be able to safely review it.
For those considering joining a DAO, GlassDAO is extremely valuable as it allows them to read trustworthy reviews by validated contributors. It can help them make informed decisions about joining a specific DAO.

For DAOs, GlassDAO can also be very helpful, as it allows them to prevent outsiders from posing as contributors and let current members assess the experience of being part of the group, ensuring transparency and motivating like-minded people to join.

**Deployed frontend**: https://glassdao.vercel.app/

**Ethereum Contract on Sepolia**: 0x5FC6dc0C8e0e66b53A19286da6e5F92156454e17

**Mina Contract on Berkeley**: B62qk7VN64ygeCtKDFavBYrofiiRnAR5KbWE6hVY1348k4DzVwcwr6f

**Custom EVE indexer**: https://eve.fly.dev

**Push protocol channel**: GlassDAO
