import * as ethers from "ethers";
import * as dotenv from "dotenv";
import * as TBTCVault from "./TBTCVault.json";
import express, { Express, Request, Response } from "express";

dotenv.config();

const provider = new ethers.EtherscanProvider(
  process.env.ETH_NETWORK,
  process.env.ETHERSCAN_TOKEN,
);

const tbtcVaultContract = new ethers.Contract(
  TBTCVault.address,
  TBTCVault.abi,
  provider,
);

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/minterBalances", async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const minters = await (tbtcVaultContract as any).getMinters();

  type minterBalance = {
    address: string;
    balance: string;
  };
  const minterBalances = new Array<minterBalance>();
  for (const minter of minters) {
    const balance = ethers.formatEther(await provider.getBalance(minter));
    minterBalances.push({ address: minter, balance: balance });
  }

  res.send(JSON.stringify(minterBalances));
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
