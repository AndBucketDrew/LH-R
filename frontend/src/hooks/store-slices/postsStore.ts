import type { Post } from "@/models/posts.model";
import fetchAPI from "@/utils";

export interface PostsStore {
    currentPost: Post | null;
    loading: boolean;
    error: string | null;
    allPosts: Post[];

    fetchPostById: (id: string) => Promise<void>;
    fetchAllPosts: () => Promise<void>;
}

const initialState = {
    currentPost: null,
    loading: false,
    error: null,
    allPosts: [],
}

const createPostsSlice = (set: any, get: any): PostsStore => ({
    ...initialState,

    fetchPostById: async (id: string) => {
        try {
            set({ loading: true });
            const response = await fetchAPI({ url: `/posts/${id}` });
            set({ currentPost: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    fetchAllPosts: async () => {
        try {
            set({ loading: true });
            const response = await fetchAPI({ url: "/posts" });
            set({ allPosts: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    }
});

export { createPostsSlice }