import React from "react";
import { FaChevronDown } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

const SearchFilter = ({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
}) => {
  return (
    <div className="flex items-center justify-between my-4">
      {/* Search Box */}
      <div className="flex items-center border border-gray-200 rounded-md px-4 w-[60%]">
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-none rounded-md h-11 appearance-none text-[15px] font-medium outline-none w-full"
        />
        <button>
          <FiSearch />
        </button>
      </div>

      {/* Custom Select Dropdown with Chevron */}
      <div className="relative ml-4 w-1/4">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full border border-gray-200 rounded-md p-2 px-4 appearance-none text-[15px] font-medium outline-none"
        >
          <option value="">Sort By</option>
          <option value="Tech">Tech</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
        </select>
        {/* Custom Chevron Icon */}
        <div className="absolute inset-y-0 right-2 flex items-center px-2 pointer-events-none">
          <FaChevronDown className="text-gray-500 w-3 h-3" />
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
