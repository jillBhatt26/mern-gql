const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-DxSJI894.js","assets/index-CKQKzKKF.css"])))=>i.map(i=>d[i]);
import{j as e,g as d,r as a,N as h,F as x,_ as I}from"./index-DxSJI894.js";import{u as j}from"./useQuery-r5opyu3F.js";const f=({className:s,...t})=>e.jsx("img",{className:`mw-100 object-fit-cover ${s}`,...t}),N=({userImages:s})=>s.length>0?e.jsx("div",{className:"container",children:e.jsx("div",{className:"d-grid",children:e.jsx("div",{className:"row g-3",children:s.length>0&&s.map((t,l)=>e.jsx("div",{className:"col-sm-12 col-md-6 col-lg-4 mw-100",children:e.jsx(f,{src:t.url,alt:t.cloudImageName})},l))})})}):e.jsx("div",{className:"container mt-5 mx-auto",children:e.jsx("div",{className:"w-100",children:e.jsxs("h3",{className:"text-center",children:["You haven't added any images yet.",e.jsx("div",{className:"d-grid mt-5",children:e.jsx("div",{className:"col-sm-12 col-md-4 mx-auto",children:e.jsx("button",{type:"button",className:"btn btn-success",children:"Add image now"})})})]})})}),p=d`
    query UserImages {
        FetchUserImagesQuery {
            cloudImageID
            _id
            url
            cloudImageName
        }
    }
`;d`
    query FetchUserImage($fetchImageInput: FetchImageInput!) {
        FetchUserImage(fetchImageInput: $fetchImageInput) {
            url
            _id
            cloudImageID
            cloudImageName
        }
    }
`;const v=a.lazy(()=>I(()=>import("./index-DxSJI894.js").then(s=>s.z),__vite__mapDeps([0,1]))),b=()=>{const[s,t]=a.useState([]),[l,u]=a.useState(!0),[m,o]=a.useState(null),{data:r,error:c,loading:i}=j(p);a.useEffect(()=>{u(i)},[i]),a.useEffect(()=>{r&&r.FetchUserImagesQuery&&t(r.FetchUserImagesQuery)},[r]),a.useEffect(()=>{if(c){const n=c.toString().split(":").pop();o(n)}},[c]);const g=async n=>{n.preventDefault()};return l?e.jsx(v,{}):e.jsxs(e.Fragment,{children:[e.jsx(h,{}),e.jsxs("div",{className:"container",children:[e.jsxs("div",{className:"my-5",children:[e.jsx("h1",{className:"text-center",children:"Gallery"}),m&&e.jsxs("div",{className:"alert alert-dismissible alert-danger mt-5",children:[e.jsx("button",{type:"button",className:"btn-close",onClick:()=>o(null)}),m]}),e.jsx("form",{noValidate:!0,autoComplete:"off",onSubmit:g,children:e.jsxs("div",{children:[e.jsx("label",{htmlFor:"formFile",className:"form-label mt-4",children:"Upload new image"}),e.jsx("input",{className:"form-control",type:"file",id:"formFile"})]})})]}),e.jsx(N,{userImages:s})]}),e.jsx(x,{})]})};export{b as default};
