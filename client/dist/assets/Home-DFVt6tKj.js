const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-G_pGp2sZ.js","assets/index-DTCJZlBg.css"])))=>i.map(i=>d[i]);
import{r as t,c as i,d as b,D as f,j as e,T as p,g as T,N as g,F as E,_ as N}from"./index-G_pGp2sZ.js";import{C as S}from"./ConfirmDeleteModal-DbnxbUsz.js";import{u as v}from"./useQuery-DArphaG1.js";const w=({todo:s})=>{const[o,n]=t.useState(!1),[c,u]=t.useState(!1),[m,a]=t.useState(null),l=i(d=>d.userTodos),h=i(d=>d.setUserTodos),[r,{loading:j}]=b(f,{variables:{id:s.id},onCompleted:d=>{d.DeleteTodo&&(h(l.filter(x=>x.id!==s.id)),n(!1))},onError:d=>{const x=d.toString().split(":").pop();a(x)}});return e.jsxs("tr",{children:[e.jsx("th",{scope:"row",children:s.name}),e.jsx("td",{children:s.description}),e.jsx("td",{children:s.status}),e.jsxs("td",{className:"d-flex gap-3",children:[e.jsx("button",{className:"btn btn-sm btn-warning",onClick:()=>u(!0),children:"Update"}),e.jsx("button",{className:"btn btn-sm btn-danger",onClick:()=>n(!0),children:"Delete"})]}),e.jsx(S,{isOpen:o,onClose:()=>n(!1),onConfirm:r,message:j?"Loading...":"This action is irreversible. Your todo will be permanently deleted. Wish to proceed?",confirmButtonLabel:"Delete Todo",error:m}),e.jsx(p,{showTodoFormModal:c,setShowTodoFormModal:u,purpose:"Update",todoToUpdate:s})]})},D=()=>{const s=i(o=>o.userTodos);return e.jsx(e.Fragment,{children:s.length>0&&e.jsx("div",{className:"table-responsive",children:e.jsxs("table",{className:"table table-hover",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{scope:"col",children:"Name"}),e.jsx("th",{scope:"col",children:"Description"}),e.jsx("th",{scope:"col",children:"Status"}),e.jsx("th",{scope:"col",children:"Actions"})]})}),e.jsx("tbody",{children:s.map(o=>e.jsx(w,{todo:o},o.id))})]})})})},F=T`
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
`;T`
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
`;const M=t.lazy(()=>N(()=>import("./index-G_pGp2sZ.js").then(s=>s.J),__vite__mapDeps([0,1]))),C=()=>{const[s,o]=t.useState(null),[n,c]=t.useState(!1),u=i(r=>r.userTodos),m=i(r=>r.setUserTodos),{data:a,error:l,loading:h}=v(F,{fetchPolicy:"network-only"});return t.useEffect(()=>{if(l){const r=l.toString().split(":").pop();o(r)}},[l]),t.useEffect(()=>{a&&a.todos&&m(a.todos)},[a,m]),h?e.jsx(M,{}):e.jsxs(e.Fragment,{children:[e.jsx(g,{}),e.jsxs("div",{className:"container mt-5",children:[s&&e.jsxs("div",{className:"alert alert-dismissible alert-danger mt-5",children:[e.jsx("button",{type:"button",className:"btn-close",onClick:()=>o(null)}),s]}),u.length>0?e.jsx(D,{}):e.jsx("div",{className:"w-100",children:e.jsxs("h3",{className:"text-center",children:["You haven't added any todos yet.",e.jsx("div",{className:"d-grid mt-5",children:e.jsx("div",{className:"col-sm-12 col-md-4 mx-auto",children:e.jsx("button",{type:"button",className:"btn btn-success",onClick:()=>c(!0),children:"Add new todo"})})})]})})]}),e.jsx(E,{}),e.jsx(p,{showTodoFormModal:n,setShowTodoFormModal:c,purpose:"Add"})]})};export{C as default};
