import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/Components/ui';
import useStore from '@/hooks/useStore';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // 1. Import hook

export default function AvatarIcon() {
  const { loggedInMember, memberLogout } = useStore((state) => state);
  const { t } = useTranslation(); // 2. Initialize t()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Avatar className="relative w-12 h-12 cursor-pointer">
          <div className="absolute inset-0 flex items-center justify-center">
            <AvatarImage
              className="w-12 h-12 rounded-full object-cover border-background"
              src={`${loggedInMember?.photo?.url}?tr=w-128,h-128,cm-round,cq-95,sh-20,q-95,f-auto`}
              alt="User"
            />
            <AvatarFallback className="w-12 h-12 text-xl">
              {`${loggedInMember?.firstName[0]} ${loggedInMember?.lastName[0]}`}
            </AvatarFallback>
          </div>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-50 mr-14">
        {!loggedInMember && (
          <>
            <DropdownMenuLabel>{t('getStarted')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link to="/login">
                <DropdownMenuItem className="hover:bg-[#3a3b3c5f]">{t('login')}</DropdownMenuItem>
              </Link>
              <Link to="/signup">
                <DropdownMenuItem className="hover:bg-[#3a3b3c5f]">{t('signup')}</DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
          </>
        )}

        {loggedInMember && (
          <>
            <DropdownMenuLabel className="text-center">
              <strong>{t('myAccount')}</strong>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link to={`/members/${loggedInMember?.username}`}>
                <DropdownMenuItem className="hover:bg-[#3a3b3c5f]">{t('profile')}</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-center">
                <strong>{t('settings')}</strong>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to="/change-password">
                <DropdownMenuItem className="hover:bg-[#3a3b3c5f]">
                  {t('changePassword')}
                </DropdownMenuItem>
              </Link>
              <Link to="/edit-profile">
                <DropdownMenuItem className="hover:bg-[#3a3b3c5f]">
                  {t('editProfile')}
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link to="/login">
                <DropdownMenuItem className="hover:bg-[#bd5b5b]" onClick={() => memberLogout()}>
                  {t('logout')}
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
