import { describe, expect, it } from "vitest";

import {
  isValidChinaMobile,
  maskChinaMobile,
  parseChinaMobileToE164,
} from "@/lib/phone";

describe("phone utils", () => {
  it("parses valid china mobile to E.164", () => {
    expect(parseChinaMobileToE164("13812345678")).toBe("+8613812345678");
    expect(parseChinaMobileToE164(" 138 1234 5678 ")).toBe("+8613812345678");
  });

  it("rejects invalid china mobile", () => {
    expect(parseChinaMobileToE164("12345")).toBeNull();
    expect(parseChinaMobileToE164("23812345678")).toBeNull();
    expect(parseChinaMobileToE164("")).toBeNull();
  });

  it("validates china mobile", () => {
    expect(isValidChinaMobile("13900001111")).toBe(true);
    expect(isValidChinaMobile("12900001111")).toBe(false);
  });

  it("masks phone for display", () => {
    expect(maskChinaMobile("13812345678")).toBe("138****5678");
    expect(maskChinaMobile("+8613812345678")).toBe("138****5678");
  });
});
