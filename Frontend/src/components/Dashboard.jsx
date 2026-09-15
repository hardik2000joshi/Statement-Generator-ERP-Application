export const Dashboard = () => {
  return (
    <div className="min-h-screen w-full bg-slate-50">
        <header className="h-16 bg-white border-b border-slate-200 shadow-sm px-8 w-full">
      <h2 className="text-xl font-semibold text-slate-800">
        Dashboard
              </h2>
    </header>

     <section className="p-10">
      <h2 className="text-3xl font-bold text-slate-800">
        Dashboard
      </h2>
      <p className="mt-5 text-gray-600">
        Welcome to Statement generation. Use the navigation
        on the left to manage companies, templates, and more.
      </p>
    </section>
    </div>
  );
};
