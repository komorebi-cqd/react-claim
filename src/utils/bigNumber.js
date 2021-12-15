import BigNumber from "bignumber.js";
BigNumber.set({ toExpPos: 50, precision: 20, toExpNeg: -30 })

export const BN = BigNumber;