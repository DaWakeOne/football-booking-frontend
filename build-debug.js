const { execSync } = require("child_process")
const fs = require("fs")

console.log("Starting build debug process...")

try {
  console.log("Checking Node version:")
  execSync("node --version", { stdio: "inherit" })

  console.log("\nChecking npm version:")
  execSync("npm --version", { stdio: "inherit" })

  console.log("\nListing top-level directories:")
  const dirs = fs
    .readdirSync(".", { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
  console.log(dirs)

  console.log("\nChecking for package.json:")
  if (fs.existsSync("./package.json")) {
    console.log("package.json exists")
    const pkg = require("./package.json")
    console.log("Dependencies:", Object.keys(pkg.dependencies || {}).length)
    console.log("DevDependencies:", Object.keys(pkg.devDependencies || {}).length)
  } else {
    console.log("package.json does not exist!")
  }

  console.log("\nChecking for next.config.js/mjs:")
  if (fs.existsSync("./next.config.js")) {
    console.log("next.config.js exists")
  } else if (fs.existsSync("./next.config.mjs")) {
    console.log("next.config.mjs exists")
  } else {
    console.log("No Next.js config file found!")
  }

  console.log("\nAttempting clean build:")
  console.log("Removing node_modules/.cache and .next")
  try {
    if (fs.existsSync("./node_modules/.cache")) {
      fs.rmSync("./node_modules/.cache", { recursive: true, force: true })
    }
    if (fs.existsSync("./.next")) {
      fs.rmSync("./.next", { recursive: true, force: true })
    }
    console.log("Cache cleared successfully")
  } catch (e) {
    console.error("Error clearing cache:", e)
  }
} catch (error) {
  console.error("Error during build debug:", error)
}

console.log("\nBuild debug complete")
