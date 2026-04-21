const fs = require("fs");
const path = require("path");

function byteToDot(byte) {
    const binary = byte.toString(2).padStart(8, '0');
    return binary.replace(/0/g, '.').replace(/1/g, ':');
}

function encodeBuffer(buffer) {
    return Array.from(buffer)
        .map(byteToDot)
        .join(' ');
}

// strict validation helper (for debugging / pipeline safety)
function validateEncodedString(str) {
    const chunks = str.split(' ');

    for (let i = 0; i < chunks.length; i++) {
        if (chunks[i].length !== 8) {
            throw new Error(
                `INVALID 8-BIT BLOCK at index ${i}: "${chunks[i]}" (${chunks[i].length} bits)`
            );
        }

        if (!/^[\.:]{8}$/.test(chunks[i])) {
            throw new Error(
                `CORRUPTED SYMBOLS at index ${i}: "${chunks[i]}"`
            );
        }
    }
}

// CLI: node encode.js input.txt
const inputFile = process.argv[2];

if (!inputFile) {
    console.log("usage: node encode.js <inputfile>");
    process.exit(1);
}

try {
    const data = fs.readFileSync(inputFile);

    const encoded = encodeBuffer(data);

    // enforce strict correctness
    validateEncodedString(encoded);

    const baseName = path.parse(inputFile).name;
    const outputFile = `${baseName}.encod`;

    fs.writeFileSync(outputFile, encoded);

    console.log(`encoded successfully → ${outputFile}`);
} catch (err) {
    console.error("ENCOD ERROR:", err.message);
}