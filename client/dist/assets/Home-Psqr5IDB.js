const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-BSFqXpFX.js","assets/index-CKQKzKKF.css"])))=>i.map(i=>d[i]);
import{g as l,r as o,c as d,j as e,N as u,F as m,_ as x}from"./index-BSFqXpFX.js";import{u as j}from"./useQuery-Tmdc_XQo.js";const p=l`
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
`;const b=o.lazy(()=>x(()=>import("./index-BSFqXpFX.js").then(t=>t.H),__vite__mapDeps([0,1]))),T=()=>{const[t,n]=o.useState(null),c=d(s=>s.userTodos),i=d(s=>s.setUserTodos),{data:r,error:a,loading:h}=j(p,{fetchPolicy:"network-only"});return o.useEffect(()=>{if(a){const s=a.toString().split(":").pop();n(s)}},[a]),o.useEffect(()=>{r&&r.todos&&i(r.todos)},[r,i]),h?e.jsx(b,{}):e.jsxs(e.Fragment,{children:[e.jsx(u,{}),e.jsxs("div",{className:"container mt-5",children:[t&&e.jsxs("div",{className:"alert alert-dismissible alert-danger mt-5",children:[e.jsx("button",{type:"button",className:"btn-close",onClick:()=>n(null)}),t]}),c.length>0&&e.jsxs("table",{className:"table table-hover mt-5",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{scope:"col",children:"Name"}),e.jsx("th",{scope:"col",children:"Description"}),e.jsx("th",{scope:"col",children:"Status"}),e.jsx("th",{scope:"col"})]})}),e.jsx("tbody",{children:c.map(s=>e.jsxs("tr",{className:"table-active",children:[e.jsx("th",{scope:"row",children:s.name}),e.jsx("td",{children:s.description}),e.jsx("td",{children:s.status}),e.jsxs("td",{className:"d-flex justify-content-center gap-2",children:[e.jsx("button",{className:"btn btn-warning",children:"Update"}),e.jsx("button",{className:"btn btn-danger",children:"Delete"})]})]},s.id))})]})]}),e.jsx(m,{})]})};export{T as default};
