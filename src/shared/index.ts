// Barrel for `@vip/shared`. Consumers should import the specific
// sub-paths (`@vip/shared/format`, `@vip/shared/types/order`) rather
// than this barrel, to keep the dependency graph explicit and
// tree-shakeable.

export * from "./format";
export * from "./types/order";
export * from "./types/category";
export * from "./types/address";
