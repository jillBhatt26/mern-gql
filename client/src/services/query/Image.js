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
    query FetchUserImage($id: ID!) {
        FetchUserImage(id: $id) {
            _id
            cloudImageID
            cloudImageName
            url
        }
    }
`;

export { FETCH_USER_IMAGES, FETCH_USER_IMAGE };
