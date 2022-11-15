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
export abi and bytecode from the contracts, and copy them into the folders. Make sure you change visibility of functions in the library to `internal` before your export abi and bytecode. 