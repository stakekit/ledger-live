import React from "react";
import Box from "~/renderer/components/Box";
import MemoValueField from "./MemoValueField";
import { CosmosFamily } from "./types";

const Root: NonNullable<CosmosFamily["sendRecipientFields"]>["component"] = props => {
  return (
    <Box flow={1}>
      <MemoValueField {...props} />
    </Box>
  );
};
export default {
  component: Root,
  // Transaction is used here to prevent user to forward
  // If he format a memo incorrectly
  fields: ["memo", "transaction"],
};
