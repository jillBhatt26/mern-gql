import { gql } from '@apollo/client';
import '../types';

const UPLOAD_IMAGE = gql`
    mutation UploadImage($image: Upload!) {
        UploadImage(image: $image) {
            _id
            encoding
            mimetype
            filename
            cloudImageID
            cloudImageName
        }
    }
`;

const DELETE_IMAGE = gql`
    mutation DeleteImage($id: ID!) {
        DeleteImage(id: $id)
    }
`;

export { UPLOAD_IMAGE, DELETE_IMAGE };
