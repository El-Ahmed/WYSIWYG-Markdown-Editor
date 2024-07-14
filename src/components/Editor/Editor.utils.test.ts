import { expect, test } from "vitest";
import { countHeadingHashes } from "./Editor.utils";

test("count hashes", () => {
  expect(countHeadingHashes("### h")).toBe(3);
});

test("count hashes with multiple spaces", () => {
  expect(countHeadingHashes("###  h")).toBe(0);
});

test("count hashes in the middle", () => {
  expect(countHeadingHashes("a ### h")).toBe(0);
});

test("count hashes with no text", () => {
  expect(countHeadingHashes("### ")).toBe(0);
});
