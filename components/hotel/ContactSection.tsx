
// import { ContactContent } from "./ContactContent";
// import { SectionHeader } from "./SectionHeader";

// export const ContactSection = () => {
//   return (
//     <section className="bg-gray-50 box-border caret-transparent py-16">
//       <div className="box-border caret-transparent max-w-screen-xl mx-auto px-4 md:px-8">
//         <SectionHeader
//           title="Contact Us"
//           description="Get in touch with us for reservations, inquiries, or any assistance you need."
//         />
//         <ContactContent />
//       </div>
//     </section>
//   );
// };


"use client";

import React from "react";
import { ContactContent } from "./ContactContent";
import { SectionHeader } from "./SectionHeader";

export const ContactSection: React.FC = () => {
  return (
    <section id='contact' className="bg-gray-50 py-16">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <SectionHeader
          title="Contact Us"
          description="Get in touch with us for reservations, inquiries, or any assistance you need."
        />

        {/* Contact Content */}
        <ContactContent />
      </div>
    </section>
  );
};
