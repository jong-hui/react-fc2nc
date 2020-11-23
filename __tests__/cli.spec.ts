import { execSync } from "child_process"
import { join, dirname } from "path"
import { readFileSync, writeFileSync, mkdirSync } from "fs"
const dedent = require("dedent-js")

test("run cli #2506", () => {
  const testFile = join(__dirname, "fixtures", "some path", "some file.tsx")
  const baseContent = dedent(`export const MyComponent = () => {
    return (
      <div>
        myComponent
      </div>
    )
  }
    `)

  mkdirSync(dirname(testFile))
  writeFileSync(testFile, baseContent)
  execSync("node ../../cli.js", {
    cwd: join(__dirname, "fixtures")
  })
  expect(readFileSync(testFile, "utf8")).toMatchInlineSnapshot(`
        "export const MyComponent = function MyComponent() {
          return (
            <div>
              myComponent
            </div>
          )
        }"
    `)
})