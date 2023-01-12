export const getGameStatus = (status: string) => {
  switch (status) {
    case "PlayerAWon":
      return "Win!";
    case "PlayerBWon":
      return "Lose!";
    case "InProgress":
      return "Continue game";
    default:
      return "Tie!";
  }
};