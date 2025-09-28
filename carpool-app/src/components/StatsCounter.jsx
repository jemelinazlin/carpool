import { useEffect, useState } from "react";

export default function StatsCounter({ target, label, icon }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = Math.ceil(target / (duration / 16));
    const counter = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(counter);
      }
      setCount(start);
    }, 16);
  }, [target]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
      <div className="text-3xl mb-2">{icon}</div>
      <h2 className="text-2xl font-bold">{count.toLocaleString()}</h2>
      <p className="text-gray-500">{label}</p>
    </div>
  );
}
