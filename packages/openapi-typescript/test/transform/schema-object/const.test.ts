import { fileURLToPath } from "node:url";
import { astToString } from "../../../src/lib/ts.js";
import transformSchemaObject from "../../../src/transform/schema-object.js";
import { DEFAULT_CTX, type TestCase } from "../../test-helpers.js";

const DEFAULT_OPTIONS = {
  path: "#/components/schemas/schema-object",
  ctx: { ...DEFAULT_CTX },
};

describe("transformSchemaObject > const", () => {
  const tests: TestCase[] = [
    [
      "basic",
      {
        given: { type: "boolean", const: true },
        want: "true",
        // options: DEFAULT_OPTIONS,
      },
    ],
    [
      "ref with const",
      {
        given: { $ref: "#/components/schemas/some-ref" , const: true },
        want: "true",
        // options: DEFAULT_OPTIONS,
      },
    ],
  ];

  for (const [testName, { given, want, options = DEFAULT_OPTIONS, ci }] of tests) {
    test.skipIf(ci?.skipIf)(
      testName,
      async () => {
        const result = astToString(transformSchemaObject(given, options));
        if (want instanceof URL) {
          expect(result).toMatchFileSnapshot(fileURLToPath(want));
        } else {
          expect(result).toBe(`${want}\n`);
        }
      },
      ci?.timeout,
    );
  }
});
