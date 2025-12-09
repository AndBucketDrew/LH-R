import useStore from '@/hooks/useStore';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

interface ProfileHeaderProps {
  activeTab: 'posts' | 'about';
  setActiveTab: (tab: 'posts' | 'about') => void;
}

export default function ProfileHeader({ activeTab, setActiveTab }: ProfileHeaderProps) {
  const { loggedInMember } = useStore();

  return (
    <div className="rounded-xl shadow-xl bg-card overflow-hidden">
      {/* Profile content */}
      <div className="px-6 pb-6 relative">
        {/* Actions */}
        <div className="absolute top-4 right-8 flex gap-2 z-10">
          <Link
            to="/edit-profile"
            className="bg-muted/90 backdrop-blur-sm text-foreground px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-muted transition shadow-md"
          >
            Edit Profile
          </Link>
        </div>
        {/* Profile Picture */}
        <div className="flex justify-center mt-4 mb-4">
          <img
            src={`${loggedInMember?.photo?.url}?tr=w-128,h-128,cm-round,cq-95,sh-10,q-95,f-auto`}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-background object-cover shadow-lg"
          />
        </div>
        {/* Name & Username */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">
            {loggedInMember?.firstName} {loggedInMember?.lastName}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{`@${loggedInMember?.username}`}</p>
        </div>
        {/* Info Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {loggedInMember?.email && (
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full text-sm">
              <span className="text-muted-foreground">{loggedInMember.email}</span>
            </div>
          )}
          {loggedInMember?.location?.city && loggedInMember?.location?.country && (
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full text-sm">
              <MapPin size={14} className="text-primary" />
              <span className="text-muted-foreground">{`${loggedInMember.location.city}, ${loggedInMember.location.country}`}</span>
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
  );
}
