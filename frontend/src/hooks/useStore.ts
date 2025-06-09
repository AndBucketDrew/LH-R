import { create } from "zustand";

import { createMemberSlice } from "./store-slices/memberStore.ts"; 
import type { MemberStore } from "./store-slices/memberStore.ts";


// Makes the useStore cleanier and the code more readable
const useStore = create<MemberStore>((set, get) => ({
  ...createMemberSlice(set, get),
}));

export default useStore;