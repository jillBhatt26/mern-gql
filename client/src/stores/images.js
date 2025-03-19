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
    removeUserImage: image => {
        set(state => ({
            ...state,
            userImages: state.userImages.filter(img => img._id !== image._id)
        }));
    }
}));

export default useImagesStore;
