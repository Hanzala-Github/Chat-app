// import React from "react";
// export function MessageTicks({ status }) {
//   if (status === "sent") return <span className="text-gray-400">✓</span>;
//   if (status === "delivered") return <span className="text-gray-500">✓✓</span>;
//   if (status === "seen") return <span className="text-blue-500">✓✓</span>;
//   return null;
// }
import React from "react";

export function MessageTicks({ status }) {
  const baseClass = "text-[11px]  tracking-tight inline-flex items-center";

  if (status === "sent") {
    return <span className={`${baseClass} text-gray-400`}>✓</span>;
  }

  if (status === "delivered") {
    return (
      <span className={`${baseClass} text-gray-500`}>
        ✓<span className="-ml-[3px]">✓</span>
      </span>
    );
  }

  if (status === "seen") {
    return (
      <span className={`${baseClass} text-blue-500`}>
        ✓<span className="-ml-[3px]">✓</span>
      </span>
    );
  }

  return null;
}
