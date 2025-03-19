import{j as e,M as s,r as n,u as w,a as f,b as E,d as v,U as F,N as A,F as B,D as M}from"./index-DZYU-leM.js";const I=({showUpdateUserConfirmModal:a,setShowUpdateUserConfirmModal:i,handleUpdateUser:r})=>e.jsxs(s,{isOpen:a,onClose:()=>i(!1),onConfirm:r,children:[e.jsxs(s.Header,{children:[e.jsx(s.Header.Title,{children:e.jsx("p",{className:"text-warning",children:"Caution!"})}),e.jsx(s.Header.CloseButton,{})]}),e.jsx(s.Body,{children:e.jsx("p",{className:"ml-5 mb-4",children:"Your account will be updated. You'll have to login again. Wish to continue?"})}),e.jsxs(s.Footer,{className:"d-flex justify-center",children:[e.jsx(s.Footer.ConfirmButton,{className:"btn btn-warning",children:"Update Account"}),e.jsx(s.Footer.CancelButton,{children:"Cancel"})]})]}),H=()=>{const[a,i]=n.useState(""),[r,x]=n.useState(""),[u,m]=n.useState(""),[p,j]=n.useState({}),[c,d]=n.useState(null),[h,l]=n.useState(!1),[b,U]=n.useState(!1),g=w(),N=f(t=>t.authUser),y=f(t=>t.unsetAuthUser),[S,{loading:C}]=E(F,{variables:{updateUserInputs:{}},onCompleted:t=>{if(t.UpdateUser&&g)return y(),g("/login",{replace:!0})},onError:t=>{if(t){const o=t.toString().split(":").pop();d(o)}},update:t=>{t.writeQuery({query:v,data:{FetchActiveUser:null}})}});n.useEffect(()=>{l(C||c!==null)},[C,c]);const D=async t=>{t.preventDefault();const o={};if(r&&r.trim()&&(o.email=r.trim()),a&&a.trim()&&(o.username=a.trim()),u&&u.trim()&&(o.password=u.trim()),!Object.keys(o).length)return d("Enter any one value to update user!");if(o.email===N.email)return d("New email should be different than existing one");if(o.username===N.username)return d("New username should be different than existing one");j(o),U(!0)};return e.jsxs(e.Fragment,{children:[e.jsx("h1",{className:"text-center",children:"Update Account"}),c&&e.jsxs("div",{className:"alert alert-dismissible alert-danger mt-5",children:[e.jsx("button",{type:"button",className:"btn-close",onClick:()=>d(null)}),c]}),e.jsxs("form",{noValidate:!0,autoComplete:"off",onSubmit:D,children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"usernameOrEmail",className:"form-label mt-4",children:"New Username"}),e.jsx("input",{type:"email",className:"form-control",id:"username",placeholder:"New username",onChange:t=>i(t.target.value)})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"usernameOrEmail",className:"form-label mt-4",children:"New Email"}),e.jsx("input",{type:"email",className:"form-control",id:"email",placeholder:"New email",onChange:t=>x(t.target.value)})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"usernameOrEmail",className:"form-label mt-4",children:"New Password"}),e.jsx("input",{type:"password",className:"form-control",id:"password",placeholder:"New password",onChange:t=>m(t.target.value)})]}),e.jsx("div",{className:"d-grid gap-2 mt-5",children:e.jsx("button",{className:`btn btn-lg btn-outline-warning border-warning ${h??"disabled"}`,type:"submit",disabled:h,children:"Update account"})})]}),e.jsx(I,{showUpdateUserConfirmModal:b,setShowUpdateUserConfirmModal:U,handleUpdateUser:()=>{S({variables:{updateUserInputs:{...p}}})}})]})},T=({showDeleteUserConfirmModal:a,setShowDeleteUserConfirmModal:i,handleDeleteUser:r})=>e.jsxs(s,{isOpen:a,onClose:()=>i(!1),onConfirm:r,children:[e.jsxs(s.Header,{children:[e.jsx(s.Header.Title,{children:e.jsx("p",{className:"text-danger",children:"Caution!"})}),e.jsx(s.Header.CloseButton,{})]}),e.jsx(s.Body,{children:e.jsx("p",{className:"ml-5 mb-4",children:"This action is irreversible. Your account and all your data will be permanently deleted. Wish to continue?"})}),e.jsxs(s.Footer,{className:"d-flex justify-center",children:[e.jsx(s.Footer.ConfirmButton,{className:"btn btn-danger",children:"Delete Account"}),e.jsx(s.Footer.CancelButton,{children:"Cancel"})]})]}),P=()=>{const[a,i]=n.useState(null),[r,x]=n.useState(!1),[u,m]=n.useState(!1),p=w(),j=f(l=>l.unsetAuthUser),[c,{loading:d}]=E(M,{onCompleted:l=>{if(l.DeleteUser&&p)return j(),p("/login",{replace:!0})},onError:l=>{if(l){const b=l.toString().split(":").pop();i(b)}},update:l=>{l.writeQuery({query:v,data:{FetchActiveUser:null}})}});n.useEffect(()=>{x(d||a!==null)},[d,a]);const h=()=>{c()};return e.jsxs(e.Fragment,{children:[e.jsx(A,{}),e.jsx("div",{className:"container",children:e.jsxs("div",{className:"container mt-5 col-12 col-md-8 col-lg-4",children:[a&&e.jsxs("div",{className:"alert alert-dismissible alert-danger mt-5",children:[e.jsx("button",{type:"button",className:"btn-close",onClick:()=>i(null)}),a]}),e.jsx(H,{}),e.jsx("div",{className:"d-grid my-3",children:e.jsx("button",{type:"button",className:`btn btn-lg btn-outline-danger border-danger ${r&&"disabled"}`,onClick:()=>m(!0),disabled:r,children:"Delete account"})})]})}),e.jsx(B,{}),e.jsx(T,{showDeleteUserConfirmModal:u,setShowDeleteUserConfirmModal:m,handleDeleteUser:h})]})};export{P as default};
