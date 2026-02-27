import { add } from "../src/add";

it("adds 10 + 5 to equal 15", () => {
  expect(add(10, 5)).toBe(15);
});
