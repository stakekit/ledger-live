import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useFeature } from "@ledgerhq/live-common/featureFlags/index";
import { nftCollectionsStatusByNetworkSelector } from "~/renderer/reducers/settings";
import { NftStatus } from "@ledgerhq/live-nft/types";
import { BlockchainEVM } from "@ledgerhq/live-nft/supported";

export const nftCollectionParser = (
  nftCollection: Record<BlockchainEVM, Record<string, NftStatus>>,
  applyFilterFn: (arg0: [string, NftStatus]) => boolean,
) =>
  Object.values(nftCollection).flatMap(contracts =>
    Object.entries(contracts)
      .filter(applyFilterFn)
      .map(([contract]) => contract),
  );

export function useNftCollectionsStatus(forTx?: boolean) {
  const nftsFromSimplehashFeature = useFeature("nftsFromSimplehash");
  const lldSpamFilteringTx = useFeature("lldSpamFilteringTx");
  const nftCollectionsStatusByNetwork = useSelector(nftCollectionsStatusByNetworkSelector);

  const mayIncludeSpamsInTheList = !!nftsFromSimplehashFeature?.enabled;

  const list = useMemo(() => {
    return nftCollectionParser(nftCollectionsStatusByNetwork, ([_, status]) =>
      mayIncludeSpamsInTheList
        ? !(
            forTx && !lldSpamFilteringTx?.enabled
              ? [NftStatus.whitelisted, NftStatus.spam]
              : [NftStatus.whitelisted]
          ).includes(status)
        : status === NftStatus.blacklisted,
    );
  }, [nftCollectionsStatusByNetwork, mayIncludeSpamsInTheList, forTx, lldSpamFilteringTx]);

  const whitelisted = useMemo(() => {
    return nftCollectionParser(
      nftCollectionsStatusByNetwork,
      ([_, status]) => status === NftStatus.whitelisted,
    );
  }, [nftCollectionsStatusByNetwork]);

  return {
    hiddenNftCollections: list,
    whitelistedNftCollections: whitelisted,
  };
}
