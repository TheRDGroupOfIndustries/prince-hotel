"use client";

import React from "react";

export type FooterColumnProps = {
  variant: "about" | "links" | "services" | "contact";
  title?: string;
  description?: string;
  socialLinks?: Array<{
    href: string;
    icon: React.ReactNode;
  }>;
  links?: Array<{
    href: string;
    text: string;
  }>;
  items?: string[];
  contactInfo?: string[];
};

export const FooterColumn: React.FC<FooterColumnProps> = (props) => {
  const { variant, title, description, socialLinks, links, items, contactInfo } = props;

  if (variant === "about") {
    return (
      <div>
        <h4 className="mb-4 font-pacifico text-xl font-bold leading-7">{title}</h4>
        <p className="mb-4 text-gray-400">{description}</p>
        <div className="flex gap-4">
          {socialLinks?.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-gray-400 hover:text-white transition"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "links") {
    return (
      <div>
        <h5 className="mb-4 text-lg font-semibold leading-7">{title}</h5>
        <ul className="space-y-2">
          {links?.map((link, index) => (
            <li key={index}>
              <a
                href={link.href}
                className="text-gray-400 hover:text-white transition"
              >
                {link.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (variant === "services") {
    return (
      <div>
        <h5 className="mb-4 text-lg font-semibold leading-7">{title}</h5>
        <ul className="space-y-2 text-gray-400">
          {items?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (variant === "contact") {
    return (
      <div>
        <h5 className="mb-4 text-lg font-semibold leading-7">{title}</h5>
        <ul className="space-y-2 text-gray-400">
          {contactInfo?.map((info, index) => (
            <li key={index}>{info}</li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
};
