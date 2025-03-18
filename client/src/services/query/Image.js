import { gql } from '@apollo/client';
import '../types';

const FETCH_USER_IMAGES = gql`
    query UserImages {
        FetchUserImagesQuery {
            cloudImageID
            _id
            url
            cloudImageName
        }
    }
`;

const FETCH_USER_IMAGE = gql`
    query FetchUserImage($fetchImageInput: FetchImageInput!) {
        FetchUserImage(fetchImageInput: $fetchImageInput) {
            url
            _id
            cloudImageID
            cloudImageName
        }
    }
`;

export { FETCH_USER_IMAGES, FETCH_USER_IMAGE };
