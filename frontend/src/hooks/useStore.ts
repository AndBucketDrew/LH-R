import { create } from 'zustand';

import { createMemberSlice } from './store-slices/memberStore.ts';
import { createFriendsSlice } from './store-slices/friendsStore.ts';
import type { MemberStore } from './store-slices/memberStore.ts';
import type { FriendsStore } from './store-slices/friendsStore.ts';
import { createPostsSlice, type PostsStore } from './store-slices/postsStore.ts';

type StoreState = MemberStore & FriendsStore & PostsStore;

const useStore = create<StoreState>((set, get) => ({
  ...createMemberSlice(set, get),
  ...createFriendsSlice(set, get),
  ...createPostsSlice(set,get),
}));

export default useStore;
