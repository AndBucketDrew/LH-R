import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ImageOff, MapPin, Calendar, Users } from 'lucide-react';

import useStore from '@/hooks/useStore';
import ProfileHeader from './ProfileHeader';
// this is the Profile for a user that is not ME
function Profile() {
  const { myPosts, fetchMyPosts, loggedInMember } = useStore((state) => state);
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');

  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);

  if (!loggedInMember) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-22 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin rounded-full border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-22">
      <div className="container max-w-4xl mx-auto space-y-6 px-4 pb-8">
        {/* Header */}
        <ProfileHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Area */}
        <div className="max-w-[37.5rem] mx-auto">
          {activeTab === 'posts' ? (
            <div className="space-y-6">
              {myPosts?.length > 0 ? (
                <div className="max-w-[37.5rem] min-h-[10rem] rounded-xl grid grid-cols-3 shadow-md bg-card mx-auto px-4 py-4">
                  {[...myPosts].reverse().map((post) => (
                    <div key={post._id} className="relative w-full p-0.5 aspect-square">
                      <Link to={`/posts/${post._id}`}>
                        <img
                          src={post.imageUrl}
                          alt="Post"
                          className="w-full h-full object-cover rounded"
                        />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-card shadow-md rounded-xl p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <ImageOff className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium text-foreground mb-1">No posts yet</p>
                  <p className="text-sm text-muted-foreground">Share your first moment!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-card shadow-md rounded-xl p-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Users size={20} className="text-primary" />
                About {loggedInMember?.firstName}
              </h2>
              <div className="space-y-4 text-sm">
                {loggedInMember?.location?.city && loggedInMember?.location?.country && (
                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                    <MapPin size={18} className="text-primary mt-0.5" />
                    <div>
                      <div className="font-medium text-foreground">Location</div>
                      <div className="text-muted-foreground">{`${loggedInMember.location.city}, ${loggedInMember.location.country}`}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  <Calendar size={18} className="text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">Member Since</div>
                    <div className="text-muted-foreground">
                      {loggedInMember?.createdAt
                        ? new Date(loggedInMember.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'Recently joined'}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  <Users size={18} className="text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">Posts</div>
                    <div className="text-muted-foreground">{myPosts?.length || 0} posts</div>
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

export default Profile;
