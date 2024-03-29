# Develop in the Mainnet Locally

1. Make `.env.local` file in the root of this repository.

```bash
NEXT_PUBLIC_FATHOM_SITE_ID=<next_public_fathom_site_id>
NEXT_PUBLIC_MAINTENANCE="false"
```

2. Open your terminal, set up the frontend:

```bash
  git clone https://github.com/carapace-finance/user-interface
  cd user-interface
  npm install
```

3. Run a dev server:

```bash
  npm run dev
```

Open `localhost:3000` in a web browser.

4. Open another terminal, set up contracts

```bash
  git clone https://github.com/carapace-finance/credit-default-swap-contracts
  cd credit-default-swap-contracts
  npm install
  npm run compile
```

5. Use your MetaMask Mnemonic words for the `MNEMONIC_WORDS` env variable.
```
export MNEMONIC_WORDS=<your_metamask_mnemonic_words>
```

6. Run the local forked mainnet in the hardhat network

```bash
npm run node
```

7. Deploy the contracts and set up the initial states
We deploy our contracts to the local mainnet fork, and set up the contract states so that we can test all the transactions. Your MetaMask account in the local node should also have some USDC.  
```bash
  npm run deploy-and-setup:mainnet_forked
```

8. Configure MetaMask & connect to the local mainnet.

```
Network name: Local Hardhat
New RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency symbol: ETH
```

# Develop in the Playground

1. Add some env variables in `.env.local` file.

```bash

```

## Set up/update contracts for the playground

1. Run `npx hardhat export-bytecode` & `npx hardhat export-abi` in `credit-default-swap-contracts` project
2. Copy all files from `/credit-default-swap-contracts/abi` to `/user-interface/src/contracts/playground/abi`
3. Copy `PoolHelper.json`, `AccruedPremiumCalculator.json`, `PoolFactory.json` & `PremiumCalculator.json` from `/credit-default-swap-contracts/artifacts` folder to `/user-interface/src/contracts/playground/artifacts`
4. Copy bytecode for following `.bin` files from `/credit-default-swap-contracts/bytecode` folder and update corresponding `.ts` files in `/user-interface/src/contracts/playground/bytecode` folder:

- `ReferenceLendingPools`,
- `ReferenceLendingPoolsFactory`
- `RiskFactorCalculator`

5. Update the deploy script if necessary
6. Refresh the database and deploy new forks with the updated contracts
