import React, { Suspense } from "react";
import PageContent from "./PageContent";

const Page = () => {
  return (
    <Suspense fallback={<div></div>}>
      <PageContent />
    </Suspense>
  );
};

export default Page;
