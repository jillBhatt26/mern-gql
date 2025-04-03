import { create } from 'zustand';

const useLoadingStore = create(set => ({
    isLoading: false,
    setIsLoading: newIsLoading => {
        set(state => ({
            ...state,
            isLoading: newIsLoading
        }));
    },
    toggleLoading: () => {
        set(state => ({
            ...state,
            isLoading: !state.isLoading
        }));
    }
}));

export default useLoadingStore;
