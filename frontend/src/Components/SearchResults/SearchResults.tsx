import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useStore from '../../hooks/useStore.ts';
import { Button } from '../ui/button.tsx';
import { Card, CardContent } from '../ui/card.tsx';

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';

  const {
    friendsSearchResults,
    wideSearchResults,
    searchMembersFriends,
    searchMembersWide,
  } = useStore((state) => state);

  const [showFriends, setShowFriends] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Fetch initial data on mount or query change
  useEffect(() => {
    if (!query) return;

    searchMembersFriends(query);
    searchMembersWide(query, 10); // initial limited wide search
    setShowAll(false);
    setShowFriends(true);
  }, [query, searchMembersFriends, searchMembersWide]);

  // Show more button handler
  const handleShowMore = () => {
    searchMembersWide(query); // fetch full results
    setShowAll(true);
    setShowFriends(false);
  };

  return (
    <div className="p-4 space-y-6 pt-10">
      {/* Friends Card */}
      {showFriends && friendsSearchResults.length > 0 && (
        <Card>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Friends matching "{query}"</h3>
              <Button size="sm" variant="outline" onClick={() => setShowFriends(false)}>
                Hide
              </Button>
            </div>
            <ul className="space-y-2">
              {friendsSearchResults.map((friend) => (
                <li key={friend._id} className="flex items-center gap-3">
                  <img
                    src={friend.photo?.url || 'https://ik.imagekit.io/LHR/user-octagon-svgrepo-com.svg'}
                    alt={friend.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{friend.username}</p>
                    <p className="text-sm text-gray-500">{friend.firstName} {friend.lastName}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Wide Search Card */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">
            Search results for "{query}" {showAll ? '' : '(limited)'}
          </h3>
          <ul className="space-y-2">
            {(showAll ? wideSearchResults : wideSearchResults.slice(0, 10)).map((m) => (
              <li key={m._id} className="flex items-center gap-3">
                <img
                  src={m.photo?.url || 'https://ik.imagekit.io/LHR/user-octagon-svgrepo-com.svg'}
                  alt={m.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{m.username}</p>
                  <p className="text-sm text-gray-500">{m.firstName} {m.lastName}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Show More Button */}
          {!showAll && wideSearchResults.length > 10 && (
            <div className="mt-4 text-center">
              <Button onClick={handleShowMore}>Show more</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
