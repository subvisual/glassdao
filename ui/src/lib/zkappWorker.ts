import { Field, Mina, PublicKey, Signature, fetchAccount } from "o1js";

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { Publisher } from "../../../contracts/src/Publisher";
import { stringFromFields } from "./transform";

const state = {
  Publisher: null as null | typeof Publisher,
  zkapp: null as null | Publisher,
  transaction: null as null | Transaction,
};

// ---------------------------------------------------------------------------------------

const functions = {
  setActiveInstanceToBerkeley: async (args: {}) => {
    const Berkeley = Mina.Network(
      "https://proxy.berkeley.minaexplorer.com/graphql"
    );
    console.log("Berkeley Instance Created");
    Mina.setActiveInstance(Berkeley);
  },
  loadContract: async (args: {}) => {
    const { Publisher } = await import(
      "../../../contracts/build/src/Publisher.js"
    );
    state.Publisher = Publisher;
  },
  compileContract: async (args: {}) => {
    await state.Publisher!.compile();
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.Publisher!(publicKey);
  },
  getCurrentMessage: async (args: {}) => {
    const msg = await state.zkapp!.message.get();
    const msgEnd = await state.zkapp!.messageEnd.get();
    const str = stringFromFields([msg, msgEnd]);
    return str;
  },
  publishMessage: async (args: {
    message: string[];
    root: string;
    oracleSignature: string;
  }) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp!.publishMessage(
        Field(args.message[0]),
        Field(args.message[1]),
        Field(args.root),
        Signature.fromBase58(args.oracleSignature)
      );
    });
    state.transaction = transaction;
  },
  getRoot: async (args: {}) => {
    const root = await state.zkapp!.root.get();
    return JSON.stringify(root.toJSON());
  },
  setRoot: async (args: { root: string }) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp!.setRoot(Field(args.root));
    });
    state.transaction = transaction;
  },
  provePublishTransaction: async (args: {}) => {
    await state.transaction!.prove();
  },
  sendPublishTransaction: async (args: {}) => {
    await state.transaction!.sign();
  },
  getTransactionJSON: async (args: {}) => {
    return state.transaction!.toJSON();
  },
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
  id: number;
  fn: WorkerFunctions;
  args: any;
};

export type ZkappWorkerReponse = {
  id: number;
  data: any;
};

if (typeof window !== "undefined") {
  addEventListener(
    "message",
    async (event: MessageEvent<ZkappWorkerRequest>) => {
      const returnData = await functions[event.data.fn](event.data.args);

      const message: ZkappWorkerReponse = {
        id: event.data.id,
        data: returnData,
      };
      postMessage(message);
    }
  );
}

console.log("Web Worker Successfully Initialized.");
