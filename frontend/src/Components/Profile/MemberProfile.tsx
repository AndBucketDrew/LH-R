import { Link, useParams } from 'react-router-dom';
import { useEffect, useLayoutEffect, useState } from 'react';
import {
  ImageOff,
  UserMinus,
  UserPlus,
  UserCheck,
  UserX,
  MapPin,
  Calendar,
  Users,
} from 'lucide-react';
import { Loader2 } from 'lucide-react';
import useStore from '@/hooks/useStore.ts';
import PostCardItem from '../Posts/PostCardItem/PostCardItem';

function MemberProfile() {
  const { username } = useParams<{ username: string }>();
  const {
    memberPosts,
    fetchMemberPosts,
    user,
    getMemberByUsername,
    friends,
    pending,
    fetchFriends,
    fetchPending,
    deleteFriend,
    addFriend,
    loggedInMember,
    acceptFriendRequest,
    rejectFriendRequest,
    fetchRelationshipStatus,
    fetchMyPosts,
    relationshipStatus,
    clearProfileData,
    toggleLike,
    addComment,
    setShowSharePost,
    setSharePostId,
  } = useStore((state) => state);
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');

  useEffect(() => {
    fetchFriends();
    fetchPending();
    fetchMyPosts();
  }, [fetchFriends, fetchPending, fetchMyPosts]);

  useLayoutEffect(() => {
    if (!username) return;
    setProfileLoading(true);
    clearProfileData();
    (async () => {
      try {
        const [_, userRes] = await Promise.all([
          fetchMemberPosts(username),
          getMemberByUsername(username),
        ]);
        if (userRes?._id) {
          await fetchRelationshipStatus(userRes._id);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setProfileLoading(false);
      }
    })().catch(console.error);
  }, [username, clearProfileData, fetchMemberPosts, getMemberByUsername, fetchRelationshipStatus]);

  const isFriend = user?._id ? friends.some((friend) => friend._id === user._id) : false;
  const isPending = user?._id ? pending.some((pending) => pending._id === user._id) : false;
  const isMe = loggedInMember?._id && user?._id ? loggedInMember._id === user._id : false;

  const handleToggleLike = (postId: string) => {
    toggleLike(postId);
  };

  const handleCommentSubmit = async (postId: string, text: string) => {
    try {
      await addComment(postId, { text });
    } catch (err) {
      console.error('Error adding comment:', err);
      throw err;
    }
  };

  const handleShare = (postId: string) => {
    setSharePostId(postId);
    setShowSharePost(true);
  };

  if (profileLoading || !user) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-22 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const reversedPosts = memberPosts ? [...memberPosts].reverse() : [];

  return (
    <div className="min-h-screen bg-background text-foreground pt-10">
      <div className="container max-w-4xl mx-auto space-y-6 px-4 pb-8">
        {/* Header */}
        <div className="rounded-xl shadow-xl bg-card overflow-hidden">
          {/* Profile content */}
          <div className="px-6 pb-6 relative">
            {/* Actions */}
            <div className="absolute top-4 right-8 flex gap-2 z-0">
              {isMe ? (
                <Link
                  to="/edit-profile"
                  className="bg-muted/90 backdrop-blur-sm text-foreground px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-muted transition shadow-md"
                >
                  Edit Profile
                </Link>
              ) : isPending ? (
                <>
                  <button
                    onClick={async () => {
                      await acceptFriendRequest(user._id);
                      fetchFriends();
                      fetchPending();
                    }}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-all hover:scale-105"
                  >
                    <UserPlus size={16} /> Accept
                  </button>
                  <button
                    onClick={async () => {
                      await rejectFriendRequest(user._id);
                      fetchFriends();
                      fetchPending();
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-all hover:scale-105"
                  >
                    <UserX size={16} /> Reject
                  </button>
                </>
              ) : isFriend ? (
                <button
                  onClick={async () => {
                    await deleteFriend(user._id);
                    fetchFriends();
                    fetchPending();
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-2 font-semibold px-4 py-2 rounded-lg shadow-md transition-all hover:scale-105"
                >
                  <UserMinus size={16} /> Remove Friend
                </button>
              ) : isAddingFriend || relationshipStatus === 'pending' ? (
                <button className="bg-muted text-muted-foreground cursor-not-allowed flex items-center gap-2 font-semibold px-4 py-2 rounded-lg shadow-md">
                  <UserCheck size={16} /> Request Sent
                </button>
              ) : (
                <button
                  onClick={async () => {
                    setIsAddingFriend(true);
                    await addFriend(user._id);
                    setIsAddingFriend(false);
                  }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 font-semibold px-4 py-2 rounded-lg shadow-md transition-all hover:scale-105"
                >
                  <UserPlus size={16} /> Add Friend
                </button>
              )}
            </div>
            {/* Profile Picture */}
            <div className="flex justify-center mt-4 mb-4">
              <img
                src={`${user?.photo?.url}?tr=w-128,h-128,cm-round,cq-95,sh-10,q-95,f-auto`}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-background object-cover shadow-lg"
              />
            </div>
            {/* Name & Username */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">{`@${user?.username}`}</p>
            </div>
            {/* Info Pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {user?.email && (
                <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full text-sm">
                  <span className="text-muted-foreground">{user.email}</span>
                </div>
              )}
              {user?.location?.city && user?.location?.country && (
                <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full text-sm">
                  <MapPin size={14} className="text-primary" />
                  <span className="text-muted-foreground">{`${user.location.city}, ${user.location.country}`}</span>
                </div>
              )}
            </div>
            {/* Tabs */}
            <div className="flex justify-center gap-1 mt-6 bg-muted/30 p-1 rounded-lg w-fit mx-auto">
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'posts'
                    ? 'bg-background text-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'about'
                    ? 'bg-background text-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                About
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-[37.5rem] mx-auto">
          {activeTab === 'posts' ? (
            <div className="space-y-6">
              {reversedPosts.length > 0 ? (
                reversedPosts.map((post) => (
                  <PostCardItem
                    key={post._id}
                    post={post}
                    loggedInMember={loggedInMember}
                    onToggleLike={handleToggleLike}
                    onCommentSubmit={handleCommentSubmit}
                    onShare={handleShare}
                    showAllComments={false}
                    commentsToShow={3}
                    clickable={true}
                  />
                ))
              ) : (
                <div className="bg-card shadow-md rounded-xl p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <ImageOff className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium text-foreground mb-1">No posts yet</p>
                  <p className="text-sm text-muted-foreground">
                    {isMe ? 'Share your first moment!' : 'Check back later for new content'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-card shadow-md rounded-xl p-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Users size={20} className="text-primary" />
                About {user?.firstName}
              </h2>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  <MapPin size={18} className="text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-left text-foreground">Location</div>
                    <div className="text-muted-foreground text-left">{`${user?.location?.city}, ${user?.location?.country}`}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  <Calendar size={18} className="text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-left text-foreground">Member Since</div>
                    <div className="text-muted-foreground text-left">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'Recently joined'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemberProfile;
