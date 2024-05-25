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

app.get("/getMinters", async (req: Request, res: Response) => {
  console.log(`[server] +getMinters`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const minters = await (tbtcVaultContract as any).getMinters();

  type minterInfo = {
    address: string;
    balance: string;
  };
  const minterInfos = new Array<minterInfo>();
  const response = { minters: minterInfos };
  for (const minter of minters) {
    const balance = ethers.formatEther(await provider.getBalance(minter));
    minterInfos.push({ address: minter, balance: balance });
  }

  const stringifiedResponse = JSON.stringify(response);
  res.setHeader("Content-Type", "application/json");
  console.log(`\treturning ${stringifiedResponse}`);
  res.send(stringifiedResponse);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
