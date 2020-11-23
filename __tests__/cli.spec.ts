import { execSync } from "child_process"
import { join, dirname } from "path"
import { readFileSync, writeFileSync, mkdirSync } from "fs"
const dedent = require("dedent-js")

test("run cli #2506", () => {
  const testFile = join(__dirname, "fixtures", "some path", "SomeComponent.tsx")
  const baseContent = dedent(`export const SomeComponent: React.FC<{}> = () => {
    return (
      <div>
        myComponent
      </div>
    )
  }
    `)

  execSync("rm -rf \"./fixtures/some path\"")
  mkdirSync(dirname(testFile))
  writeFileSync(testFile, baseContent)
  execSync("node ../../cli.js", {
    cwd: join(__dirname, "fixtures")
  })
  expect(readFileSync(testFile, "utf8")).toMatchInlineSnapshot(`
        "export const SomeComponent: React.FC<{}> = function SomeComponent() {
          return (
            <div>
              myComponent
            </div>
          )
        }"
    `)
})