Front-end redesign
![screenshot](https://mediabuidlguidl.vercel.app/thumbnail.png)

# 📺 BG Media Cohort

We're running an experiment to fund focused, high-leverage open-source work by providing streams to builders rewarding them for their ongoing contributions to BuidlGuidl and the Ethereum Ecosystem.

Our emphasis is on quality over quantity, striving for well-crafted products. Our approach embraces iteration, refining our builds while fostering a culture of continuous learning and improvement.

This initiative is made possible by BuidlGuidl!

Read more at the [F.A.Q](https://media.buidlguidl.com/faq)

---

## Development

- [Requirements](#requirements)
- [Quickstart](#Quickstart)
- [Deploying your Smart Contracts to a Live Network](#Deploying-your-Smart-Contracts-to-a-live-network)
- [Deploying your NextJS App](#Deploying-your-NextJS-App)
- [Disabling Type & Linting Error Checks](#Disabling-type-and-linting-error-checks)
  - [Disabling commit checks](#Disabling-commit-checks)
  - [Deploying to Vercel without any checks](#Deploying-to-Vercel-without-any-checks)
  - [Disabling Github Workflow](#Disabling-Github-Workflow)

## Requirements

Before you begin, you need to install the following tools:

- [Node (v18 LTS)](https://nodejs.org/en/download/)
- [Yarn (v1.x)](https://classic.yarnpkg.com/en/docs/install/)
- [Git](https://git-scm.com/downloads)

**Indexer**

We are using Ponder for indexing cohorts events (adding builders, withdrawals, etc). Check out the [BG Ponder instance](https://github.com/BuidlGuidl/bg-ponder-indexer) for more information.

You have 3 options:

1. Run your own Ponder instance (configure the URL in `packages/nextjs/_app.tsx`)
2. Use the BG Ponder instance (make a [PR](https://github.com/BuidlGuidl/bg-ponder-indexer) with your cohorts contract address)
3. Rollback to fetching events with SE-2 hooks (check out PRs [#6](https://github.com/BuidlGuidl/media.buidlguidl.com/pull/6) and [#7](https://github.com/BuidlGuidl/media.buidlguidl.com/pull/7))

## Quickstart

To get started follow the steps below:

1. Clone/Fork this repo & install dependencies

```
git clone https://github.com/buidlguidl/.git
cd media.buidlguidl.com
yarn install
```

2. Start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`.

---

If you want to test the contract locally, you can do so by following steps 3 and 4.

Remember to tweak the app config in `packages/nextjs/scaffold.config.ts`:

- Point it to the local network (`chains.hardhat`)
- Update the contracts fromBlock to `0`

3. Run a local network on a second terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.js`.

4. On a third terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

## Deploying your Smart Contracts to a Live Network

Once you are ready to deploy your smart contracts, there are a few things you need to adjust.

1. Select the network

By default, `yarn deploy` will deploy the contract to the local network. You can change the defaultNetwork in `packages/hardhat/hardhat.config.js.` You could also simply run `yarn deploy --network target_network` to deploy to another network.

Check the `hardhat.config.js` for the networks that are pre-configured. You can also add other network settings to the `hardhat.config.js file`. Here are the [Alchemy docs](https://docs.alchemy.com/docs/how-to-add-alchemy-rpc-endpoints-to-metamask) for information on specific networks.

Example: To deploy the contract to the Sepolia network, run the command below:

```
yarn deploy --network sepolia
```

2. Generate a new account or add one to deploy the contract(s) from. Additionally you will need to add your Alchemy API key. Rename `.env.example` to `.env` and fill the required keys.

```
ALCHEMY_API_KEY="",
DEPLOYER_PRIVATE_KEY=""
```

The deployer account is the account that will deploy your contracts. Additionally, the deployer account will be used to execute any function calls that are part of your deployment script.

You can generate a random account / private key with `yarn generate` or add the private key of your crypto wallet. `yarn generate` will create a random account and add the DEPLOYER_PRIVATE_KEY to the .env file. You can check the generated account with `yarn account`.

3. Deploy your smart contract(s)

Run the command below to deploy the smart contract to the target network. Make sure to have some funds in your deployer account to pay for the transaction.

```
yarn deploy --network network_name
```

4. Verify your smart contract

You can verify your smart contract on Etherscan by running:

```
yarn verify --network network_name
```

## Deploying your NextJS App

Run `yarn vercel` and follow the steps to deploy to Vercel. Once you log in (email, github, etc), the default options should work. It'll give you a public URL.

If you want to redeploy to the same production URL you can run `yarn vercel --prod`. If you omit the `--prod` flag it will deploy it to a preview/test URL.

**Make sure your `packages/nextjs/scaffold.config.ts` file has the values you need.**

**Hint**: We recommend connecting the project GitHub repo to Vercel so you the gets automatically deployed when pushing to `main`

## Disabling type and linting error checks

> **Hint**
> Typescript helps you catch errors at compile time, which can save time and improve code quality, but can be challenging for those who are new to the language or who are used to the more dynamic nature of JavaScript. Below are the steps to disable type & lint check at different levels

### Disabling commit checks

We run `pre-commit` [git hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) which lints the staged files and don't let you commit if there is an linting error.

To disable this, go to `.husky/pre-commit` file and comment out `yarn lint-staged --verbose`

```diff
- yarn lint-staged --verbose
+ # yarn lint-staged --verbose
```

### Deploying to Vercel without any checks

Vercel by default runs types and lint checks while developing `build` and deployment fails if there is a types or lint error.

To ignore types and lint error checks while deploying, use :

```shell
yarn vercel:yolo
```

### Disabling Github Workflow

We have github workflow setup checkout `.github/workflows/lint.yaml` which runs types and lint error checks every time code is **pushed** to `main` branch or **pull request** is made to `main` branch

To disable it, **delete `.github` directory**
