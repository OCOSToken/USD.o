let provider;
let signer;
let walletAddress;

// Simulated airdrop list (replace with Merkle or backend-based list in production)
const airdropList = {
  "0xAbC1234567890abcdefABC1234567890ABCDEF12": 100,
  "0xDEF4567890abcdefABC1234567890ABCDEF34567": 50
};

async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask to use this dApp.");
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  walletAddress = await signer.getAddress();

  document.getElementById("wallet").innerText = walletAddress;
  checkEligibility();
}

function checkEligibility() {
  const normalizedAddress = walletAddress.toLowerCase();
  const matched = Object.keys(airdropList).find(addr => addr.toLowerCase() === normalizedAddress);
  const amount = matched ? airdropList[matched] : 0;

  const eligibilityText = document.getElementById("eligibility");
  const claimButton = document.getElementById("claimBtn");

  if (amount > 0) {
    eligibilityText.innerText = `✅ Eligible for ${amount} USD.o`;
    claimButton.disabled = false;
  } else {
    eligibilityText.innerText = "❌ Not eligible";
    claimButton.disabled = true;
  }
}

function claimTokens() {
  // In production: call smart contract method like airdropContract.claim()
  document.getElementById("message").innerText = "🎉 Airdrop claimed successfully!";
  document.getElementById("claimBtn").disabled = true;
}

document.getElementById("connectWallet").addEventListener("click", connectWallet);
