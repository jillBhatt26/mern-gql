const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-BYa5cqDc.js","assets/index-DTCJZlBg.css"])))=>i.map(i=>d[i]);
import{r as t,c,d as g,D as E,j as e,T as x,g as T,N,F as S,_ as C}from"./index-BYa5cqDc.js";import{C as U}from"./ConfirmDeleteModal-ip-ESEuw.js";import{u as v}from"./useQuery-C7tp1kjf.js";const w=({todo:s})=>{const[o,n]=t.useState(!1),[u,m]=t.useState(!1),[h,d]=t.useState(null),[l,i]=t.useState("text-primary"),r=c(a=>a.userTodos),j=c(a=>a.setUserTodos),[f,{loading:b}]=g(E,{variables:{id:s.id},onCompleted:a=>{a.DeleteTodo&&(j(r.filter(p=>p.id!==s.id)),n(!1))},onError:a=>{const p=a.toString().split(":").pop();d(p)}});return t.useEffect(()=>{if(s.status.toUpperCase()==="PENDING")return i("text-danger");if(s.status.toUpperCase()==="PROGRESS")return i("text-info");if(s.status.toUpperCase()==="COMPLETE")return i("text-success")},[s.status]),e.jsxs("tr",{children:[e.jsx("th",{scope:"row",children:s.name}),e.jsx("td",{children:s.description}),e.jsx("td",{className:l,children:s.status}),e.jsxs("td",{className:"d-flex gap-3",children:[e.jsx("button",{className:"btn btn-sm btn-warning",onClick:()=>m(!0),children:"Update"}),e.jsx("button",{className:"btn btn-sm btn-danger",onClick:()=>n(!0),children:"Delete"})]}),e.jsx(U,{isOpen:o,onClose:()=>n(!1),onConfirm:f,message:b?"Loading...":"This action is irreversible. Your todo will be permanently deleted. Wish to proceed?",confirmButtonLabel:"Delete Todo",error:h}),e.jsx(x,{showTodoFormModal:u,setShowTodoFormModal:m,purpose:"Update",todoToUpdate:s})]})},D=()=>{const s=c(o=>o.userTodos);return e.jsx(e.Fragment,{children:s.length>0&&e.jsx("div",{className:"table-responsive",children:e.jsxs("table",{className:"table table-hover",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{scope:"col",children:"Name"}),e.jsx("th",{scope:"col",children:"Description"}),e.jsx("th",{scope:"col",children:"Status"}),e.jsx("th",{scope:"col",children:"Actions"})]})}),e.jsx("tbody",{children:s.map(o=>e.jsx(w,{todo:o},o.id))})]})})})},M=T`
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
`;const y=t.lazy(()=>C(()=>import("./index-BYa5cqDc.js").then(s=>s.J),__vite__mapDeps([0,1]))),O=()=>{const[s,o]=t.useState(null),[n,u]=t.useState(!1),m=c(r=>r.userTodos),h=c(r=>r.setUserTodos),{data:d,error:l,loading:i}=v(M,{fetchPolicy:"network-only"});return t.useEffect(()=>{if(l){const r=l.toString().split(":").pop();o(r)}},[l]),t.useEffect(()=>{d&&d.todos&&h(d.todos)},[d,h]),i?e.jsx(y,{}):e.jsxs(e.Fragment,{children:[e.jsx(N,{}),e.jsxs("div",{className:"container mt-5",children:[s&&e.jsxs("div",{className:"alert alert-dismissible alert-danger mt-5",children:[e.jsx("button",{type:"button",className:"btn-close",onClick:()=>o(null)}),s]}),m.length>0?e.jsx(D,{}):e.jsx("div",{className:"w-100",children:e.jsxs("h3",{className:"text-center",children:["You haven't added any todos yet.",e.jsx("div",{className:"d-grid mt-5",children:e.jsx("div",{className:"col-sm-12 col-md-4 mx-auto",children:e.jsx("button",{type:"button",className:"btn btn-success",onClick:()=>u(!0),children:"Add new todo"})})})]})})]}),e.jsx(S,{}),e.jsx(x,{showTodoFormModal:n,setShowTodoFormModal:u,purpose:"Add"})]})};export{O as default};
