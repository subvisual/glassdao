import { Field, MerkleTree } from "o1js"

export const calculateMerkleRoot = (sigs: Field[]): string => {
  const tree = new MerkleTree(sigs.length);
  tree.fill(sigs);

  return tree.getRoot().toString();
}
