// @ts-ignore
import Client from "mina-signer";
const client = new Client({ network: "testnet" });

export const signaturesMock = [
  "226737914325023845218636111057251780156036265551267936159326931770235510744",
  "226737914325023845218636111057251780156036265551267936159326931234234510744",
  "123737914325023845218636111057251780156036265551267936159326931770235510744",
  "16800499555793692526894213099480938382511091338422244196866733508727794867668"
];

export const ORACLE_KEYS = {
  privateKey: "EKE8qeVmkTGaHPzWmswuNnL6ttQRr6jDrFtpPV5HLvNEmL2ipxqz",
  publicKey: "B62qngFvCtF7K2PVunsmwpne5VhiADeh6XzqZqHzMEp5THGTGc8x6mZ",
};

// Implement toJSON for BigInt so we can include values in response
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export default function handler(req: any, res: any) {
  const asBigInts = signaturesMock.map((item) => BigInt(item));

  console.log(asBigInts);

  const signature = client.signFields(asBigInts, ORACLE_KEYS.privateKey);

  res.status(200).json({
    data: signaturesMock,
    signature: signature.signature,
    publicKey: signature.publicKey,
  });
}
