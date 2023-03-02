import translations from "../../../constants/en.global.json";
import NearLogo from "../images/NearLogo";

const componentTranslations = translations.loginComponent;

interface LoginPopupComponentProps {
  login: () => void;
}

export default function LoginPopupComponent({
  login,
}: LoginPopupComponentProps) {
  return (
    <div className="h-screen flex justify-center">
      <div className="w-[434px] pt-40">
        <div className="bg-nh-bgdark pt-5 px-12 rounded-lg pb-14 flex flex-col justify-center items-center">
          <div className="text-white font-medium text-[32px] leading-[48px]">
            {componentTranslations.title}
          </div>
          <div className="text-white text-[16px] font-medium leading-5 mt-5 text-center">
            {componentTranslations.subtitle}
          </div>
          <div className="pt-9">
            <button
              className="bg-white roudned-lg py-3 gap-x-4 px-10 flex items-center text-nh-bglight rounded-lg hover:bg-nh-purple"
              onClick={login}
            >
              <NearLogo />
              <span className="text-base leading-6 font-medium">
                {componentTranslations.buttonText}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
