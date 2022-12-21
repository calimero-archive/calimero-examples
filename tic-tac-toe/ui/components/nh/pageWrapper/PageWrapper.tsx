import Navigation from "../navigation/Navigation";

export default function PageWrapper() {
  return (
    <div className="flex flex-col w-screen bg-nh-bglight items-center min-h-screen py-8">
      <div className="w-full max-w-nh">
        <Navigation />
      </div>
      <div className="w-3/4 h-full max-w-nh-content-width bg-green-500">
        {/*TO DO CONTENT WRAPPER */}
      </div>
    </div>
  );
}
