import React from 'react';
import clsx from 'clsx';

const SearchResult = ({ node, onSelect, isHighlighted }) => {
  const handlePick = () => onSelect(node);

  return (
    <li
      className={clsx(
        'px-4 py-2 cursor-pointer hover:bg-blue-100',
        isHighlighted && 'bg-blue-100'
      )}
      onMouseDown={handlePick}   // desktop / devtools
      onTouchStart={handlePick}  // real mobile tap
    >
      {node.name}
      {node.coordinates?.floor !== undefined && (
        <span className="text-xs text-gray-500 ml-2">
          (Floor {node.coordinates.floor})
        </span>
      )}
    </li>
  );
};

export default SearchResult;
