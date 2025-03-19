const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-DZYU-leM.js","assets/index-CKQKzKKF.css"])))=>i.map(i=>d[i]);
import{j as e,I,g,c as h,r as t,N as x,F as j,_ as N}from"./index-DZYU-leM.js";import{u as f}from"./useQuery-CZ9s2ZCo.js";const p=({userImages:a})=>a.length>0?e.jsx("div",{className:"container",children:e.jsx("div",{className:"d-grid",children:e.jsx("div",{className:"row g-3",children:a.length>0&&a.map((r,s)=>e.jsx("div",{className:"col-sm-12 col-md-6 col-lg-4 mw-100",children:e.jsx(I,{src:r.url,alt:r.cloudImageName})},s))})})}):e.jsx("div",{className:"container mt-5 mx-auto",children:e.jsx("div",{className:"w-100",children:e.jsxs("h3",{className:"text-center",children:["You haven't added any images yet.",e.jsx("div",{className:"d-grid mt-5",children:e.jsx("div",{className:"col-sm-12 col-md-4 mx-auto",children:e.jsx("button",{type:"button",className:"btn btn-success",children:"Add image now"})})})]})})}),v=g`
    query UserImages {
        FetchUserImagesQuery {
            cloudImageID
            _id
            url
            cloudImageName
        }
    }
`;g`
    query FetchUserImage($fetchImageInput: FetchImageInput!) {
        FetchUserImage(fetchImageInput: $fetchImageInput) {
            url
            _id
            cloudImageID
            cloudImageName
        }
    }
`;const d=h(a=>({userImages:[],setUserImages:r=>{a(s=>({...s,userImages:r}))},pushNewImage:r=>{a(s=>({...s,userImages:[r,...s.userImages]}))},removeUserImage:r=>{a(s=>({...s,userImages:s.userImages.filter(m=>m._id!==r._id)}))}})),y=t.lazy(()=>N(()=>import("./index-DZYU-leM.js").then(a=>a.z),__vite__mapDeps([0,1]))),U=()=>{const[a,r]=t.useState(!0),[s,m]=t.useState(null),{data:l,error:n,loading:i}=f(v),u=d(c=>c.userImages),o=d(c=>c.setUserImages);return t.useEffect(()=>{r(i)},[i]),t.useEffect(()=>{l&&l.FetchUserImagesQuery&&o(l.FetchUserImagesQuery)},[l,o]),t.useEffect(()=>{if(n){const c=n.toString().split(":").pop();m(c)}},[n]),a?e.jsx(y,{}):e.jsxs(e.Fragment,{children:[e.jsx(x,{}),e.jsxs("div",{className:"container",children:[e.jsxs("div",{className:"my-5",children:[e.jsx("h1",{className:"text-center",children:"Gallery"}),s&&e.jsxs("div",{className:"alert alert-dismissible alert-danger mt-5",children:[e.jsx("button",{type:"button",className:"btn-close",onClick:()=>m(null)}),s]})]}),e.jsx(p,{userImages:u})]}),e.jsx(j,{})]})};export{U as default};
