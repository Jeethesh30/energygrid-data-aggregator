# EnergyGrid Data Aggregator

## Overview
This project implements a data aggregation client that fetches real-time telemetry data for 500 solar devices from a mock EnergyGrid API. The solution strictly follows the given API constraints, including rate limiting, batch size limits, and secure request authentication.

---

## API Constraints
- **Rate Limit:** 1 request per second
- **Batch Size:** Maximum 10 device serial numbers per request
- **Security:** MD5-based request signature  
  - Signature format: `MD5(URL + token + timestamp)`

---

## Project Structure
energygrid-data-aggregator
├── energygrid-client
│ ├── client.js
│ └── package.json
├── mock-api
│ ├── server.js
│ └── package.json
├── .gitignore
└── README.md


---

## Solution Approach
1. Generated 500 device serial numbers (`SN-000` to `SN-499`)
2. Split the serial numbers into batches of 10 devices
3. Sent requests sequentially with a 1-second delay to respect the rate limit
4. Generated a secure MD5 signature for every API request
5. Retried failed requests gracefully
6. Aggregated the responses for all 500 devices

---

## Setup and Run Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm

### Step 1: Start the Mock API Server
```bash
cd mock-api
npm install
node server.js
### Step 2: Run the Client Application
cd energygrid-client
npm install
node client.js
