import React from "react";

export default function FeatureCard({ img, title, desc, icon }) {
  return (
    <div className="relative bg-gradient-to-br from-[#00BFA6] to-[#4FC3F7] rounded-2xl p-6 shadow-lg hover:shadow-2xl transition cursor-pointer text-center overflow-hidden">
      {/* Background image */}
      {img && (
        <img
          src={img}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
      )}

      {/* Content on top of image */}
      <div className="relative z-10">
        <div className="mx-auto">{icon}</div>
        <h3 className="mt-4 text-xl font-bold text-white">{title}</h3>
        <p className="mt-2 text-gray-200">{desc}</p>
      </div>
    </div>
  );
}
