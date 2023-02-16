# Develop in the Mainnet Locally

1. Make `.env.local` file in the root of this repository.

```bash
NEXT_PUBLIC_FATHOM_SITE_ID=<next_public_fathom_site_id>
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

5. Run the local forked mainnet in the hardhat network

```bash
npm run node
```

6. Deploy the contracts

```bash
  npm run deploy:mainnet_forked
```

6. Connect to the local mainnet fork through MetaMask.

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
