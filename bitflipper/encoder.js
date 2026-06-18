const fs = require("fs");
const path = require("path");

function flipByte(byte) {
    return 255 - byte;
}

// CLI
const inputArg = process.argv[2];

if (process.argv.length !== 3) {
    console.log("usage: node bitflipper.js <file>");
    process.exit(1);
}

const fullPath = path.resolve(inputArg);

if (!fs.existsSync(fullPath)) {
    console.error("ERROR: file does not exist");
    process.exit(1);
}

const stat = fs.statSync(fullPath);

if (!stat.isFile()) {
    console.error("ERROR: input must be a single file");
    process.exit(1);
}

try {
    const data = fs.readFileSync(fullPath);

    const flippedBuffer = Buffer.from(data.map(flipByte));

    const parsed = path.parse(fullPath);

    const outputFile = path.join(
        parsed.dir,
        `${parsed.name}.flipped`
    );

    fs.writeFileSync(outputFile, flippedBuffer);

    console.log(`bit flipped → ${outputFile}`);
} catch (err) {
    console.error("BITFLIP ERROR:", err.message);
}