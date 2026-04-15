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

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const isValidDate = (strDate) => {
  if (!ISO_DATE.test(strDate)) return false;
  const [year, month, day] = strDate.split('-').map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  return (utcDate.getUTCFullYear() === year &&
    utcDate.getUTCMonth() + 1 === month &&
    utcDate.getUTCDate() === day
  );
};
