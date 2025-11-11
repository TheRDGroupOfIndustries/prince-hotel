// // import Page from "@/components/hotel/MainPage";

// import LandingPage from "@/components/hotel/LandingPage";

// export default function Home() {
//   return (
//     //  <Page/>
//     <LandingPage />
//   );
// }

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import LandingPage from "@/components/hotel/LandingPage";

export default function Home() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const scrollTo = searchParams.get("scrollTo");
    if (scrollTo) {
      const section = document.getElementById(scrollTo);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth" });
        }, 400); // small delay ensures DOM is fully ready
      }
    }
  }, [searchParams]);

  return <LandingPage />;
}
