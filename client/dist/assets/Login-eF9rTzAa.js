import{r as t,u as b,j as e}from"./index-BwmDE6J8.js";import{u as f,a as j,N as E,F as v,b as N,L as U}from"./Footer-Dm3DVUD_.js";const S=()=>{const[o,m]=t.useState(""),[n,c]=t.useState(""),[i,d]=t.useState(!1),[a,r]=t.useState(null),p=f(s=>s.setAuthUser),g=b(),[h,{loading:u}]=j(U,{variables:{loginUserInput:{usernameOrEmail:o,password:n}},onCompleted:s=>{if(s&&s.LoginUser)return p(s.LoginUser),g("/",{replace:!0})},onError:s=>{if(s){const l=s.toString().split(":").pop();r(l)}},update:(s,l)=>{s.writeQuery({query:N,data:{FetchActiveUser:l.data.LoginUser}})}});t.useEffect(()=>{d(u||a!==null)},[u,a]);const x=s=>{if(s.preventDefault(),!o||!n)return r("Please provide all user details to login!");h()};return e.jsxs(e.Fragment,{children:[e.jsx(E,{}),e.jsxs("div",{className:"container mt-5 col-12 col-md-8 col-lg-4",children:[e.jsx("h1",{className:"text-center",children:"Log In"}),a&&e.jsxs("div",{className:"alert alert-dismissible alert-danger mt-5",children:[e.jsx("button",{type:"button",className:"btn-close",onClick:()=>r(null)}),a]}),e.jsxs("form",{autoComplete:"off",noValidate:!0,onSubmit:x,children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"usernameOrEmail",className:"form-label mt-4",children:"Username or Email"}),e.jsx("input",{type:"email",className:"form-control",id:"usernameOrEmail",placeholder:"Username or email",onChange:s=>m(s.target.value)})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"password",className:"form-label mt-4",children:"Password"}),e.jsx("input",{type:"password",className:"form-control",id:"password",placeholder:"Password",autoComplete:"off",onChange:s=>c(s.target.value)})]}),e.jsx("div",{className:"d-grid gap-2 mt-5",children:e.jsx("button",{className:`btn btn-lg btn-success ${i??"disabled"}`,type:"submit",disabled:i,children:"Login"})})]})]}),e.jsx(v,{})]})};export{S as default};
