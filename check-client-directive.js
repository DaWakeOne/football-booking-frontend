const fs = require("fs")
const path = require("path")

// Function to check if a file has the "use client" directive at the top
function checkUseClientDirective(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8")
    const lines = content.split("\n")

    // Check if the file has "use client" anywhere
    const hasUseClient = content.includes('"use client"')

    if (hasUseClient) {
      // Check if "use client" is the first non-empty line
      const firstNonEmptyLine = lines.find((line) => line.trim() !== "")
      if (firstNonEmptyLine && firstNonEmptyLine.trim() !== '"use client"') {
        console.error(`❌ File ${filePath} has "use client" but it's not at the top of the file`)
        return false
      }
    }

    return true
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return false
  }
}

// Function to recursively scan directories for .tsx and .ts files
function scanDirectory(dir) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      scanDirectory(filePath)
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      checkUseClientDirective(filePath)
    }
  }
}

// Start scanning from the current directory
console.log('Checking for "use client" directive issues...')
scanDirectory(".")
console.log("Done checking files.")
