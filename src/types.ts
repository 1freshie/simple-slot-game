export interface SlotConfig {
  reelsCount: number;
  rowsCount: number;
  symbols: Record<number, number[]>;
  lines: number[][];
  reels: number[][];
}

export interface Payout {
  lineIndex: number;
  symbol: number;
  matchCount: number;
  winAmount: number;
}

export interface SpinResult {
  positions: number[];
  screen: number[][];
  payouts: Payout[];
  totalWin: number;
}
