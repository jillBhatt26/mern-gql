import{r as a,a as b,u as j,b as f,j as e,N as v,F as E,c as N,L as U}from"./index-eJx4SO3I.js";const L=()=>{const[n,u]=a.useState(""),[i,d]=a.useState(""),[c,m]=a.useState(!1),[r,t]=a.useState(null),p=b(s=>s.setAuthUser),g=j(),[h,{loading:l}]=f(U,{variables:{loginUserInput:{usernameOrEmail:n,password:i}},onCompleted:s=>{if(s&&s.LoginUser)return p(s.LoginUser),g("/",{replace:!0})},onError:s=>{if(s){const o=s.toString().split(":").pop();t(o)}},update:(s,o)=>{s.writeQuery({query:N,data:{FetchActiveUser:o.data.LoginUser}})}});a.useEffect(()=>{m(l||r!==null)},[l,r]);const x=s=>{if(s.preventDefault(),!n||!i)return t("Please provide all user details to login!");h()};return e.jsxs(e.Fragment,{children:[e.jsx(v,{}),e.jsxs("div",{className:"container mt-5 col-12 col-md-8 col-lg-4",children:[e.jsx("h1",{className:"text-center",children:"Log In"}),r&&e.jsxs("div",{className:"alert alert-dismissible alert-danger mt-5",children:[e.jsx("button",{type:"button",className:"btn-close",onClick:()=>t(null)}),r]}),e.jsxs("form",{autoComplete:"off",noValidate:!0,onSubmit:x,children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"usernameOrEmail",className:"form-label mt-4",children:"Username or Email"}),e.jsx("input",{type:"email",className:"form-control",id:"usernameOrEmail",placeholder:"Username or email",onChange:s=>u(s.target.value)})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"password",className:"form-label mt-4",children:"Password"}),e.jsx("input",{type:"password",className:"form-control",id:"password",placeholder:"Password",autoComplete:"off",onChange:s=>d(s.target.value)})]}),e.jsx("div",{className:"d-grid gap-2 mt-5",children:e.jsx("button",{className:`btn btn-lg btn-success ${c??"disabled"}`,type:"submit",disabled:c,children:l?e.jsx("div",{className:"progress",children:e.jsx("div",{className:"progress-bar progress-bar-striped bg-info",role:"progressbar",style:{width:"100%"},"aria-valuenow":100,"aria-valuemin":0,"aria-valuemax":100})}):e.jsx("span",{children:"Login"})})})]})]}),e.jsx(E,{})]})};export{L as default};
