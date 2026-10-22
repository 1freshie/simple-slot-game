import type { SlotConfig } from "./types.js";

export class Slot {
  private config: SlotConfig;

  constructor(config: SlotConfig) {
    this.config = config;
  }
}