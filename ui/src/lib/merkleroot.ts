import { Field, MerkleTree, MerkleWitness } from "o1js";

const signatures: Field[] = [
  Field(
    "226737914325023845218636111057251780156036265551267936159326931770235510744"
  ),
  Field(
    "226737914325023845218636111057251780156036265551267936159326931234234510744"
  ),
  Field(
    "123737914325023845218636111057251780156036265551267936159326931770235510744"
  ),
  Field(
    "16800499555793692526894213099480938382511091338422244196866733508727794867668"
  ),
];

class MyMerkleWitness extends MerkleWitness(signatures.length) { }

export const calculateMerkleRoot = (sigs: Field[]): string => {
  const tree = createTree(sigs);

  return tree.getRoot().toString();
};

export const createTree = (sigs: Field[]): MerkleTree => {
  const tree = new MerkleTree(sigs.length);
  tree.fill(sigs);

  return tree;
};

export const getRootFromWitness = (
  tree: MerkleTree,
  pos: bigint,
  sig: Field
): string => {
  const witness = tree.getWitness(pos);
  const circuitWitness = new MyMerkleWitness(witness);
  console.log(sig);
  return circuitWitness.calculateRoot(sig).toString();
};
