import React, { useEffect, useRef, useState } from 'react';
import SearchResult from './SearchResult';
import useDebounce from '../../hooks/useDebounce';

const MIN_SEARCH_CHARS = 1;

const SearchBar = ({ nodes = [], onSelectNode, onSetLocation, mode = "search" }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const trimmed = debouncedQuery.trim().toLowerCase();

    if (trimmed.length >= MIN_SEARCH_CHARS) {
      const filtered = nodes.filter((n) => {
        const name = n.name || n.nodeId || "";
        return name.toLowerCase().includes(trimmed);
      });
      setResults(filtered);
      setShowDropdown(true);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [debouncedQuery, nodes]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSelect = (node) => {
    if (mode === "setLocation") {
      onSetLocation?.(node);
    } else {
      onSelectNode?.(node);
    }
    setQuery(''); // clear after selection
    setShowDropdown(false);
  };

  return (
    <div
      ref={wrapperRef}
      className="absolute top-4 left-1/2 -translate-x-1/2 w-[min(90vw,500px)] z-50"
    >
      <input
        ref={inputRef}
        type="text"
        placeholder={
          mode === "setLocation" ? "Search and set your location…" : "Search destination…"
        }
        className="w-full px-4 py-2 rounded-xl shadow-md bg-white focus:outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() =>
          query.trim().length >= MIN_SEARCH_CHARS && setShowDropdown(true)
        }
      />

      {showDropdown && (
        <div className="absolute left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white shadow-lg rounded-xl border border-gray-300 text-sm z-50">
          {results.length > 0 ? (
            <ul>
              {results.map((node) => (
                <SearchResult
                  key={node.nodeId}
                  node={{
                    ...node,
                    displayName: `${node.name || node.nodeId} (Floor ${
                      node.coordinates?.floor || "?"
                    })`,
                  }}
                  onSelect={() => handleSelect(node)}
                />
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
