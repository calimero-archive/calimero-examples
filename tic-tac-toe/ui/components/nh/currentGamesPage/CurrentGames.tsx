import StartGameComponent from "../startGameComponents/StartGameComponent";
import translations from "../../../constants/en.global.json";

const translation = translations.currentGamesPage;

export default function CurrentGames() {
  return (
    <div>
      <div className="font-medium text-2xl leading-7 mt-12 text-white">
        {translation.pageTitle}
      </div>
      <StartGameComponent
        buttonTitle={translation.buttonText}
        title={translation.componentTitle}
      />
    </div>
  );
}
