"use client";

import React from "react";

export type ContactItemProps = {
  title: string;
  content: string;
  icon: React.ReactNode; 
  showMarginTop?: boolean;
};

export const ContactItem: React.FC<ContactItemProps> = ({
  title,
  content,
  icon,
  showMarginTop,
}) => {
  return (
    <div className={`flex items-start gap-4 ${showMarginTop ? "mt-8" : ""}`}>
      {/* Icon */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
        <span className="text-blue-600 text-2xl">
          {icon}
        </span>
      </div>

      {/* Content */}
      <div>
        <h4 className="mb-2 text-lg font-semibold text-gray-900">{title}</h4>
        <p className="text-gray-600">{content}</p>
      </div>
    </div>
  );
};
