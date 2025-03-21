const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-klD3Pqlt.js","assets/index-DTCJZlBg.css"])))=>i.map(i=>d[i]);
import{g as l,r as o,c as d,j as s,N as m,F as u,_ as x}from"./index-klD3Pqlt.js";import{u as j}from"./useQuery-bC1-zd4Y.js";const p=l`
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
`;l`
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
`;const b=o.lazy(()=>x(()=>import("./index-klD3Pqlt.js").then(t=>t.H),__vite__mapDeps([0,1]))),T=()=>{const[t,a]=o.useState(null),c=d(e=>e.userTodos),i=d(e=>e.setUserTodos),{data:r,error:n,loading:h}=j(p,{fetchPolicy:"network-only"});return o.useEffect(()=>{if(n){const e=n.toString().split(":").pop();a(e)}},[n]),o.useEffect(()=>{r&&r.todos&&i(r.todos)},[r,i]),h?s.jsx(b,{}):s.jsxs(s.Fragment,{children:[s.jsx(m,{}),s.jsxs("div",{className:"container mt-5",children:[t&&s.jsxs("div",{className:"alert alert-dismissible alert-danger mt-5",children:[s.jsx("button",{type:"button",className:"btn-close",onClick:()=>a(null)}),t]}),c.length>0&&s.jsx("div",{className:"table-responsive",children:s.jsxs("table",{className:"table table-hover",children:[s.jsx("thead",{children:s.jsxs("tr",{children:[s.jsx("th",{scope:"col",children:"Name"}),s.jsx("th",{scope:"col",children:"Description"}),s.jsx("th",{scope:"col",children:"Status"}),s.jsx("th",{scope:"col",children:"Actions"})]})}),s.jsx("tbody",{children:c.map(e=>s.jsxs("tr",{children:[s.jsx("th",{scope:"row",children:e.name}),s.jsx("td",{children:e.description}),s.jsx("td",{children:e.status}),s.jsxs("td",{className:"d-flex gap-3",children:[s.jsx("button",{className:"btn btn-sm btn-warning",children:"Update"}),s.jsx("button",{className:"btn btn-sm btn-danger",children:"Delete"})]})]},e.id))})]})})]}),s.jsx(u,{})]})};export{T as default};
