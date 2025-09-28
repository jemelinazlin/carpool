import { MapPin, Search } from "lucide-react";

export default function SearchBar({ from, to, setFrom, setTo, onSearch }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 bg-white shadow-md p-4 rounded-2xl max-w-2xl mx-auto">
      <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 flex-1">
        <MapPin className="text-[#00BFA6]" />
        <input
          type="text"
          placeholder="From"
          className="bg-transparent outline-none flex-1"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 flex-1">
        <MapPin className="text-[#4FC3F7]" />
        <input
          type="text"
          placeholder="To"
          className="bg-transparent outline-none flex-1"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>
      <button
        onClick={onSearch}
        className="bg-[#00BFA6] hover:bg-[#00A392] px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2"
      >
        <Search className="w-5 h-5" /> Search
      </button>
    </div>
  );
}
