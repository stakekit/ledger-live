import { getMainAccount, isAccountEmpty } from "@ledgerhq/live-common/account/index";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { openModal } from "~/renderer/actions/modals";
import IconCoins from "~/renderer/icons/Coins";
import { SolanaFamily } from "./types";
import { useHistory } from "react-router";

const AccountHeaderActions: SolanaFamily["accountHeaderManageActions"] = ({ account, source }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const mainAccount = getMainAccount(account);
  const { solanaResources } = mainAccount;
  const history = useHistory();

  const onClick = useCallback(() => {
    if (isAccountEmpty(account)) {
      dispatch(
        openModal("MODAL_NO_FUNDS_STAKE", {
          account,
        }),
      );
    } else {
      history.push({
        pathname: "/platform/stakekit",
        state: {
          yieldId: "solana-sol-native-multivalidator-staking",
          accountId: account.id,
          returnTo:
            account.type === "TokenAccount"
              ? `/account/${account.parentId}/${account.id}`
              : `/account/${account.id}`,
        },
      });
    }
  }, [account, dispatch, source, solanaResources, mainAccount]);

  return [
    {
      key: "Stake",
      onClick: onClick,
      icon: IconCoins,
      label: t("account.stake"),
      event: "button_clicked2",
      eventProperties: {
        button: "stake",
      },
    },
  ];
};

export default AccountHeaderActions;
