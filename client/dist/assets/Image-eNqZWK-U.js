import{g as e}from"./index-G_pGp2sZ.js";const I=e`
    query UserImages {
        FetchUserImagesQuery {
            cloudImageID
            _id
            url
            cloudImageName
        }
    }
`,m=e`
    query FetchUserImage($id: ID!) {
        FetchUserImage(id: $id) {
            _id
            cloudImageID
            cloudImageName
            url
        }
    }
`;export{I as F,m as a};
