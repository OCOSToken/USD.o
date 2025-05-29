let provider;
let account;

async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask");
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  account = await signer.getAddress();
  document.getElementById("account").innerText = account;
  getBlockNumber();
  getBalance();
  getLatestTransactions();
}

async function getBlockNumber() {
  const blockNumber = await provider.getBlockNumber();
  document.getElementById("blockNumber").innerText = blockNumber;
}

async function getBalance() {
  const usdoAddress = "0xYourUSDOTokenAddress"; // Replace with your deployed address
  const abi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)"
  ];
  const token = new ethers.Contract(usdoAddress, abi, provider);
  const balance = await token.balanceOf(account);
  const decimals = await token.decimals();
  document.getElementById("balance").innerText = (balance / 10 ** decimals).toFixed(2) + " USD.o";
}

async function getLatestTransactions() {
  const latestBlock = await provider.getBlock("latest", true);
  const txList = document.getElementById("txList");
  txList.innerHTML = "";

  if (latestBlock.transactions.length === 0) {
    txList.innerHTML = "<li>No transactions found in the latest block.</li>";
    return;
  }

  latestBlock.transactions.slice(0, 5).forEach(tx => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>From:</strong> ${tx.from}<br>
      <strong>To:</strong> ${tx.to}<br>
      <strong>Value:</strong> ${ethers.utils.formatEther(tx.value)} ETH
    `;
    txList.appendChild(li);
  });
}

document.getElementById("connect").addEventListener("click", connectWallet);
