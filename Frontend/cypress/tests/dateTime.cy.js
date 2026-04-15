import { isValidDate } from "../../src/utilities/dateTime";

describe("isValidDate", () => {
  it("accepts a valid date", () => {
    expect(isValidDate("2026-01-01")).to.be.true;
  });

  it("rejects incorrectly formatted dates", () => {
    expect(isValidDate("2026-01-001")).to.be.false;
  });

  it("rejects dates that very obviously don't exist", () => {
    expect(isValidDate("2026-01-50")).to.be.false;
  });

  it("rejects dates that more subtly don't exist", () => {
    expect(isValidDate("2026-02-31")).to.be.false;
  });

  it("rejects the empty string", () => {
    expect(isValidDate("")).to.be.false;
  });

  it("rejects undefined", () => {
    expect(isValidDate(undefined)).to.be.false;
  });
});

