// import { ContactForm } from "./ContactForm";
// import { ContactInfo } from "./ContactInfo";

// export const ContactContent = () => {
//   return (
//     <div className="box-border caret-transparent gap-x-12 grid grid-cols-[repeat(1,minmax(0px,1fr))] gap-y-12 md:grid-cols-[repeat(2,minmax(0px,1fr))]">
//       <ContactInfo />
//       <ContactForm />
//     </div>
//   );
// };

"use client";

import React from "react";
import { ContactForm } from "./ContactForm";
import { ContactInfo } from "./ContactInfo";

export const ContactContent: React.FC = () => {
  return (
    <div className="grid gap-12 md:grid-cols-2 md:gap-x-12">
      {/* Left Side - Contact Information */}
      <ContactInfo />

      {/* Right Side - Contact Form */}
      <ContactForm />
    </div>
  );
};
