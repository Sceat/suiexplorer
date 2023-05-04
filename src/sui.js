import { JsonRpcProvider, Connection } from '@mysten/sui.js';
import BigNumber from 'bignumber.js';

const provider = new JsonRpcProvider(
  new Connection({ fullnode: 'https://fullnode.mainnet.sui.io:443' })
);

const to_sui = mists =>
  new BigNumber(mists.toString()).dividedBy(1e9).toString();

export async function get_transaction(hash) {
  console.log('get_transaction', hash);
  const {
    digest,
    checkpoint,
    transaction: {
      data: {
        transaction: { kind },
        sender,
      },
    },
    balanceChanges,
    effects: {
      status: { status },
      gasUsed: { computationCost, storageCost, storageRebate },
    },
  } = await provider.getTransactionBlock({
    digest: hash,
    options: {
      showEffects: true,
      showInput: true,
      showObjectChanges: true,
      showBalanceChanges: true,
    },
  });

  if (
    kind === 'ProgrammableTransaction' &&
    status === 'success' &&
    balanceChanges
  ) {
    return {
      from: sender,
      hash: digest,
      height: +checkpoint,
      fee: to_sui(
        BigInt(computationCost) + BigInt(storageCost) - BigInt(storageRebate)
      ),
      tx: balanceChanges
        .filter(
          ({ coinType, amount: change_amount }) =>
            coinType === '0x2::sui::SUI' &&
            new BigNumber(change_amount).isGreaterThan(0)
        )
        .map(({ owner: { AddressOwner }, amount }) => ({
          to: AddressOwner,
          amount: to_sui(amount),
        })),
    };
  }

  return { error: 'TX not found, or no changes in SUI balance' };
}
