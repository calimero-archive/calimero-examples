import * as nearAPI from "near-api-js";

/**
 * e.g. amount: 10000000000000000000000000 => 10
 * @param amount yoctoNear
 * @returns NEAR
 */
export function parseYoctoToNear(amount: string) {
  return nearAPI.utils.format.formatNearAmount(amount);
}

/**
 * e.g. amount: 1 => 1000000000000000000000000
 * @param amount NEAR
 * @returns yoctoNear
 */
export function parseNearToYocto(amount: string) {
  return nearAPI.utils.format.parseNearAmount(amount);
}
