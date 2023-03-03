interface StartGameComponentProps {
  title: string;
  buttonTitle: string;
}

export default function StartGameComponent({
  title,
  buttonTitle,
}: StartGameComponentProps) {
  return (
    <div className="mt-8 w-full">
      <div className="bg-nh-bgdark pt-5 px-12 rounded-lg pb-5 flex flex-col justify-center items-center">
        <div className="text-white text-[16px] font-semibold leading-5 text-center">
          {title}
        </div>
        <div className="pt-4">
          <button
            className="bg-nh-purple roudned-lg py-2 px-3 flex items-center rounded-lg"
            onClick={() => console.log("show popup")}
          >
            <span className="text-white text-sm leading-5 font-medium">
              {buttonTitle}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
