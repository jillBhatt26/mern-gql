const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-CEe57qCl.js","assets/index-DTCJZlBg.css"])))=>i.map(i=>d[i]);
import{r,c as l,d as j,D as p,j as e,g as x,N as T,F as b,T as f,_ as g}from"./index-CEe57qCl.js";import{C as E}from"./ConfirmDeleteModal-iVgOaeKc.js";import{u as N}from"./useQuery-D9Og0_Is.js";const v=({todo:s})=>{const[t,d]=r.useState(!1),[i,m]=r.useState(null),c=l(o=>o.userTodos),n=l(o=>o.setUserTodos),[a,{loading:u}]=j(p,{variables:{id:s.id},onCompleted:o=>{o.DeleteTodo&&(n(c.filter(h=>h.id!==s.id)),d(!1))},onError:o=>{const h=o.toString().split(":").pop();m(h)}});return e.jsxs("tr",{children:[e.jsx("th",{scope:"row",children:s.name}),e.jsx("td",{children:s.description}),e.jsx("td",{children:s.status}),e.jsxs("td",{className:"d-flex gap-3",children:[e.jsx("button",{className:"btn btn-sm btn-warning",children:"Update"}),e.jsx("button",{className:"btn btn-sm btn-danger",onClick:()=>d(!0),children:"Delete"})]}),e.jsx(E,{isOpen:t,onClose:()=>d(!1),onConfirm:a,message:u?"Loading...":"This action is irreversible. Your todo will be permanently deleted. Wish to proceed?",confirmButtonLabel:"Delete Todo",error:i})]})},D=()=>{const s=l(t=>t.userTodos);return e.jsx(e.Fragment,{children:s.length>0&&e.jsx("div",{className:"table-responsive",children:e.jsxs("table",{className:"table table-hover",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{scope:"col",children:"Name"}),e.jsx("th",{scope:"col",children:"Description"}),e.jsx("th",{scope:"col",children:"Status"}),e.jsx("th",{scope:"col",children:"Actions"})]})}),e.jsx("tbody",{children:s.map(t=>e.jsx(v,{todo:t},t.id))})]})})})},_=x`
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
`;x`
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
`;const y=r.lazy(()=>g(()=>import("./index-CEe57qCl.js").then(s=>s.J),__vite__mapDeps([0,1]))),C=()=>{const[s,t]=r.useState(null),[d,i]=r.useState(!1),m=l(o=>o.userTodos),c=l(o=>o.setUserTodos),{data:n,error:a,loading:u}=N(_,{fetchPolicy:"network-only"});return r.useEffect(()=>{if(a){const o=a.toString().split(":").pop();t(o)}},[a]),r.useEffect(()=>{n&&n.todos&&c(n.todos)},[n,c]),u?e.jsx(y,{}):e.jsxs(e.Fragment,{children:[e.jsx(T,{}),e.jsxs("div",{className:"container mt-5",children:[s&&e.jsxs("div",{className:"alert alert-dismissible alert-danger mt-5",children:[e.jsx("button",{type:"button",className:"btn-close",onClick:()=>t(null)}),s]}),m.length>0?e.jsx(D,{}):e.jsx("div",{className:"w-100",children:e.jsxs("h3",{className:"text-center",children:["You haven't added any todos yet.",e.jsx("div",{className:"d-grid mt-5",children:e.jsx("div",{className:"col-sm-12 col-md-4 mx-auto",children:e.jsx("button",{type:"button",className:"btn btn-success",onClick:()=>i(!0),children:"Add new todo"})})})]})})]}),e.jsx(b,{}),e.jsx(f,{showTodoFormModal:d,setShowTodoFormModal:i,purpose:"Add"})]})};export{C as default};
