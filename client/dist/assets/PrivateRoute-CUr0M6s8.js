import{r as t,b as c,j as r,O as f,l as h,m}from"./index-DDAoFsC7.js";import{F as p}from"./User-DddtfDP4.js";import{u as x}from"./useQuery-BJrl4BK7.js";const A=()=>{const[e,l]=t.useState(null),[u,U]=t.useState(!0),o=c(i=>i.authUser),n=c(i=>i.setAuthUser),{data:s,loading:a}=x(p,{skip:o!==null});if(t.useEffect(()=>{U(a)},[a]),t.useEffect(()=>{s&&s.FetchActiveUser&&l(s.FetchActiveUser)},[s]),t.useEffect(()=>{e&&n(e)},[e,n]),o)return r.jsx(f,{});if(u||a)return r.jsx(h,{});if(!u&&!e)return r.jsx(m,{to:"/login",replace:!0});if(!u&&e)return r.jsx(f,{})};export{A as default};
