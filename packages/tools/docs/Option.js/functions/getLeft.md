[**@eslint-react/tools**](../../README.md)

***

[@eslint-react/tools](../../README.md) / [./Option.js](../README.md) / getLeft

# Function: getLeft()

> **getLeft**\<`R`, `L`\>(`self`): [`Option`](../type-aliases/Option.md)\<`L`\>

Converts a `Either` to an `Option` discarding the value.

## Type Parameters

• **R**

• **L**

## Parameters

### self

[`Either`](../../Either.js/type-aliases/Either.md)\<`R`, `L`\>

## Returns

[`Option`](../type-aliases/Option.md)\<`L`\>

## Example

```ts
import { Option, Either } from "effect"

assert.deepStrictEqual(Option.getLeft(Either.right("ok")), Option.none())
assert.deepStrictEqual(Option.getLeft(Either.left("a")), Option.some("a"))
```

## Since

2.0.0
