import{l as t}from"./preact.module.f099146f.js";typeof process=="object"&&Object.prototype.toString.call(process);new TextEncoder;var p,u,m,y,s=0,A=[],v=[],N=t.__b,E=t.__r,b=t.diffed,V=t.__c,g=t.unmount;function H(o,r){t.__h&&t.__h(u,o,s||r),s=0;var _=u.__H||(u.__H={__:[],__h:[]});return o>=_.__.length&&_.__.push({__V:v}),_.__[o]}function P(o){return s=1,k(q,o)}function k(o,r,_){var n=H(p++,2);if(n.t=o,!n.__c&&(n.__=[_?_(r):q(void 0,r),function(i){var e=n.__N?n.__N[0]:n.__[0],f=n.t(e,i);e!==f&&(n.__N=[f,n.__[1]],n.__c.setState({}))}],n.__c=u,!n.__c.u)){n.__c.__H.u=!0;var c=n.__c.shouldComponentUpdate;n.__c.shouldComponentUpdate=function(i,e,f){var h=n.__c.__H.__.filter(function(a){return a.__c});return(h.every(function(a){return!a.__N})||!h.every(function(a){if(!a.__N)return!0;var T=a.__[0];return a.__=a.__N,a.__N=void 0,T===a.__[0]}))&&(!c||c(i,e,f))}}return n.__N||n.__}function S(o,r){var _=H(p++,3);!t.__s&&j(_.__H,r)&&(_.__=o,_.o=r,u.__H.__h.push(_))}function U(o){return s=5,$(function(){return{current:o}},[])}function $(o,r){var _=H(p++,7);return j(_.__H,r)?(_.__V=o(),_.o=r,_.__h=o,_.__V):_.__}function w(){for(var o;o=A.shift();)if(o.__P&&o.__H)try{o.__H.__h.forEach(l),o.__H.__h.forEach(d),o.__H.__h=[]}catch(r){o.__H.__h=[],t.__e(r,o.__v)}}t.__b=function(o){u=null,N&&N(o)},t.__r=function(o){E&&E(o),p=0;var r=(u=o.__c).__H;r&&(m===u?(r.__h=[],u.__h=[],r.__.forEach(function(_){_.__N&&(_.__=_.__N),_.__V=v,_.__N=_.o=void 0})):(r.__h.forEach(l),r.__h.forEach(d),r.__h=[])),m=u},t.diffed=function(o){b&&b(o);var r=o.__c;r&&r.__H&&(r.__H.__h.length&&(A.push(r)!==1&&y===t.requestAnimationFrame||((y=t.requestAnimationFrame)||function(_){var n,c=function(){clearTimeout(i),F&&cancelAnimationFrame(n),setTimeout(_)},i=setTimeout(c,100);F&&(n=requestAnimationFrame(c))})(w)),r.__H.__.forEach(function(_){_.o&&(_.__H=_.o),_.__V!==v&&(_.__=_.__V),_.o=void 0,_.__V=v})),m=u=null},t.__c=function(o,r){r.some(function(_){try{_.__h.forEach(l),_.__h=_.__h.filter(function(n){return!n.__||d(n)})}catch(n){r.some(function(c){c.__h&&(c.__h=[])}),r=[],t.__e(n,_.__v)}}),V&&V(o,r)},t.unmount=function(o){g&&g(o);var r,_=o.__c;_&&_.__H&&(_.__H.__.forEach(function(n){try{l(n)}catch(c){r=c}}),r&&t.__e(r,_.__v))};var F=typeof requestAnimationFrame=="function";function l(o){var r=u,_=o.__c;typeof _=="function"&&(o.__c=void 0,_()),u=r}function d(o){var r=u;o.__c=o.__(),u=r}function j(o,r){return!o||o.length!==r.length||r.some(function(_,n){return _!==o[n]})}function q(o,r){return typeof r=="function"?r(o):r}var x=0;function z(o,r,_,n,c){var i,e,f={};for(e in r)e=="ref"?i=r[e]:f[e]=r[e];var h={type:o,props:f,key:_,ref:i,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:--x,__source:c,__self:n};if(typeof o=="function"&&(i=o.defaultProps))for(e in i)f[e]===void 0&&(f[e]=i[e]);return t.vnode&&t.vnode(h),h}export{S as _,z as e,P as p,U as s};
