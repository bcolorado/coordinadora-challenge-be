import { v4 as uuidv4 } from "uuid";

export class TrackingNumberGenerator {
  static generate(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = uuidv4().split("-")[0]!.toUpperCase();
    return `COORD-${timestamp}-${random}`;
  }
}
