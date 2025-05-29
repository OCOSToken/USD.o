let account;

async function connectWallet() {
  if (window.ethereum) {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    account = accounts[0];
    document.getElementById("connectWallet").innerText = "✅ Connected";
    getBalance();
  } else {
    alert("MetaMask not detected!");
  }
}

async function getBalance() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const tokenAddress = "0xYourUSDOTokenAddress"; // Replace with your deployed USD.o address
  const abi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)"
  ];
  const token = new ethers.Contract(tokenAddress, abi, signer);
  const balance = await token.balanceOf(account);
  const decimals = await token.decimals();
  document.getElementById("balance").innerText = (balance / 10 ** decimals).toFixed(2) + " USD.o";
}

function bridgeUSD() {
  const amount = document.getElementById("bridgeAmount").value;
  alert("Bridge request submitted for " + amount + " USD.o");
}

function voteProposal() {
  alert("Your vote has been cast!");
}

document.getElementById("connectWallet").addEventListener("click", connectWallet);
