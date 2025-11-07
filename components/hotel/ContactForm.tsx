
// export const ContactForm = () => {
//   return (
//     <div className="bg-white shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_10px_15px_-3px,rgba(0,0,0,0.1)_0px_4px_6px_-4px] box-border caret-transparent p-8 rounded-xl">
//       <h4 className="text-gray-900 text-xl font-bold box-border caret-transparent leading-7 mb-6">
//         Send us a Message
//       </h4>
//       <form className="box-border caret-transparent">
//         <div className="box-border caret-transparent gap-x-4 grid grid-cols-[repeat(1,minmax(0px,1fr))] gap-y-4 md:grid-cols-[repeat(2,minmax(0px,1fr))]">
//           <input 
//         //   label="Name"
//            type="text" placeholder="Your name" />

//           <input 
//         //   label="Email"
//            type="email" placeholder="your@email.com" />
//         </div>
//         <input 
//         // label="Subject"
//          type="text" placeholder="Message subject" />
//         <input
//         //   label="Message"
//           type="textarea"
//           placeholder="Your message..."
//         //   containerClassName="box-border caret-transparent mt-4"
//         />
//         <button
//           type="submit"
//           className="text-white font-semibold bg-blue-600 caret-transparent text-center text-nowrap w-full mt-4 px-0 py-3 rounded-lg hover:bg-blue-700"
//         >
//           Send Message
//         </button>
//       </form>
//     </div>
//   );
// };

"use client";

import React from "react";

export const ContactForm: React.FC = () => {
  return (
    <div className="rounded-xl bg-white p-8 shadow-lg">
      {/* Heading */}
      <h4 className="mb-6 text-xl font-bold text-gray-900">Send us a Message</h4>

      {/* Form */}
      <form className="space-y-4">
        {/* Name + Email Fields */}
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Your name"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Subject */}
        <input
          type="text"
          placeholder="Message subject"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:border-blue-500 focus:outline-none"
        />

        {/* Message */}
        <textarea
          placeholder="Your message..."
          rows={5}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:border-blue-500 focus:outline-none"
        ></textarea>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};
