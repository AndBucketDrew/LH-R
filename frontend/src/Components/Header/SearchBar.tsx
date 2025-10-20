import { useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';
import { IoSearch } from 'react-icons/io5';
import useStore from '../../hooks/useStore.ts';
import type { IMember } from '@/models/member.model.ts';
import { useOutsideClick } from '@/hooks/useOutsideClick.ts';
import { Link, useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const bgColor = 'bg-transparent';
  const [query, setQuery] = useState('');
  const [showDropdown, setshowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { searchMembersFriends, friendsSearchResults } = useStore((state) => state);

  useOutsideClick(containerRef, () => setshowDropdown(false));

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query.trim()) {
        searchMembersFriends(query);
        setshowDropdown(true);
      } else {
        setshowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, searchMembersFriends]);

  const navigate = useNavigate();

  const handleSeeAll = () => {
    // Optionally store query in session/localStorage
    sessionStorage.setItem('searchQuery', query);

    // Redirect to full search results page
    navigate(`/results?query=${encodeURIComponent(query)}`);
    setshowDropdown(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex-1 min-w-[150px] max-w-[270px]"
    >
      <IoSearch className="absolute text-2xl left-3 top-2 text-gray-400" />
      <Input
        className={`${bgColor} rounded-3xl h-10 pl-11 shadow-none w-full`}
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (query.trim() && friendsSearchResults.length > 0) {
            setshowDropdown(true);
          }
        }}
      />

      {showDropdown && (
        <div className="absolute mt-2 w-full z-10">
          {/* {loading && (
            <div className="text-sm text-popover-foreground bg-popover shadow rounded p-2">
              Loading...
            </div>
          )} */}

          {query && friendsSearchResults.length === 0 && (
            <div className="text-sm text-popover-foreground bg-popover shadow rounded p-2">
              No users found.
            </div>
          )}

          {friendsSearchResults.length > 0 && (
            <ul className="absolute overflow-auto bg-popover text-popover-foreground shadow rounded-sm max-h-48 w-full">
              {friendsSearchResults.map((member: IMember) => (
                <li
                  key={member._id}
                  className="flex items-center p-2 hover:bg-gray-100"
                >
                  <Link to={`/members/${member.username}`} className="flex items-center gap-2 w-full">
                    <img
                      src={member.photo?.url || 'https://ik.imagekit.io/LHR/user-octagon-svgrepo-com.svg'}
                      alt={member.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{member.username}</span>
                      <span className="text-sm text-gray-500">
                        {member.firstName} {member.lastName}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
              <li
                className="flex items-center gap-2 justify-center p-2 hover:bg-gray-100 cursor-pointer border-t"
                onClick={handleSeeAll}
              >
                <IoSearch className="text-lg text-blue-600" />
                <span className="text-sm text-blue-600 font-medium">
                  See more results for "{query}"
                </span>
              </li>
            </ul>
          )}

        </div>
      )}
    </div>
  );
}
