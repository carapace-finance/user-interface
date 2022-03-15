## Develop Locally

Create a Moralis account and server instance: https://docs.moralis.io/getting-started/quick-start

Open your terminal, set up the frontend

```bash
  git clone https://github.com/slime-finance/credit-default-swap-frontend
  cd credit-default-swap-frontend
  npm install
```

Add `.env.local` file

```bash
  MORALIS_APP_ID=<App_ID>
  MORALIS_SERVER_URL=<Server_URL>
  POOL_CONTRACT_ADDRESS_DEV=<Pool_Contract_Address>
  PREM_TOKEN_ADDRESS_DEV=<Prem_Token_Contract_Address>
  COVER_TOKEN_ADDRESS_DEV=<Cover_Token_Contract_Address>
```

Run a dev server

```bash
  npm run dev
```

Open another terminal, set up contracts

```bash
  git clone https://github.com/slime-finance/credit-default-swap-contracts
  cd credit-default-swap-contracts
  npm install
  npm run compile
  npm run node
```

Deploy the contracts

```bash
  npm run deploy:mainnet_forked
```

Open `localhost:3000` in a web browser
