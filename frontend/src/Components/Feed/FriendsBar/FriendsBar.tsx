import useStore from '@/hooks/useStore';
import { useEffect } from 'react';

export default function FriendsBar() {
  const { friends, friendsLoading, friendsError, fetchFriends } = useStore();

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  return (
    <div className="p-1 h-full border-l border-[--sidebar-border]">
      {friendsLoading ? (
        <div className="text-center font-poppins">Loading...</div>
      ) : friendsError ? (
        <div className="text-[--destructive] text-center font-poppins">
          Error: {friendsError}
        </div>
      ) : friends.length === 0 ? (
        <div className="text-[--muted-foreground] text-center font-poppins">
          No friends yet
        </div>
      ) : (
        <div className="flex flex-col overflow-y-auto h-full">
          {friends.map((friend) => (
            <div key={friend.id} className="py-2">
              <button
                key={friend.id}
                className="w-full text-left px-3 py-2 text-sm font-poppins bg-transparent hover:bg-[#3a3b3c5f] transition-colors duration-150 rounded-sm"
              >
                {friend.firstName} {friend.lastName}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
