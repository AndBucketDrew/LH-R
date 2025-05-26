import type { IMember } from '../../models/member.model.ts';
import { updateInstance } from '@/utils/object.common-js.ts';
import { fetchAPI } from '@/utils/index.ts';

export interface MemberStore {
    member: IMember;
    loading: boolean;
    setMember: (data: Partial<IMember>) => void;
    resetMember: () => void; 
    searchMembers: (q: string) => Promise<IMember[]>;
}

const defaultMember: IMember = {
    id: '',
    username: '',
    firstName: '',
    lastName: '',
};

export const createMemberSlice = (set: any, get: any): MemberStore => ({
    member: defaultMember,
    loading: false,

    setMember: (data: Partial<IMember>) => {
        set((state: MemberStore) => ({
            member: updateInstance(state.member, data),
        }));
    },

    resetMember: () => set({member: defaultMember}),

    searchMembers: async (q: string) => {
        try {
        set({ loading: true });

        const response = await fetchAPI({ method: "get", url: `/api/members/search?q=${q}`});

        // Update state with fetched members and reset loading
        set({ loading: false });
        return response.data;
        } catch (err) {
        console.error("Error fetching members", err);
        set({ loading: false });
        }
    },
})

