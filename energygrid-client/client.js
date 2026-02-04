const crypto = require("crypto");

const BASE_URL = "http://localhost:3000";
const ENDPOINT = "/device/real/query";
const TOKEN = "interview_token_123";

// wait 1 second (rate limit)
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// generate 500 serial numbers
function generateSerialNumbers() {
  return Array.from({ length: 500 }, (_, i) =>
    `SN-${String(i).padStart(3, "0")}`
  );
}

// create md5 signature
function createSignature(url, timestamp) {
  return crypto
    .createHash("md5")
    .update(url + TOKEN + timestamp)
    .digest("hex");
}

// call api for one batch
async function fetchBatch(batch) {
  const timestamp = Date.now().toString();
  const signature = createSignature(ENDPOINT, timestamp);

  const response = await fetch(BASE_URL + ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      timestamp,
      signature,
    },
    body: JSON.stringify({ sn_list: batch }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const json = await response.json();
  return json.data;
}

// main function
async function run() {
  const serials = generateSerialNumbers();

  // split into batches of 10
  const batches = [];
  for (let i = 0; i < serials.length; i += 10) {
    batches.push(serials.slice(i, i + 10));
  }

  const allResults = [];

  for (let i = 0; i < batches.length; i++) {
    console.log(`Fetching batch ${i + 1}/50`);

    try {
      const data = await fetchBatch(batches[i]);
      allResults.push(...data);
    } catch (err) {
      console.error("Retrying batch due to error:", err.message);
      i--; // retry same batch
    }

    await sleep(1000); // strict rate limit
  }

  console.log("✅ Finished");
  console.log("Total devices:", allResults.length);
}

run();
