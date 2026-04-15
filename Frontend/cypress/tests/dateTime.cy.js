import { isValidDate, isValidTime, toUtcDateString, toDayOfWeekName } from "../../src/utilities/dateTime";

describe("isValidDate", () => {
  it("accepts valid dates", () => {
    expect(isValidDate("2026-01-01")).to.be.true;
    expect(isValidDate("2024-02-29")).to.be.true;
  });

  it("rejects incorrectly formatted dates", () => {
    expect(isValidDate("2026-01-001")).to.be.false;
  });

  it("rejects dates that very obviously don't exist", () => {
    expect(isValidDate("2026-01-50")).to.be.false;
  });

  it("rejects dates that more subtly don't exist", () => {
    expect(isValidDate("2026-02-31")).to.be.false;
    expect(isValidDate("2026-02-29")).to.be.false;
  });

  it("rejects undefined", () => {
    expect(isValidDate(undefined)).to.be.false;
  });
});

describe("isValidTime", () => {
  it("accepts valid times", () => {
    expect(isValidTime("09:00")).to.be.true;
    expect(isValidTime("00:00")).to.be.true;
    expect(isValidTime("23:59")).to.be.true;
  });

  it("rejects incorrectly formatted times", () => {
    expect(isValidTime("003219:03219800")).to.be.false;
  });

  it("rejects invalid hours", () => {
    expect(isValidTime("25:00")).to.be.false;
  });

  it("rejects invalid minutes", () => {
    expect(isValidTime("00:75")).to.be.false;
  });

  it("rejects negative time", () => {
    expect(isValidTime("-05:-75")).to.be.false;
  });

  it("rejects undefined", () => {
    expect(isValidTime(undefined)).to.be.false;
  });
});

describe("toUtcDateString", () => {
  it("formats a UTC date correctly", () => {
    const date = new Date("2026-01-01T09:00:00Z");
    expect(toUtcDateString(date)).to.equal("2026-01-01");
  });

  it("maintains the correct day when local time is offset from UTC", () => {
    const date = new Date("2026-01-01T00:00:00Z");
    expect(toUtcDateString(date)).to.equal("2026-01-01");
  });
});

describe("toDayOfWeekName", () => {
  it("return the correct day of the week", () => {
    const date = new Date("2026-01-01T00:00:00Z");
    expect(toDayOfWeekName(date)).to.equal("Thursday");
  });
});
