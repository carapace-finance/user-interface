// Following interfaces are copied from hardhat-ethers project

export interface LinkReferences {
  [libraryFileName: string]: {
    [libraryName: string]: Array<{ length: number; start: number }>;
  };
}

export interface Artifact {
  _format: string;
  contractName: string;
  sourceName: string;
  abi: any[];
  bytecode: string; // "0x"-prefixed hex string
  deployedBytecode: string; // "0x"-prefixed hex string
  linkReferences: LinkReferences;
  deployedLinkReferences: LinkReferences;
}

export interface Link {
  sourceName: string;
  libraryName: string;
  address: string;
}

// This function is derived from hardhat-ethers project
export function linkBytecode(artifact: Artifact, libraries: Link[]): string {
  let bytecode = artifact.bytecode;

  for (const lib of libraries) {
    const sourceName = lib.sourceName;
    const libraryName = lib.libraryName;
    const address = lib.address;
    if (
      sourceName === undefined ||
      libraryName === undefined ||
      address === undefined
    ) {
      continue;
    }

    const linkReferences = artifact.linkReferences[sourceName][libraryName];

    for (const { start, length } of linkReferences) {
      bytecode =
        bytecode.substr(0, 2 + start * 2) +
        address.substr(2) +
        bytecode.substr(2 + (start + length) * 2);
    }
  }

  return bytecode;
}
