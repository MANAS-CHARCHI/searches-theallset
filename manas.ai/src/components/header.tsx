const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="flex flex-row justify-between">
        <div className="px-6 py-3">
          <h1 className="text-xl font-semibold text-gray-800 tracking-tight ml-10">
            Searches
            <span className="text-xs text-gray-500 pl-2 tracking-wide">
              by theallset
            </span>
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
