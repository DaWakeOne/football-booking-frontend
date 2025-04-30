const fs = require("fs")
const path = require("path")

// Directories to scan
const directories = ["app", "components"]

// Function to check if a file has a misplaced "use client" directive
function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8")

    // Check if file contains "use client" but it's not at the top
    if (content.includes('"use client"') || content.includes("'use client'")) {
      const lines = content.split("\n")
      const firstNonEmptyLine = lines.findIndex((line) => line.trim() !== "")

      if (firstNonEmptyLine > 0 || (lines[0].trim() !== '"use client"' && lines[0].trim() !== "'use client'")) {
        console.log(`Issue found in ${filePath}: "use client" directive is not at the top of the file`)
        return true
      }
    }
    return false
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return false
  }
}

// Function to recursively scan directories
function scanDirectory(dir) {
  const issues = []
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      issues.push(...scanDirectory(filePath))
    } else if (file.endsWith(".tsx") || file.endsWith(".jsx")) {
      if (checkFile(filePath)) {
        issues.push(filePath)
      }
    }
  }

  return issues
}

// Run the scan
console.log('Scanning for misplaced "use client" directives...')
const issues = []
for (const dir of directories) {
  issues.push(...scanDirectory(dir))
}

if (issues.length > 0) {
  console.log(`Found ${issues.length} files with misplaced "use client" directives`)
} else {
  console.log("No issues found!")
}
