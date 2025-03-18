import { gql } from '@apollo/client';
import '../types';

const UPLOAD_IMAGE = gql`
    mutation UploadImage($image: Upload!) {
        UploadImage(image: $image) {
            encoding
            mimetype
            filename
            cloudImageID
            cloudImageName
        }
    }
`;

const DELETE_IMAGE = gql`
    mutation DeleteUserImage($deleteImageInput: DeleteImageInput!) {
        DeleteImage(deleteImageInput: $deleteImageInput)
    }
`;

export { UPLOAD_IMAGE, DELETE_IMAGE };
