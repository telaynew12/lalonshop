const PruductDetailsSkeleton = () => {
  return (
    <section className="container mx-auto flex flex-col md:gap-5 md:flex-row md:items-start p-5">
      <div className="w-full md:w-1/2">
        <div className="relative w-full animate-pulse">
          <div className="bg-gray-300 h-64 rounded-lg"></div>
          <div className="flex justify-center mt-4 gap-2">
            <div className="bg-gray-300 w-16 h-16 rounded-lg"></div>
            <div className="bg-gray-300 w-16 h-16 rounded-lg"></div>
            <div className="bg-gray-300 w-16 h-16 rounded-lg"></div>
          </div>
        </div>
      </div>

      <div className="md:w-1/2 space-y-4 pt-5 md:p-5">
        <div className="bg-gray-300 h-8 w-3/4 rounded-lg"></div>
        <div className="flex gap-2 text-2xl font-[300]">
          <div className="bg-gray-300 h-8 w-1/4 rounded-lg"></div>
          <div className="bg-gray-300 h-8 w-1/4 rounded-lg"></div>
        </div>
        <hr />


        <div className="flex pb-3 items-center gap-[6px] text-lg">
          <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
          <div className="bg-gray-300 h-4 w-1/4 rounded-lg"></div>
        </div>

        <div className="bg-gray-300 h-12 rounded-md"></div>
        <div className="bg-gray-300 h-12 rounded-md"></div>

        <div className="bg-gray-300 h-4 w-full rounded-lg"></div>
      </div>
    </section>
  );
};

export default PruductDetailsSkeleton;
