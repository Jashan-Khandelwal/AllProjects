let hScore = 0,
  cScore = 0;
const result = document.getElementById("result");

function playRound(humanChoice) {
  const computerChoice = Math.floor(Math.random() * 3);
  let message = "";

  const icons = ["🪨 Rock", "📄 Paper", "✂️ Scissors"];

  if (humanChoice === computerChoice) {
    message = `🤝 It's a draw! You both chose ${icons[humanChoice]}.`;
  } else if (
    (humanChoice === 0 && computerChoice === 2) ||
    (humanChoice === 1 && computerChoice === 0) ||
    (humanChoice === 2 && computerChoice === 1)
  ) {
    hScore++;
    message = `✅ You win! ${icons[humanChoice]} beats ${icons[computerChoice]}.`;
  } else {
    cScore++;
    message = `❌ You lose! ${icons[computerChoice]} beats ${icons[humanChoice]}.`;
  }

  result.innerHTML = `
        <p>${message}</p>
        <p class="score">Your Score: ${hScore} | Computer Score: ${cScore}</p>
      `;

  if (hScore === 5 || cScore === 5) {
    setTimeout(() => {
      alert(
        hScore > cScore
          ? `🎉 You win the game! Final Score:\nYou: ${hScore} Computer: ${cScore}`
          : `😢 You lose the game. Final Score:\nYou: ${hScore} Computer: ${cScore}`
      );
      hScore = 0;
      cScore = 0;
      result.innerText = "Make your move!";
    }, 300);
  }
}

document.getElementById("rock").addEventListener("click", () => playRound(0));
document.getElementById("paper").addEventListener("click", () => playRound(1));
document.getElementById("scissors").addEventListener("click", () => playRound(2));
