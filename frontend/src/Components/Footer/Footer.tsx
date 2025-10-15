import { ModeToggle } from '@/ModeToggle/ModeToggle';
import { NavLink } from 'react-router-dom';
import {
  HouseIcon,
  UserIcon,
  ChatsCircleIcon,
  InfoIcon, // New: For About Us
} from '@phosphor-icons/react';

export default function Footer() {
  return (
    <footer className="font-poppins relative w-full p-6 bg-card text-card-foreground border-t border-border shadow-md mt-auto">
      {' '}
      {/* mt-auto pushes to bottom in flex-col */}
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* Left: About Us */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <InfoIcon size={20} weight="thin" className="text-primary" />
            <h3 className="font-semibold text-foreground">About Us</h3>
          </div>
          <p className="text-muted-foreground">
            We are SocialFeed, a vibrant platform for sharing moments, connecting with friends, and
            discovering new stories. Founded in 2023, our mission is to foster genuine interactions
            in a digital world.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Random fact: Over 50,000 users have shared their first post with us!
          </p>
        </div>

        {/* Center: Quick Links */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-foreground mb-2">Quick Links</h3>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              <NavLink to="/" className="hover:text-primary flex items-center gap-1">
                <HouseIcon size={16} weight="thin" />
                Home (Feed)
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" className="hover:text-primary flex items-center gap-1">
                <UserIcon size={16} weight="thin" />
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink to="/messages" className="hover:text-primary flex items-center gap-1">
                <ChatsCircleIcon size={16} weight="thin" />
                Messages
              </NavLink>
            </li>
            <li>
              <a
                href="#about"
                className="hover:text-primary flex items-center gap-1 cursor-pointer"
              >
                {' '}
                {/* Internal anchor; upgrade to route later */}
                <InfoIcon size={16} weight="thin" />
                About
              </a>
            </li>
          </ul>
        </div>

        {/* Right: Theme Toggle & Copyright */}
        <div className="flex flex-col items-end gap-4">
          <ModeToggle />
          <div className="text-xs text-muted-foreground text-right">
            <p>&copy; 2025 SocialFeed App. All rights reserved.</p>
            <p className="mt-1">Built with ❤️ using React & Tailwind.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
