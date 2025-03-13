import { create } from 'zustand';

const useAuthStore = create(set => ({
    authUser: null,
    setAuthUser: user => {
        set(state => ({
            ...state,
            authUser: user
        }));
    },
    unsetAuthUser: () => {
        set(state => ({
            ...state,
            authUser: null
        }));
    }
}));

export default useAuthStore;
