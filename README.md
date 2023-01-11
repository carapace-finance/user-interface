## Develop Locally

Open your terminal, set up the frontend:

```bash
  git clone https://github.com/carapace-finance/user-interface
  cd user-interface
  npm install
```

Make `.env.local` file in the root of this repository.

```bash
TENDERLY_ACCESS_KEY=<tenderly_access_key>
NEXT_PUBLIC_TENDERLY_PROJECT=<next_public_tenderly_project>
NEXT_PUBLIC_TENDERLY_USER=<next_public_tenderly_user>
UPSTASH_REDIS_REST_URL=<Upstash Redis Rest Url>;
UPSTASH_REDIS_REST_TOKEN=<Token to access Redis Rest APIs>
```

Run a dev server:

```bash
  npm run dev
```

Open `localhost:3000` in a web browser.

Open another terminal, set up contracts

```bash
  git clone https://github.com/carapace-finance/credit-default-swap-contracts
  cd credit-default-swap-contracts
  npm install
  npm run compile
  npm run node
```

Deploy the contracts

```bash
  npm run deploy:mainnet_forked
```

# Set up contracts for the forked mainnet

1. Run `npx hardhat export-bytecode` & `npx hardhat export-abi` in `credit-default-swap-contracts` project
2. Copy all files from `/credit-default-swap-contracts/abi` to `/user-interface/src/contracts/forked/abi`
3. Copy `PoolHelper.json`, `AccruedPremiumCalculator.json`, `PoolFactory.json` & `PremiumCalculator.json` from `/credit-default-swap-contracts/artifacts` folder to `/user-interface/src/contracts/forked/artifacts`
4. Copy bytecode for following `.bin` files from `/credit-default-swap-contracts/bytecode` folder and update corresponding `.ts` files in `/user-interface/src/contracts/forked/bytecode` folder:

- `ReferenceLendingPools`,
- `ReferenceLendingPoolsFactory`
- `RiskFactorCalculator`
