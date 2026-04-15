import { isValidDate, isValidTime } from "../../src/utilities/dateTime";

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
