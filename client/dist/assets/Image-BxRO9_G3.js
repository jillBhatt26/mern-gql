import{k as e}from"./index-BoMZq1zZ.js";const I=e`
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
