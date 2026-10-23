import type { Payout, SlotConfig, SpinResult } from "./types.js";

export class Slot {
  private config: SlotConfig;

  constructor(config: SlotConfig) {
    this.config = config;
  }

  public spin(): SpinResult {
    const positions = this.generatePositions();
    const screen = this.generateScreen(positions);
    const { payouts, totalWin } = this.calculatePayouts(screen);

    const result: SpinResult = {
      positions,
      screen,
      payouts,
      totalWin,
    };

    this.printResult(result);

    return result;
  }

  private generatePositions() {
    return this.config.reels.map((reel) =>
      Math.floor(Math.random() * reel.length),
    );
  }

  private generateScreen(positions: number[]) {
    const { reelsCount, rowsCount, reels } = this.config;
    const screen: number[][] = Array.from({ length: rowsCount }, () =>
      Array(reelsCount).fill(0),
    );

    for (let reelIndex = 0; reelIndex < reelsCount; reelIndex++) {
      const startPosition = positions[reelIndex]!;
      const reel = reels[reelIndex]!;

      for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
        const symbolIndex = (startPosition + rowIndex) % reel.length;
        screen[rowIndex]![reelIndex] = reel[symbolIndex]!;
      }
    }

    return screen;
  }

  private calculatePayouts(screen: number[][]) {
    const payouts: Payout[] = [];
    let totalWin = 0;

    this.config.lines.forEach((line, lineIndex) => {
      let matchCount = 1;
      const firstSymbol = screen[line[0]!]![0];

      for (let reelIndex = 1; reelIndex < this.config.reelsCount; reelIndex++) {
        const rowIndex = line[reelIndex];
        const currentSymbol = screen[rowIndex!]![reelIndex];

        if (currentSymbol === firstSymbol) {
          matchCount++;
        } else {
          break;
        }
      }

      if (matchCount > 0) {
        const winAmount = this.config.symbols[firstSymbol!]![matchCount - 1];
        if (winAmount! > 0) {
          payouts.push({
            lineIndex,
            symbol: firstSymbol!,
            matchCount,
            winAmount: winAmount!,
          });
          totalWin += winAmount!;
        }
      }
    });

    return { payouts, totalWin };
  }

  private printResult(result: SpinResult) {
    console.log("=== SPIN RESULT ===");
    console.log(`Reels positions: [${result.positions.join(", ")}]`);
    console.log("Visible symbols on the screen:");

    result.screen.forEach((row) => {
      console.log(`  [ ${row.join(" | ")} ]`);
    });

    console.log("-------------------------------");
    if (result.payouts.length > 0) {
      console.log("Winning lines:");
      result.payouts.forEach((p) => {
        console.log(
          `  Line ${p.lineIndex}: Symbol ${p.symbol}, Matches ${p.matchCount} -> Win: ${p.winAmount}`,
        );
      });
    } else {
      console.log("No winning lines.");
    }

    console.log(`\nTotal Win: ${result.totalWin}`);
    console.log("===============================\n");
  }
}
