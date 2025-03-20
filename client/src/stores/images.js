import { create } from 'zustand';

const useImagesStore = create(set => ({
    userImages: [],
    setUserImages: userImages => {
        set(state => ({
            ...state,
            userImages
        }));
    },
    pushNewImage: newImage => {
        set(state => ({
            ...state,
            userImages: [newImage, ...state.userImages]
        }));
    },
    removeUserImage: imageID => {
        set(state => ({
            ...state,
            userImages: state.userImages.filter(img => img._id !== imageID)
        }));
    },
    removeAllUserImages: () => {
        set(state => ({
            ...state,
            userImages: []
        }));
    }
}));

export default useImagesStore;
