let account;
let stakingContract;
let usdoContract;
const stakingAddress = "0xYourStakingContractAddress"; // change this
const tokenAddress = "0xYourUSDOTokenAddress"; // change this

const stakingAbi = [
  "function stake(uint256 amount) external",
  "function getStaked(address user) view returns (uint256)",
  "function getRewards(address user) view returns (uint256)"
];

const tokenAbi = [
  "function approve(address spender, uint256 amount) public returns (bool)"
];

async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask");
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  account = await signer.getAddress();

  stakingContract = new ethers.Contract(stakingAddress, stakingAbi, signer);
  usdoContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

  document.getElementById("connectWallet").innerText = "✅ Connected";
  loadInfo();
}

async function stakeTokens() {
  const amount = document.getElementById("stakeAmount").value;
  const amountInWei = ethers.utils.parseUnits(amount, 18);

  await usdoContract.approve(stakingAddress, amountInWei);
  await stakingContract.stake(amountInWei);

  alert("✅ Staked " + amount + " USD.o!");
  loadInfo();
}

async function loadInfo() {
  const staked = await stakingContract.getStaked(account);
  const rewards = await stakingContract.getRewards(account);

  document.getElementById("staked").innerText = ethers.utils.formatUnits(staked, 18);
  document.getElementById("rewards").innerText = ethers.utils.formatUnits(rewards, 18);
}

document.getElementById("connectWallet").addEventListener("click", connectWallet);
