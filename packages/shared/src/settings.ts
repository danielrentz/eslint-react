import memoize from "micro-memoize";
import pm from "picomatch";
import { parse } from "valibot";

import type { CustomComponent, ESLintReactSettings } from "./schemas";
import { ESLintSettingsSchema } from "./schemas";

export interface CustomComponentExpanded extends CustomComponent {
  attributes: {
    name: string;
    as: string;
  }[];
  re: RegExp;
}

export interface ESLintReactSettingsExpanded extends ESLintReactSettings {
  additionalComponents: CustomComponentExpanded[];
}

export function decodeSettings(data: unknown): ESLintReactSettings {
  return parse(ESLintSettingsSchema, data)["react-x"] ?? {};
}

export const expandSettings = memoize((settings: ESLintReactSettings): ESLintReactSettingsExpanded => {
  return {
    ...settings,
    additionalComponents: settings.additionalComponents?.map((component) => ({
      ...component,
      attributes: component.attributes?.map((attr) => ({
        ...attr,
        as: attr.as ?? attr.name,
      })) ?? [],
      re: pm.makeRe(component.name, { fastpaths: true }),
    })) ?? [],
  };
}, { isDeepEqual: false });

export const DEFAULT_ESLINT_REACT_SETTINGS = {
  additionalComponents: [
    {
      name: "Link",
      as: "a",
      attributes: [
        {
          name: "to",
          as: "href",
        },
      ],
    },
  ],
  additionalHooks: {
    useLayoutEffect: [
      "useIsomorphicLayoutEffect",
    ],
  },
  version: "detect",
} as const as ESLintReactSettings;
