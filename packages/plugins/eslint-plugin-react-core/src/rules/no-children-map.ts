import { isChildrenMap } from "@eslint-react/core";
import { getPragmaFromContext } from "@eslint-react/jsx";
import type { ESLintUtils } from "@typescript-eslint/utils";
import type { ConstantCase } from "string-ts";

import { createRule } from "../utils";

export const RULE_NAME = "no-children-map";

export type MessageID = ConstantCase<typeof RULE_NAME>;

export default createRule<[], MessageID>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description: "disallow 'Children.map'",
      recommended: "recommended",
      requiresTypeChecking: false,
    },
    schema: [],
    messages: {
      NO_CHILDREN_MAP: "Using 'Children.map' is uncommon and can lead to fragile code. Use alternatives instead.",
    },
  },
  defaultOptions: [],
  create(context) {
    const pragma = getPragmaFromContext(context);

    return {
      MemberExpression(node) {
        if (isChildrenMap(node, context, pragma)) {
          context.report({
            messageId: "NO_CHILDREN_MAP",
            node: node.property,
          });
        }
      },
    };
  },
}) satisfies ESLintUtils.RuleModule<MessageID>;
