import { getServerInfos, getTransactions, GetTransactionsOptions } from "../network";
import type { XrplOperation } from "../network/types";
import { XrpMemo, XrpOperation } from "../types";
import { RIPPLE_EPOCH } from "./utils";

type Order = "asc" | "desc";
/**
 * Returns list of "Payment" Operations associated to an account.
 * @param address Account address
 * @param minHeight retrieve operations from a specific block height until top most (inclusive)
 *  if not provided, it will start from the oldest possible history.
 * The result is not guaranteed to contain all operations until top height (it depends of the underlying explorer),
 * so you might need to call this function multiple times to get all operations.
 * @param order whether to return operations from the top block or from the oldest block
 *   it defaults to "desc" (newest first)
 *   it doesn't control the order of the operations in the result list.
 *   this parameter is added as a workaround for the issue LIVE-16705
 * @returns a list of operations is descending order and a token to be used for pagination
 */
export async function listOperations(
  address: string,
  {
    limit,
    minHeight,
    token,
    order,
  }: {
    // pagination:
    limit?: number;
    token?: string;
    order?: Order;
    // filters:
    minHeight?: number;
  },
): Promise<[XrpOperation[], string]> {
  const serverInfo = await getServerInfos();
  const ledgers = serverInfo.info.complete_ledgers.split("-");
  const minLedgerVersion = Number(ledgers[0]);

  // by default the explorer queries the transactions in descending order (newest first)
  let forward = false;
  if (order && order === "asc") {
    forward = true;
  }

  let options: GetTransactionsOptions = {
    forward: forward,
  };

  if (limit) {
    options = {
      ...options,
      limit,
    };
  }

  if (token) {
    options = {
      ...options,
      marker: JSON.parse(token),
    };
  }

  if (minHeight !== undefined) {
    options = {
      ...options,
      // if there is no ops, it might be after a clear and we prefer to pull from the oldest possible history
      ledger_index_min: Math.max(minHeight, minLedgerVersion),
    };
  }

  async function getPaymentTransactions(
    address: string,
    options: GetTransactionsOptions,
  ): Promise<[boolean, GetTransactionsOptions, XrplOperation[]]> {
    const response = await getTransactions(address, options);
    const txs = response.transactions;
    const marker = response.marker;
    // Filter out the transactions that are not "Payment" type because the filter on "tx_type" of the node RPC is not working as expected.
    const paymentTxs = txs.filter(tx => tx.tx_json.TransactionType === "Payment");
    const shortage = (options.limit && txs.length < options.limit) || false;
    const nextOptions = { ...options };
    if (marker) {
      nextOptions.marker = marker;
      if (nextOptions.limit) nextOptions.limit -= paymentTxs.length;
    }
    return [shortage, nextOptions, paymentTxs];
  }

  let [txShortage, nextOptions, transactions] = await getPaymentTransactions(address, options);
  const isEnough = () => txShortage || (limit && transactions.length >= limit);
  // We need to call the node RPC multiple times to get the desired number of transactions by the limiter.
  while (nextOptions.limit && !isEnough()) {
    const [newTxShortage, newNextOptions, newTransactions] = await getPaymentTransactions(
      address,
      nextOptions,
    );
    txShortage = newTxShortage;
    nextOptions = newNextOptions;
    transactions = transactions.concat(newTransactions);
  }

  // the order is reversed so that the results are always sorted by newest tx first element of the list
  if (order === "asc") transactions.reverse();

  // the next index to start the pagination from
  const next = nextOptions.marker ? JSON.stringify(nextOptions.marker) : "";
  return [transactions.map(convertToCoreOperation(address)), next];
}

const convertToCoreOperation =
  (address: string) =>
  (operation: XrplOperation): XrpOperation => {
    const {
      ledger_hash,
      hash,
      close_time_iso,
      meta: { delivered_amount },
      tx_json: {
        TransactionType,
        Fee,
        date,
        Account,
        Destination,
        DestinationTag,
        Sequence,
        Memos,
        ledger_index,
      },
    } = operation;

    const type = Account === address ? "OUT" : "IN";
    let value =
      delivered_amount && typeof delivered_amount === "string"
        ? BigInt(delivered_amount)
        : BigInt(0);

    const fee = BigInt(Fee);
    if (type === "OUT") {
      if (!Number.isNaN(fee)) {
        value = value + fee;
      }
    }

    const toEpochDate = (RIPPLE_EPOCH + date) * 1000;

    let details = {};
    if (DestinationTag) {
      details = {
        ...details,
        destinationTag: DestinationTag,
      };
    }

    const memos: XrpMemo[] | undefined = Memos?.map(m => {
      const memo = {
        data: m?.Memo?.MemoData,
        format: m?.Memo?.MemoFormat,
        type: m?.Memo?.MemoType,
      };
      // Remove `undefined` properties
      return Object.fromEntries(Object.entries(memo).filter(([, v]) => v));
    });
    if (memos) {
      details = {
        ...details,
        memos,
      };
    }

    let op: XrpOperation = {
      blockTime: new Date(close_time_iso),
      blockHash: ledger_hash,
      hash,
      address,
      type: TransactionType,
      simpleType: type,
      value,
      fee,
      blockHeight: ledger_index,
      senders: [Account],
      recipients: [Destination],
      date: new Date(toEpochDate),
      transactionSequenceNumber: Sequence,
    };

    if (Object.keys(details).length != 0) {
      op = {
        ...op,
        details,
      };
    }

    return op;
  };
