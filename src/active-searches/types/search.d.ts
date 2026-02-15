/**
 * To be able to check the Interface validaty in the activeSearches' service,
 * we must build it to a validation schema. This is made by the `ts-interface-builder`
 * command tool (installed in dev-dependencies) :
 * ```sh
 * bunx ts-interface-builder src/active-searches/types/search.d.ts
 * ```
 *
 * Then, you can use `ts-interface-checker` to validator a given object:
 * ```ts
 * import type { SearchPredicates } from 'search.d.ts';
 * import SearchPredicatesSchema from './types/search.d-ti';
 * import { createCheckers } from 'ts-interface-checker';
 *
 * const predicatesChecker = createCheckers(SearchPredicatesSchema).SearchPredicates;
 * const is_valid = predicatesChecher.test(...);
 * ```
 */
export interface SearchPredicates {
  date: Date;
}
