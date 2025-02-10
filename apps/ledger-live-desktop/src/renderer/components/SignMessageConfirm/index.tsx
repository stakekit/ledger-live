import styled from "styled-components";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { Account, AccountLike, AnyMessage, MessageProperties } from "@ledgerhq/types-live";
import { getMainAccount } from "@ledgerhq/live-common/account/index";
import { Device } from "@ledgerhq/live-common/hw/actions/types";
import { DeviceTransactionField } from "@ledgerhq/live-common/transaction/index";
import { renderVerifyUnwrapped } from "~/renderer/components/DeviceAction/rendering";
import SignMessageConfirmField from "./SignMessageConfirmField";
import Spinner from "~/renderer/components/BigSpinner";
import useTheme from "~/renderer/hooks/useTheme";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import { getLLDCoinFamily } from "~/renderer/families";
import FormattedVal from "~/renderer/components/FormattedVal";

const FieldText = styled(Text).attrs(() => ({
  ml: 1,
  ff: "Inter|Medium",
  color: "palette.text.shade80",
  fontSize: 3,
}))``;

export type FieldComponentProps = {
  account: Account;
  field: DeviceTransactionField;
  contractAddress?: string;
};

export type FieldComponent = React.ComponentType<FieldComponentProps>;

const TextField = ({ field, account, contractAddress }: FieldComponentProps) => {
  const isPropertyAmount = field.label.includes("Amount") && contractAddress;

  const unit = isPropertyAmount
    ? account.subAccounts?.find(a => a.token.contractAddress === contractAddress)?.token.units[0]
    : undefined;

  return field.type === "text" ? (
    <SignMessageConfirmField label={field.label}>
      <FieldText>
        {isPropertyAmount ? (
          <>
            <FormattedVal
              color={"palette.neutral.c100"}
              val={Number(field.value)}
              unit={unit}
              fontSize={3}
              disableRounding
              alwaysShowValue
              showCode
              inline
            />
          </>
        ) : (
          field.value
        )}
      </FieldText>
    </SignMessageConfirmField>
  ) : null;
};

const Container = styled(Box).attrs(() => ({
  alignItems: "center",
  fontSize: 4,
  pb: 4,
}))``;

type Props = {
  device: Device;
  account: AccountLike;
  parentAccount: Account | null | undefined;
  signMessageRequested: AnyMessage;
};

const SignMessageConfirm = ({ device, account, parentAccount, signMessageRequested }: Props) => {
  const type = useTheme().colors.palette.type;
  const { t } = useTranslation();
  const mainAccount = getMainAccount(account, parentAccount);
  const { currency } = mainAccount;
  const [messageFields, setMessageFields] = useState<MessageProperties | null>(null);

  useEffect(() => {
    if (signMessageRequested.standard === "EIP712") {
      const specific = getLLDCoinFamily(currency.family);
      specific?.message?.getMessageProperties(signMessageRequested).then(setMessageFields);
    }
  }, [currency, mainAccount, signMessageRequested]);

  if (!device) return null;

  let fields: DeviceTransactionField[] = [];
  if (messageFields) {
    fields = messageFields.map(field => ({
      ...field,
      type: "text",
      value: Array.isArray(field.value) ? field.value.join(",\n") : field.value,
    }));
  } else {
    if (signMessageRequested.standard === "EIP712") {
      fields.push({
        type: "text",
        label: t("SignMessageConfirm.domainHash"),
        value: signMessageRequested.domainHash,
      });

      fields.push({
        type: "text",
        label: t("SignMessageConfirm.messageHash"),
        value: signMessageRequested.hashStruct,
      });
    }
  }

  return (
    <Container>
      {!signMessageRequested.message ? (
        <Spinner size={30} />
      ) : (
        <>
          <Box style={{ width: "100%", rowGap: 7 }} mb={20}>
            {fields.map((field, i) => {
              const contractAddress = fields?.find(f => f.label === "Token") as { value: string };

              return (
                <TextField
                  key={i}
                  field={field}
                  account={mainAccount}
                  contractAddress={contractAddress?.value}
                />
              );
            })}
          </Box>

          {renderVerifyUnwrapped({ modelId: device.modelId, type })}
        </>
      )}
    </Container>
  );
};

export default SignMessageConfirm;
