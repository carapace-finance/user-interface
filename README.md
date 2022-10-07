## Develop Locally

Open your terminal, set up the frontend:

```bash
  git clone https://github.com/carapace-finance/user-interface
  cd user-interface
  npm install
```

I encourage you to declare environment variables in your `.bash_profile`(or .zprofile and others) to avoid sharing your credentials accidentally. You can also make `.env` file in the root of this repository although I do not recommend it.

```bash
  POOL_CONTRACT_ADDRESS_DEV=<Pool_Contract_Address>
  PREM_TOKEN_ADDRESS_DEV=<Prem_Token_Contract_Address>
  COVER_TOKEN_ADDRESS_DEV=<Cover_Token_Contract_Address>
```

Run a dev server:

```bash
  npm run dev
```

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

Open `localhost:3000` in a web browser
