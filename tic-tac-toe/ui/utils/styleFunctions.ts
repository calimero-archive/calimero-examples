export const getGameStatus = (
  status: string,
  playerA?: string,
  accountId?: string
) => {
  if (playerA && accountId) {
    if (playerA === accountId) {
      switch (status) {
        case "PlayerAWon":
          return "Win!";
        case "PlayerBWon":
          return "Lose!";
        default:
          return "Tie!";
      }
    } else {
      switch (status) {
        case "PlayerAWon":
          return "Lose!";
        case "PlayerBWon":
          return "Win!";
        default:
          return "Tie!";
      }
    }
  } else {
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
  }
};
