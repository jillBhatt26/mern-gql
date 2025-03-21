const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-Bz4YA_Hw.js","assets/index-DTCJZlBg.css"])))=>i.map(i=>d[i]);
import{g as d,r,c as l,j as s,N as u,F as m,_ as x}from"./index-Bz4YA_Hw.js";import{u as j}from"./useQuery-DOlNT7Pb.js";const p=d`
    query FetchUserTodos {
        todos {
            description
            id
            name
            status
            user {
                _id
                email
                username
            }
        }
    }
`;d`
    query FetchTodo($id: ID!) {
        todo(id: $id) {
            description
            id
            name
            status
            user {
                _id
                email
                username
            }
        }
    }
`;const b=r.lazy(()=>x(()=>import("./index-Bz4YA_Hw.js").then(t=>t.H),__vite__mapDeps([0,1]))),T=()=>{const[t,a]=r.useState(null),i=l(e=>e.userTodos),c=l(e=>e.setUserTodos),{data:o,error:n,loading:h}=j(p,{fetchPolicy:"network-only"});return r.useEffect(()=>{if(n){const e=n.toString().split(":").pop();a(e)}},[n]),r.useEffect(()=>{o&&o.todos&&c(o.todos)},[o,c]),h?s.jsx(b,{}):s.jsxs(s.Fragment,{children:[s.jsx(u,{}),s.jsxs("div",{className:"container mt-5",children:[t&&s.jsxs("div",{className:"alert alert-dismissible alert-danger mt-5",children:[s.jsx("button",{type:"button",className:"btn-close",onClick:()=>a(null)}),t]}),i.length>0&&s.jsx("div",{className:"table-responsive",children:s.jsxs("table",{className:"table table-hover",children:[s.jsx("thead",{children:s.jsxs("tr",{children:[s.jsx("th",{scope:"col",children:"Name"}),s.jsx("th",{scope:"col",children:"Description"}),s.jsx("th",{scope:"col",children:"Status"}),s.jsx("th",{scope:"col",children:"Actions"})]})}),s.jsx("tbody",{children:s.jsxs("tr",{children:[s.jsx("th",{scope:"row",children:"Default"}),s.jsx("td",{children:"Column content"}),s.jsx("td",{children:"Column content"}),s.jsxs("td",{className:"d-flex gap-3",children:[s.jsx("button",{className:"btn btn-sm btn-warning",children:"Update"}),s.jsx("button",{className:"btn btn-sm btn-danger",children:"Delete"})]})]})})]})})]}),s.jsx(m,{})]})};export{T as default};
