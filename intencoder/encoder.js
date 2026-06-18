const fs = require("fs");
const path = require("path");

// text → int array (UTF-8 bytes)
function textToInts(buffer) {
    return Array.from(buffer);
}

// optional validation (keeps it clean)
function validateInts(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (!Number.isInteger(arr[i]) || arr[i] < 0 || arr[i] > 255) {
            throw new Error(`INVALID BYTE AT ${i}: ${arr[i]}`);
        }
    }
}

// CLI
const inputArg = process.argv[2];

if (process.argv.length !== 3) {
    console.log("usage: node encode.js <file>");
    process.exit(1);
}

const fullPath = path.resolve(inputArg);

if (!fs.existsSync(fullPath)) {
    console.error("ERROR: file not found");
    process.exit(1);
}

const stat = fs.statSync(fullPath);

if (!stat.isFile()) {
    console.error("ERROR: must be a single file");
    process.exit(1);
}

try {
    // 📦 read file as raw bytes
    const buffer = fs.readFileSync(fullPath);

    // 🔢 convert to ints
    const ints = textToInts(buffer);

    validateInts(ints);

    // 🧾 encode format = plain numbers
    const encoded = ints.join(" ");

    const parsed = path.parse(fullPath);

    const outputFile = path.join(
        parsed.dir,
        `${parsed.name}.encod`
    );

    fs.writeFileSync(outputFile, encoded);

    console.log(`encoded successfully → ${outputFile}`);
} catch (err) {
    console.error("ENCOD ERROR:", err.message);
}