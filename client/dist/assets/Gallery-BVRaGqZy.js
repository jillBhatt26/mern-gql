const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-Bmc6KnAu.js","assets/index-CKQKzKKF.css"])))=>i.map(i=>d[i]);
import{r as a,a as i,j as e,I as g,A as I,g as u,N as h,F as x,_ as j}from"./index-Bmc6KnAu.js";import{u as N}from"./useQuery-C4-Yg4gC.js";const f=()=>{const[c,l]=a.useState(!1),t=i(s=>s.userImages);return t.length>0?e.jsx("div",{className:"container",children:e.jsx("div",{className:"d-grid",children:e.jsx("div",{className:"row g-3",children:t.length>0&&t.map((s,r)=>e.jsx("div",{className:"col-sm-12 col-md-6 col-lg-4 mw-100",children:e.jsx(g,{src:s.url,alt:s.cloudImageName})},r))})})}):e.jsxs("div",{className:"container mt-5 mx-auto",children:[e.jsx("div",{className:"w-100",children:e.jsxs("h3",{className:"text-center",children:["You haven't added any images yet.",e.jsx("div",{className:"d-grid mt-5",children:e.jsx("div",{className:"col-sm-12 col-md-4 mx-auto",children:e.jsx("button",{type:"button",className:"btn btn-success",onClick:()=>l(!0),children:"Add image now"})})})]})}),e.jsx(I,{showAddImageFormModal:c,setShowAddImageFormModal:l})]})},p=u`
    query UserImages {
        FetchUserImagesQuery {
            cloudImageID
            _id
            url
            cloudImageName
        }
    }
`;u`
    query FetchUserImage($fetchImageInput: FetchImageInput!) {
        FetchUserImage(fetchImageInput: $fetchImageInput) {
            url
            _id
            cloudImageID
            cloudImageName
        }
    }
`;const v=a.lazy(()=>j(()=>import("./index-Bmc6KnAu.js").then(c=>c.B),__vite__mapDeps([0,1]))),E=()=>{const[c,l]=a.useState(!0),[t,s]=a.useState(null),{data:r,error:m,loading:o}=N(p),d=i(n=>n.setUserImages);return a.useEffect(()=>{l(o)},[o]),a.useEffect(()=>{r&&r.FetchUserImagesQuery&&d(r.FetchUserImagesQuery)},[r,d]),a.useEffect(()=>{if(m){const n=m.toString().split(":").pop();s(n)}},[m]),c?e.jsx(v,{}):e.jsxs(e.Fragment,{children:[e.jsx(h,{}),e.jsxs("div",{className:"container",children:[e.jsxs("div",{className:"my-5",children:[e.jsx("h1",{className:"text-center",children:"Gallery"}),t&&e.jsxs("div",{className:"alert alert-dismissible alert-danger mt-5",children:[e.jsx("button",{type:"button",className:"btn-close",onClick:()=>s(null)}),t]})]}),e.jsx(f,{})]}),e.jsx(x,{})]})};export{E as default};
