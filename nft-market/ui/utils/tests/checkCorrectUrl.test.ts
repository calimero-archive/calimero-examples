import checkCorrectUrl from "./checkCorrectUrl";

describe("Validate if provided string is url", () => {
  it("should return true if the value is url", () => {
    expect(checkCorrectUrl("123456")).toBeTruthy();
  });
});

describe("Validate if provided string is url", () => {
  it("should return true if the value is url", () => {
    expect(checkCorrectUrl("https://picsum.photos/200/300")).toBeTruthy();
  });
});

describe("Validate if provided string is url", () => {
  it("should return true if the value is url", () => {
    expect(checkCorrectUrl("http://picsum.photos/200/300")).toBeTruthy();
  });
});
