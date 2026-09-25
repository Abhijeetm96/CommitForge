import{n as e,t}from"./rolldown-runtime-CbXtAM7H.js";var n=t((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.portal`),r=Symbol.for(`react.fragment`),i=Symbol.for(`react.strict_mode`),a=Symbol.for(`react.profiler`),o=Symbol.for(`react.consumer`),s=Symbol.for(`react.context`),c=Symbol.for(`react.forward_ref`),l=Symbol.for(`react.suspense`),u=Symbol.for(`react.memo`),d=Symbol.for(`react.lazy`),f=Symbol.for(`react.activity`),p=Symbol.for(`react.view_transition`),m=Symbol.iterator;function h(e){return typeof e!=`object`||!e?null:(e=m&&e[m]||e[`@@iterator`],typeof e==`function`?e:null)}var g={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},_=Object.assign,v={};function y(e,t,n){this.props=e,this.context=t,this.refs=v,this.updater=n||g}y.prototype.isReactComponent={},y.prototype.setState=function(e,t){if(typeof e!=`object`&&typeof e!=`function`&&e!=null)throw Error(`takes an object of state variables to update or a function which returns an object of state variables.`);this.updater.enqueueSetState(this,e,t,`setState`)},y.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,`forceUpdate`)};function b(){}b.prototype=y.prototype;function ee(e,t,n){this.props=e,this.context=t,this.refs=v,this.updater=n||g}var x=ee.prototype=new b;x.constructor=ee,_(x,y.prototype),x.isPureReactComponent=!0;var te=Array.isArray;function ne(){}var S={H:null,A:null,T:null,S:null},C=Object.prototype.hasOwnProperty;function re(e,n,r){var i=r.ref;return{$$typeof:t,type:e,key:n,ref:i===void 0?null:i,props:r}}function w(e,t){return re(e.type,t,e.props)}function T(e){return typeof e==`object`&&!!e&&e.$$typeof===t}function ie(e){var t={"=":`=0`,":":`=2`};return`$`+e.replace(/[=:]/g,function(e){return t[e]})}var ae=/\/+/g;function oe(e,t){return typeof e==`object`&&e&&e.key!=null?ie(``+e.key):t.toString(36)}function se(e){switch(e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason;default:switch(typeof e.status==`string`?e.then(ne,ne):(e.status=`pending`,e.then(function(t){e.status===`pending`&&(e.status=`fulfilled`,e.value=t)},function(t){e.status===`pending`&&(e.status=`rejected`,e.reason=t)})),e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason}}throw e}function E(e,r,i,a,o){var s=typeof e;(s===`undefined`||s===`boolean`)&&(e=null);var c=!1;if(e===null)c=!0;else switch(s){case`bigint`:case`string`:case`number`:c=!0;break;case`object`:switch(e.$$typeof){case t:case n:c=!0;break;case d:return c=e._init,E(c(e._payload),r,i,a,o)}}if(c)return o=o(e),c=a===``?`.`+oe(e,0):a,te(o)?(i=``,c!=null&&(i=c.replace(ae,`$&/`)+`/`),E(o,r,i,``,function(e){return e})):o!=null&&(T(o)&&(o=w(o,i+(o.key==null||e&&e.key===o.key?``:(``+o.key).replace(ae,`$&/`)+`/`)+c)),r.push(o)),1;c=0;var l=a===``?`.`:a+`:`;if(te(e))for(var u=0;u<e.length;u++)a=e[u],s=l+oe(a,u),c+=E(a,r,i,s,o);else if(u=h(e),typeof u==`function`)for(e=u.call(e),u=0;!(a=e.next()).done;)a=a.value,s=l+oe(a,u++),c+=E(a,r,i,s,o);else if(s===`object`){if(typeof e.then==`function`)return E(se(e),r,i,a,o);throw r=String(e),Error(`Objects are not valid as a React child (found: `+(r===`[object Object]`?`object with keys {`+Object.keys(e).join(`, `)+`}`:r)+`). If you meant to render a collection of children, use an array instead.`)}return c}function ce(e,t,n){if(e==null)return e;var r=[],i=0;return E(e,r,``,``,function(e){return t.call(n,e,i++)}),r}function le(e){if(e._status===-1){var t=e._result,n=t();n.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t,n.status===void 0&&(n.status=`fulfilled`,n.value=t))},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t,n.status===void 0&&(n.status=`rejected`,n.reason=t))}),e._status===-1&&(e._status=0,e._result=n)}if(e._status===1)return e._result.default;throw e._result}var D=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)};function ue(e){var t=S.T,n={};n.types=t===null?null:t.types,S.T=n;try{var r=e(),i=S.S;i!==null&&i(n,r),typeof r==`object`&&r&&typeof r.then==`function`&&r.then(ne,D)}catch(e){D(e)}finally{t!==null&&n.types!==null&&(t.types=n.types),S.T=t}}function O(e){var t=S.T;if(t!==null){var n=t.types;n===null?t.types=[e]:n.indexOf(e)===-1&&n.push(e)}else ue(O.bind(null,e))}var k={map:ce,forEach:function(e,t,n){ce(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return ce(e,function(){t++}),t},toArray:function(e){return ce(e,function(e){return e})||[]},only:function(e){if(!T(e))throw Error(`React.Children.only expected to receive a single React element child.`);return e}};e.Activity=f,e.Children=k,e.Component=y,e.Fragment=r,e.Profiler=a,e.PureComponent=ee,e.StrictMode=i,e.Suspense=l,e.ViewTransition=p,e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=S,e.__COMPILER_RUNTIME={__proto__:null,c:function(e){return S.H.useMemoCache(e)}},e.addTransitionType=O,e.cache=function(e){return function(){return e.apply(null,arguments)}},e.cacheSignal=function(){return null},e.cloneElement=function(e,t,n){if(e==null)throw Error(`The argument must be a React element, but you passed `+e+`.`);var r=_({},e.props),i=e.key;if(t!=null)for(a in t.key!==void 0&&(i=``+t.key),t)!C.call(t,a)||a===`key`||a===`__self`||a===`__source`||a===`ref`&&t.ref===void 0||(r[a]=t[a]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var o=Array(a),s=0;s<a;s++)o[s]=arguments[s+2];r.children=o}return re(e.type,i,r)},e.createContext=function(e){return e={$$typeof:s,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:o,_context:e},e},e.createElement=function(e,t,n){var r,i={},a=null;if(t!=null)for(r in t.key!==void 0&&(a=``+t.key),t)C.call(t,r)&&r!==`key`&&r!==`__self`&&r!==`__source`&&(i[r]=t[r]);var o=arguments.length-2;if(o===1)i.children=n;else if(1<o){for(var s=Array(o),c=0;c<o;c++)s[c]=arguments[c+2];i.children=s}if(e&&e.defaultProps)for(r in o=e.defaultProps,o)i[r]===void 0&&(i[r]=o[r]);return re(e,a,i)},e.createRef=function(){return{current:null}},e.forwardRef=function(e){return{$$typeof:c,render:e}},e.isValidElement=T,e.lazy=function(e){return{$$typeof:d,_payload:{_status:-1,_result:e},_init:le}},e.memo=function(e,t){return{$$typeof:u,type:e,compare:t===void 0?null:t}},e.startTransition=ue,e.unstable_useCacheRefresh=function(){return S.H.useCacheRefresh()},e.use=function(e){return S.H.use(e)},e.useActionState=function(e,t,n){return S.H.useActionState(e,t,n)},e.useCallback=function(e,t){return S.H.useCallback(e,t)},e.useContext=function(e){return S.H.useContext(e)},e.useDebugValue=function(){},e.useDeferredValue=function(e,t){return S.H.useDeferredValue(e,t)},e.useEffect=function(e,t){return S.H.useEffect(e,t)},e.useEffectEvent=function(e){return S.H.useEffectEvent(e)},e.useId=function(){return S.H.useId()},e.useImperativeHandle=function(e,t,n){return S.H.useImperativeHandle(e,t,n)},e.useInsertionEffect=function(e,t){return S.H.useInsertionEffect(e,t)},e.useLayoutEffect=function(e,t){return S.H.useLayoutEffect(e,t)},e.useMemo=function(e,t){return S.H.useMemo(e,t)},e.useOptimistic=function(e,t){return S.H.useOptimistic(e,t)},e.useReducer=function(e,t,n){return S.H.useReducer(e,t,n)},e.useRef=function(e){return S.H.useRef(e)},e.useState=function(e){return S.H.useState(e)},e.useSyncExternalStore=function(e,t,n){return S.H.useSyncExternalStore(e,t,n)},e.useTransition=function(){return S.H.useTransition()},e.version=`19.3.0`})),r=t(((e,t)=>{t.exports=n()})),i=t((e=>{var t=r();function n(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function i(){}var a={d:{f:i,r:function(){throw Error(n(522))},D:i,C:i,L:i,m:i,X:i,S:i,M:i},p:0,findDOMNode:null},o=Symbol.for(`react.portal`),s=Symbol.for(`react.recoverable`),c=Symbol.for(`react.optimistic_key`);function l(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:o,key:r==null?null:r===c?c:``+r,children:e,containerInfo:t,implementation:n}}var u=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function d(e,t){if(e===`font`)return``;if(typeof t==`string`)return t===`use-credentials`?t:``}e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=a,e.browser=function(e){return{$$typeof:s,_reason:e}},e.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(n(299));return l(e,t,null,r)},e.flushSync=function(e){var t=u.T,n=a.p;try{if(u.T=null,a.p=2,e)return e()}finally{u.T=t,a.p=n,a.d.f()}},e.preconnect=function(e,t){typeof e==`string`&&(t?(t=t.crossOrigin,t=typeof t==`string`?t===`use-credentials`?t:``:void 0):t=null,a.d.C(e,t))},e.prefetchDNS=function(e){typeof e==`string`&&a.d.D(e)},e.preinit=function(e,t){if(typeof e==`string`&&t&&typeof t.as==`string`){var n=t.as,r=d(n,t.crossOrigin),i=typeof t.integrity==`string`?t.integrity:void 0,o=typeof t.fetchPriority==`string`?t.fetchPriority:void 0;n===`style`?a.d.S(e,typeof t.precedence==`string`?t.precedence:void 0,{crossOrigin:r,integrity:i,fetchPriority:o}):n===`script`&&a.d.X(e,{crossOrigin:r,integrity:i,fetchPriority:o,nonce:typeof t.nonce==`string`?t.nonce:void 0})}},e.preinitModule=function(e,t){if(typeof e==`string`){if(typeof t==`object`&&t){if(t.as==null||t.as===`script`){var n=d(t.as,t.crossOrigin);a.d.M(e,{crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0})}}else t??a.d.M(e)}},e.preload=function(e,t){if(typeof e==`string`&&typeof t==`object`&&t&&typeof t.as==`string`){var n=t.as,r=d(n,t.crossOrigin);a.d.L(e,n,{crossOrigin:r,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,type:typeof t.type==`string`?t.type:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy==`string`?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet==`string`?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes==`string`?t.imageSizes:void 0,media:typeof t.media==`string`?t.media:void 0})}},e.preloadModule=function(e,t){if(typeof e==`string`){if(t){var n=d(t.as,t.crossOrigin);a.d.m(e,{as:typeof t.as==`string`&&t.as!==`script`?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0})}else a.d.m(e)}},e.requestFormReset=function(e){a.d.r(e)},e.unstable_batchedUpdates=function(e,t){return e(t)},e.useFormState=function(e,t,n){return u.H.useFormState(e,t,n)},e.useFormStatus=function(){return u.H.useHostTransitionStatus()},e.version=`19.3.0`})),a=t(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=i()})),o=t((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.fragment`);function r(e,n,r){var i=null;if(r!==void 0&&(i=``+r),n.key!==void 0&&(i=``+n.key),`key`in n)for(var a in r={},n)a!==`key`&&(r[a]=n[a]);else r=n;return n=r.ref,{$$typeof:t,type:e,key:i,ref:n===void 0?null:n,props:r}}e.Fragment=n,e.jsx=r,e.jsxs=r})),s=t(((e,t)=>{t.exports=o()})),c=e(r(),1),l=a(),u=s(),d=`.styles-module__popup___IhzrD svg[fill=none] {
  fill: none !important;
}
.styles-module__popup___IhzrD svg[fill=none] :not([fill]) {
  fill: none !important;
}

@keyframes styles-module__popupEnter___AuQDN {
  from {
    opacity: 0;
    transform: translateX(-50%) scale(0.95) translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) scale(1) translateY(0);
  }
}
@keyframes styles-module__popupExit___JJKQX {
  from {
    opacity: 1;
    transform: translateX(-50%) scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) scale(0.95) translateY(4px);
  }
}
@keyframes styles-module__shake___jdbWe {
  0%, 100% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(0);
  }
  20% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(-3px);
  }
  40% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(3px);
  }
  60% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(-2px);
  }
  80% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(2px);
  }
}
.styles-module__popup___IhzrD {
  position: fixed;
  transform: translateX(-50%);
  width: 280px;
  padding: 0.75rem 1rem 14px;
  background: #1a1a1a;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
  z-index: 100001;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  will-change: transform, opacity;
  opacity: 0;
}
.styles-module__popup___IhzrD.styles-module__enter___L7U7N {
  animation: styles-module__popupEnter___AuQDN 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.styles-module__popup___IhzrD.styles-module__entered___COX-w {
  opacity: 1;
  transform: translateX(-50%) scale(1) translateY(0);
}
.styles-module__popup___IhzrD.styles-module__exit___5eGjE {
  animation: styles-module__popupExit___JJKQX 0.15s ease-in forwards;
}
.styles-module__popup___IhzrD.styles-module__entered___COX-w.styles-module__shake___jdbWe {
  animation: styles-module__shake___jdbWe 0.25s ease-out;
}

.styles-module__header___wWsSi {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5625rem;
}

.styles-module__element___fTV2z {
  font-size: 0.75rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.styles-module__headerToggle___WpW0b {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  flex: 1;
  min-width: 0;
  text-align: left;
}
.styles-module__headerToggle___WpW0b .styles-module__element___fTV2z {
  flex: 1;
}

.styles-module__chevron___ZZJlR {
  color: rgba(255, 255, 255, 0.5);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
}
.styles-module__chevron___ZZJlR.styles-module__expanded___2Hxgv {
  transform: rotate(90deg);
}

.styles-module__stylesWrapper___pnHgy {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.styles-module__stylesWrapper___pnHgy.styles-module__expanded___2Hxgv {
  grid-template-rows: 1fr;
}

.styles-module__stylesInner___YYZe2 {
  overflow: hidden;
}

.styles-module__stylesBlock___VfQKn {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.375rem;
  padding: 0.5rem 0.625rem;
  margin-bottom: 0.5rem;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.6875rem;
  line-height: 1.5;
}

.styles-module__styleLine___1YQiD {
  color: rgba(255, 255, 255, 0.85);
  word-break: break-word;
}

.styles-module__styleProperty___84L1i {
  color: #c792ea;
}

.styles-module__styleValue___q51-h {
  color: rgba(255, 255, 255, 0.85);
}

.styles-module__timestamp___Dtpsv {
  font-size: 0.625rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.35);
  font-variant-numeric: tabular-nums;
  margin-left: 0.5rem;
  flex-shrink: 0;
}

.styles-module__quote___mcMmQ {
  font-size: 12px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
  padding: 0.4rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.25rem;
  line-height: 1.45;
}

.styles-module__textarea___jrSae {
  box-sizing: border-box;
  width: 100%;
  padding: 0.5rem 0.625rem;
  font-size: 0.8125rem;
  font-family: inherit;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  resize: none;
  outline: none;
  transition: border-color 0.15s ease;
}
.styles-module__textarea___jrSae:focus {
  border-color: var(--agentation-color-blue);
}
.styles-module__textarea___jrSae.styles-module__green___99l3h:focus {
  border-color: var(--agentation-color-green);
}
.styles-module__textarea___jrSae::placeholder {
  color: rgba(255, 255, 255, 0.35);
}
.styles-module__textarea___jrSae::-webkit-scrollbar {
  width: 6px;
}
.styles-module__textarea___jrSae::-webkit-scrollbar-track {
  background: transparent;
}
.styles-module__textarea___jrSae::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.styles-module__actions___D6x3f {
  display: flex;
  justify-content: flex-end;
  gap: 0.375rem;
  margin-top: 0.5rem;
}

.styles-module__cancel___hRjnL,
.styles-module__submit___K-mIR {
  padding: 0.4rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 1rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;
}

.styles-module__cancel___hRjnL {
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
}
.styles-module__cancel___hRjnL:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.styles-module__submit___K-mIR {
  color: white;
}
.styles-module__submit___K-mIR:hover:not(:disabled) {
  filter: brightness(0.9);
}
.styles-module__submit___K-mIR:disabled {
  cursor: not-allowed;
}

.styles-module__deleteWrapper___oSjdo {
  margin-right: auto;
}

.styles-module__deleteButton___4VuAE {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.4);
  transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease;
}
.styles-module__deleteButton___4VuAE:hover {
  background-color: color-mix(in srgb, var(--agentation-color-red) 25%, transparent);
  color: var(--agentation-color-red);
}
.styles-module__deleteButton___4VuAE:active {
  transform: scale(0.92);
}

.styles-module__light___6AaSQ.styles-module__popup___IhzrD {
  background: #fff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06);
}
.styles-module__light___6AaSQ .styles-module__element___fTV2z {
  color: rgba(0, 0, 0, 0.6);
}
.styles-module__light___6AaSQ .styles-module__timestamp___Dtpsv {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___6AaSQ .styles-module__chevron___ZZJlR {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___6AaSQ .styles-module__stylesBlock___VfQKn {
  background: rgba(0, 0, 0, 0.03);
}
.styles-module__light___6AaSQ .styles-module__styleLine___1YQiD {
  color: rgba(0, 0, 0, 0.75);
}
.styles-module__light___6AaSQ .styles-module__styleProperty___84L1i {
  color: #7c3aed;
}
.styles-module__light___6AaSQ .styles-module__styleValue___q51-h {
  color: rgba(0, 0, 0, 0.75);
}
.styles-module__light___6AaSQ .styles-module__quote___mcMmQ {
  color: rgba(0, 0, 0, 0.55);
  background: rgba(0, 0, 0, 0.04);
}
.styles-module__light___6AaSQ .styles-module__textarea___jrSae {
  background: rgba(0, 0, 0, 0.03);
  color: #1a1a1a;
  border-color: rgba(0, 0, 0, 0.12);
}
.styles-module__light___6AaSQ .styles-module__textarea___jrSae::placeholder {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___6AaSQ .styles-module__textarea___jrSae::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
}
.styles-module__light___6AaSQ .styles-module__cancel___hRjnL {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__light___6AaSQ .styles-module__cancel___hRjnL:hover {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.75);
}
.styles-module__light___6AaSQ .styles-module__deleteButton___4VuAE {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___6AaSQ .styles-module__deleteButton___4VuAE:hover {
  background-color: color-mix(in srgb, var(--agentation-color-red) 25%, transparent);
  color: var(--agentation-color-red);
}`,f={popup:`styles-module__popup___IhzrD`,enter:`styles-module__enter___L7U7N`,popupEnter:`styles-module__popupEnter___AuQDN`,entered:`styles-module__entered___COX-w`,exit:`styles-module__exit___5eGjE`,popupExit:`styles-module__popupExit___JJKQX`,shake:`styles-module__shake___jdbWe`,header:`styles-module__header___wWsSi`,element:`styles-module__element___fTV2z`,headerToggle:`styles-module__headerToggle___WpW0b`,chevron:`styles-module__chevron___ZZJlR`,expanded:`styles-module__expanded___2Hxgv`,stylesWrapper:`styles-module__stylesWrapper___pnHgy`,stylesInner:`styles-module__stylesInner___YYZe2`,stylesBlock:`styles-module__stylesBlock___VfQKn`,styleLine:`styles-module__styleLine___1YQiD`,styleProperty:`styles-module__styleProperty___84L1i`,styleValue:`styles-module__styleValue___q51-h`,timestamp:`styles-module__timestamp___Dtpsv`,quote:`styles-module__quote___mcMmQ`,textarea:`styles-module__textarea___jrSae`,green:`styles-module__green___99l3h`,actions:`styles-module__actions___D6x3f`,cancel:`styles-module__cancel___hRjnL`,submit:`styles-module__submit___K-mIR`,deleteWrapper:`styles-module__deleteWrapper___oSjdo`,deleteButton:`styles-module__deleteButton___4VuAE`,light:`styles-module__light___6AaSQ`};if(typeof document<`u`){let e=document.getElementById(`feedback-tool-styles-annotation-popup-css-styles`);e||(e=document.createElement(`style`),e.id=`feedback-tool-styles-annotation-popup-css-styles`,document.head.appendChild(e)),e.textContent=d}var p=f,m=`.icon-transitions-module__iconState___uqK9J {
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform-origin: center;
}

.icon-transitions-module__iconStateFast___HxlMm {
  transition: opacity 0.15s ease, transform 0.15s ease;
  transform-origin: center;
}

.icon-transitions-module__iconFade___nPwXg {
  transition: opacity 0.2s ease;
}

.icon-transitions-module__iconFadeFast___Ofb2t {
  transition: opacity 0.15s ease;
}

.icon-transitions-module__visible___PlHsU {
  opacity: 1 !important;
}

.icon-transitions-module__visibleScaled___8Qog- {
  opacity: 1 !important;
  transform: scale(1);
}

.icon-transitions-module__hidden___ETykt {
  opacity: 0 !important;
}

.icon-transitions-module__hiddenScaled___JXn-m {
  opacity: 0 !important;
  transform: scale(0.8);
}

.icon-transitions-module__sending___uaLN- {
  opacity: 0.5 !important;
  transform: scale(0.8);
}`,h={iconState:`icon-transitions-module__iconState___uqK9J`,iconStateFast:`icon-transitions-module__iconStateFast___HxlMm`,iconFade:`icon-transitions-module__iconFade___nPwXg`,iconFadeFast:`icon-transitions-module__iconFadeFast___Ofb2t`,visible:`icon-transitions-module__visible___PlHsU`,visibleScaled:`icon-transitions-module__visibleScaled___8Qog-`,hidden:`icon-transitions-module__hidden___ETykt`,hiddenScaled:`icon-transitions-module__hiddenScaled___JXn-m`,sending:`icon-transitions-module__sending___uaLN-`};if(typeof document<`u`){let e=document.getElementById(`feedback-tool-styles-components-icon-transitions`);e||(e=document.createElement(`style`),e.id=`feedback-tool-styles-components-icon-transitions`,document.head.appendChild(e)),e.textContent=m}var g=h,_=({size:e=16})=>(0,u.jsx)(`svg`,{width:e,height:e,viewBox:`0 0 16 16`,fill:`none`,children:(0,u.jsx)(`path`,{d:`M8 3v10M3 8h10`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`})}),v=({size:e=24,style:t={}})=>(0,u.jsxs)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,style:t,children:[(0,u.jsxs)(`g`,{clipPath:`url(#clip0_list_sparkle)`,children:[(0,u.jsx)(`path`,{d:`M11.5 12L5.5 12`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`}),(0,u.jsx)(`path`,{d:`M18.5 6.75L5.5 6.75`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`}),(0,u.jsx)(`path`,{d:`M9.25 17.25L5.5 17.25`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`}),(0,u.jsx)(`path`,{d:`M16 12.75L16.5179 13.9677C16.8078 14.6494 17.3506 15.1922 18.0323 15.4821L19.25 16L18.0323 16.5179C17.3506 16.8078 16.8078 17.3506 16.5179 18.0323L16 19.25L15.4821 18.0323C15.1922 17.3506 14.6494 16.8078 13.9677 16.5179L12.75 16L13.9677 15.4821C14.6494 15.1922 15.1922 14.6494 15.4821 13.9677L16 12.75Z`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinejoin:`round`})]}),(0,u.jsx)(`defs`,{children:(0,u.jsx)(`clipPath`,{id:`clip0_list_sparkle`,children:(0,u.jsx)(`rect`,{width:`24`,height:`24`,fill:`white`})})})]}),y=({size:e=20,...t})=>(0,u.jsxs)(`svg`,{width:e,height:e,viewBox:`0 0 20 20`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`,...t,children:[(0,u.jsx)(`circle`,{cx:`10`,cy:`10`,r:`5.375`,stroke:`currentColor`,strokeWidth:`1.25`}),(0,u.jsx)(`path`,{d:`M8.5 8.5C8.73 7.85 9.31 7.49 10 7.5C10.86 7.51 11.5 8.13 11.5 9C11.5 10.08 10 10.5 10 10.5V10.75`,stroke:`currentColor`,strokeWidth:`1.25`,strokeLinecap:`round`,strokeLinejoin:`round`}),(0,u.jsx)(`circle`,{cx:`10`,cy:`12.625`,r:`0.625`,fill:`currentColor`})]}),b=({size:e=24,copied:t=!1,tint:n})=>(0,u.jsxs)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,style:n?{color:n,transition:`color 0.3s ease`}:void 0,children:[(0,u.jsxs)(`g`,{className:`${g.iconState} ${t?g.hiddenScaled:g.visibleScaled}`,children:[(0,u.jsx)(`path`,{d:`M4.75 11.25C4.75 10.4216 5.42157 9.75 6.25 9.75H12.75C13.5784 9.75 14.25 10.4216 14.25 11.25V17.75C14.25 18.5784 13.5784 19.25 12.75 19.25H6.25C5.42157 19.25 4.75 18.5784 4.75 17.75V11.25Z`,stroke:`currentColor`,strokeWidth:`1.5`}),(0,u.jsx)(`path`,{d:`M17.25 14.25H17.75C18.5784 14.25 19.25 13.5784 19.25 12.75V6.25C19.25 5.42157 18.5784 4.75 17.75 4.75H11.25C10.4216 4.75 9.75 5.42157 9.75 6.25V6.75`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`})]}),(0,u.jsxs)(`g`,{className:`${g.iconState} ${t?g.visibleScaled:g.hiddenScaled}`,children:[(0,u.jsx)(`path`,{d:`M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z`,stroke:`var(--agentation-color-green)`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`}),(0,u.jsx)(`path`,{d:`M15 10L11 14.25L9.25 12.25`,stroke:`var(--agentation-color-green)`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`})]})]}),ee=({size:e=24,state:t=`idle`})=>{let n=t===`idle`,r=t===`sent`,i=t===`failed`,a=t===`sending`;return(0,u.jsxs)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,children:[(0,u.jsx)(`g`,{className:`${g.iconStateFast} ${n?g.visibleScaled:a?g.sending:g.hiddenScaled}`,children:(0,u.jsx)(`path`,{d:`M9.875 14.125L12.3506 19.6951C12.7184 20.5227 13.9091 20.4741 14.2083 19.6193L18.8139 6.46032C19.0907 5.6695 18.3305 4.90933 17.5397 5.18611L4.38072 9.79174C3.52589 10.0909 3.47731 11.2816 4.30494 11.6494L9.875 14.125ZM9.875 14.125L13.375 10.625`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`})}),(0,u.jsxs)(`g`,{className:`${g.iconStateFast} ${r?g.visibleScaled:g.hiddenScaled}`,children:[(0,u.jsx)(`path`,{d:`M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z`,stroke:`var(--agentation-color-green)`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`}),(0,u.jsx)(`path`,{d:`M15 10L11 14.25L9.25 12.25`,stroke:`var(--agentation-color-green)`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`})]}),(0,u.jsxs)(`g`,{className:`${g.iconStateFast} ${i?g.visibleScaled:g.hiddenScaled}`,children:[(0,u.jsx)(`path`,{d:`M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z`,stroke:`var(--agentation-color-red)`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`}),(0,u.jsx)(`path`,{d:`M12 8V12`,stroke:`var(--agentation-color-red)`,strokeWidth:`1.5`,strokeLinecap:`round`}),(0,u.jsx)(`circle`,{cx:`12`,cy:`15`,r:`0.5`,fill:`var(--agentation-color-red)`,stroke:`var(--agentation-color-red)`,strokeWidth:`1`})]})]})},x=({size:e=24,isOpen:t=!0})=>(0,u.jsxs)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,children:[(0,u.jsxs)(`g`,{className:`${g.iconFade} ${t?g.visible:g.hidden}`,children:[(0,u.jsx)(`path`,{d:`M3.91752 12.7539C3.65127 12.2996 3.65037 11.7515 3.9149 11.2962C4.9042 9.59346 7.72688 5.49994 12 5.49994C16.2731 5.49994 19.0958 9.59346 20.0851 11.2962C20.3496 11.7515 20.3487 12.2996 20.0825 12.7539C19.0908 14.4459 16.2694 18.4999 12 18.4999C7.73064 18.4999 4.90918 14.4459 3.91752 12.7539Z`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`}),(0,u.jsx)(`path`,{d:`M12 14.8261C13.5608 14.8261 14.8261 13.5608 14.8261 12C14.8261 10.4392 13.5608 9.17392 12 9.17392C10.4392 9.17392 9.17391 10.4392 9.17391 12C9.17391 13.5608 10.4392 14.8261 12 14.8261Z`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`})]}),(0,u.jsxs)(`g`,{className:`${g.iconFade} ${t?g.hidden:g.visible}`,children:[(0,u.jsx)(`path`,{d:`M18.6025 9.28503C18.9174 8.9701 19.4364 8.99481 19.7015 9.35271C20.1484 9.95606 20.4943 10.507 20.7342 10.9199C21.134 11.6086 21.1329 12.4454 20.7303 13.1328C20.2144 14.013 19.2151 15.5225 17.7723 16.8193C16.3293 18.1162 14.3852 19.2497 12.0008 19.25C11.4192 19.25 10.8638 19.1823 10.3355 19.0613C9.77966 18.934 9.63498 18.2525 10.0382 17.8493C10.2412 17.6463 10.5374 17.573 10.8188 17.6302C11.1993 17.7076 11.5935 17.75 12.0008 17.75C13.8848 17.7497 15.4867 16.8568 16.7693 15.7041C18.0522 14.5511 18.9606 13.1867 19.4363 12.375C19.5656 12.1543 19.5659 11.8943 19.4373 11.6729C19.2235 11.3049 18.921 10.8242 18.5364 10.3003C18.3085 9.98991 18.3302 9.5573 18.6025 9.28503ZM12.0008 4.75C12.5814 4.75006 13.1358 4.81803 13.6632 4.93953C14.2182 5.06741 14.362 5.74812 13.9593 6.15091C13.7558 6.35435 13.4589 6.42748 13.1771 6.36984C12.7983 6.29239 12.4061 6.25006 12.0008 6.25C10.1167 6.25 8.51415 7.15145 7.23028 8.31543C5.94678 9.47919 5.03918 10.8555 4.56426 11.6729C4.43551 11.8945 4.43582 12.1542 4.56524 12.375C4.77587 12.7343 5.07189 13.2012 5.44718 13.7105C5.67623 14.0213 5.65493 14.4552 5.38193 14.7282C5.0671 15.0431 4.54833 15.0189 4.28292 14.6614C3.84652 14.0736 3.50813 13.5369 3.27129 13.1328C2.86831 12.4451 2.86717 11.6088 3.26739 10.9199C3.78185 10.0345 4.77959 8.51239 6.22247 7.2041C7.66547 5.89584 9.61202 4.75 12.0008 4.75Z`,fill:`currentColor`}),(0,u.jsx)(`path`,{d:`M5 19L19 5`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`})]})]}),te=({size:e=24,isPaused:t=!1})=>(0,u.jsxs)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,children:[(0,u.jsxs)(`g`,{className:`${g.iconFadeFast} ${t?g.hidden:g.visible}`,children:[(0,u.jsx)(`path`,{d:`M8 6L8 18`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`}),(0,u.jsx)(`path`,{d:`M16 18L16 6`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`})]}),(0,u.jsx)(`path`,{className:`${g.iconFadeFast} ${t?g.visible:g.hidden}`,d:`M17.75 10.701C18.75 11.2783 18.75 12.7217 17.75 13.299L8.75 18.4952C7.75 19.0725 6.5 18.3509 6.5 17.1962L6.5 6.80384C6.5 5.64914 7.75 4.92746 8.75 5.50481L17.75 10.701Z`,stroke:`currentColor`,strokeWidth:`1.5`})]}),ne=({size:e=16})=>(0,u.jsxs)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,children:[(0,u.jsx)(`path`,{d:`M10.6504 5.81117C10.9939 4.39628 13.0061 4.39628 13.3496 5.81117C13.5715 6.72517 14.6187 7.15891 15.4219 6.66952C16.6652 5.91193 18.0881 7.33479 17.3305 8.57815C16.8411 9.38134 17.2748 10.4285 18.1888 10.6504C19.6037 10.9939 19.6037 13.0061 18.1888 13.3496C17.2748 13.5715 16.8411 14.6187 17.3305 15.4219C18.0881 16.6652 16.6652 18.0881 15.4219 17.3305C14.6187 16.8411 13.5715 17.2748 13.3496 18.1888C13.0061 19.6037 10.9939 19.6037 10.6504 18.1888C10.4285 17.2748 9.38135 16.8411 8.57815 17.3305C7.33479 18.0881 5.91193 16.6652 6.66952 15.4219C7.15891 14.6187 6.72517 13.5715 5.81117 13.3496C4.39628 13.0061 4.39628 10.9939 5.81117 10.6504C6.72517 10.4285 7.15891 9.38134 6.66952 8.57815C5.91193 7.33479 7.33479 5.91192 8.57815 6.66952C9.38135 7.15891 10.4285 6.72517 10.6504 5.81117Z`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`}),(0,u.jsx)(`circle`,{cx:`12`,cy:`12`,r:`2.5`,stroke:`currentColor`,strokeWidth:`1.5`})]}),S=({size:e=16})=>(0,u.jsx)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,children:(0,u.jsx)(`path`,{d:`M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4384 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z`,fill:`currentColor`})}),C=({size:e=16})=>(0,u.jsxs)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,children:[(0,u.jsxs)(`g`,{clipPath:`url(#clip0_2_53)`,children:[(0,u.jsx)(`path`,{d:`M16.25 16.25L7.75 7.75`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`}),(0,u.jsx)(`path`,{d:`M7.75 16.25L16.25 7.75`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`})]}),(0,u.jsx)(`defs`,{children:(0,u.jsx)(`clipPath`,{id:`clip0_2_53`,children:(0,u.jsx)(`rect`,{width:`24`,height:`24`,fill:`white`})})})]}),re=({size:e=24})=>(0,u.jsx)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,children:(0,u.jsx)(`path`,{d:`M16.7198 6.21973C17.0127 5.92683 17.4874 5.92683 17.7803 6.21973C18.0732 6.51262 18.0732 6.9874 17.7803 7.28027L13.0606 12L17.7803 16.7197C18.0732 17.0126 18.0732 17.4874 17.7803 17.7803C17.4875 18.0731 17.0127 18.0731 16.7198 17.7803L12.0001 13.0605L7.28033 17.7803C6.98746 18.0731 6.51268 18.0731 6.21979 17.7803C5.92689 17.4874 5.92689 17.0126 6.21979 16.7197L10.9395 12L6.21979 7.28027C5.92689 6.98738 5.92689 6.51262 6.21979 6.21973C6.51268 5.92683 6.98744 5.92683 7.28033 6.21973L12.0001 10.9395L16.7198 6.21973Z`,fill:`currentColor`})}),w=({size:e=16})=>(0,u.jsxs)(`svg`,{width:e,height:e,viewBox:`0 0 20 20`,fill:`none`,children:[(0,u.jsx)(`path`,{d:`M9.99999 12.7082C11.4958 12.7082 12.7083 11.4956 12.7083 9.99984C12.7083 8.50407 11.4958 7.2915 9.99999 7.2915C8.50422 7.2915 7.29166 8.50407 7.29166 9.99984C7.29166 11.4956 8.50422 12.7082 9.99999 12.7082Z`,stroke:`currentColor`,strokeWidth:`1.25`,strokeLinecap:`round`,strokeLinejoin:`round`}),(0,u.jsx)(`path`,{d:`M10 3.9585V5.05698`,stroke:`currentColor`,strokeWidth:`1.25`,strokeLinecap:`round`,strokeLinejoin:`round`}),(0,u.jsx)(`path`,{d:`M10 14.9429V16.0414`,stroke:`currentColor`,strokeWidth:`1.25`,strokeLinecap:`round`,strokeLinejoin:`round`}),(0,u.jsx)(`path`,{d:`M5.7269 5.72656L6.50682 6.50649`,stroke:`currentColor`,strokeWidth:`1.25`,strokeLinecap:`round`,strokeLinejoin:`round`}),(0,u.jsx)(`path`,{d:`M13.4932 13.4932L14.2731 14.2731`,stroke:`currentColor`,strokeWidth:`1.25`,strokeLinecap:`round`,strokeLinejoin:`round`}),(0,u.jsx)(`path`,{d:`M3.95834 10H5.05683`,stroke:`currentColor`,strokeWidth:`1.25`,strokeLinecap:`round`,strokeLinejoin:`round`}),(0,u.jsx)(`path`,{d:`M14.9432 10H16.0417`,stroke:`currentColor`,strokeWidth:`1.25`,strokeLinecap:`round`,strokeLinejoin:`round`}),(0,u.jsx)(`path`,{d:`M5.7269 14.2731L6.50682 13.4932`,stroke:`currentColor`,strokeWidth:`1.25`,strokeLinecap:`round`,strokeLinejoin:`round`}),(0,u.jsx)(`path`,{d:`M13.4932 6.50649L14.2731 5.72656`,stroke:`currentColor`,strokeWidth:`1.25`,strokeLinecap:`round`,strokeLinejoin:`round`})]}),T=({size:e=16})=>(0,u.jsx)(`svg`,{width:e,height:e,viewBox:`0 0 20 20`,fill:`none`,children:(0,u.jsx)(`path`,{d:`M15.5 10.4955C15.4037 11.5379 15.0124 12.5314 14.3721 13.3596C13.7317 14.1878 12.8688 14.8165 11.8841 15.1722C10.8995 15.5278 9.83397 15.5957 8.81217 15.3679C7.79038 15.1401 6.8546 14.6259 6.11434 13.8857C5.37408 13.1454 4.85995 12.2096 4.63211 11.1878C4.40427 10.166 4.47215 9.10048 4.82781 8.11585C5.18346 7.13123 5.81218 6.26825 6.64039 5.62791C7.4686 4.98756 8.46206 4.59634 9.5045 4.5C8.89418 5.32569 8.60049 6.34302 8.67685 7.36695C8.75321 8.39087 9.19454 9.35339 9.92058 10.0794C10.6466 10.8055 11.6091 11.2468 12.6331 11.3231C13.657 11.3995 14.6743 11.1058 15.5 10.4955Z`,stroke:`currentColor`,strokeWidth:`1.13793`,strokeLinecap:`round`,strokeLinejoin:`round`})}),ie=({size:e=16})=>(0,u.jsx)(`svg`,{width:e,height:e,viewBox:`0 0 16 16`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`,children:(0,u.jsx)(`path`,{d:`M11.3799 6.9572L9.05645 4.63375M11.3799 6.9572L6.74949 11.5699C6.61925 11.6996 6.45577 11.791 6.277 11.8339L4.29549 12.3092C3.93194 12.3964 3.60478 12.0683 3.69297 11.705L4.16585 9.75693C4.20893 9.57947 4.29978 9.4172 4.42854 9.28771L9.05645 4.63375M11.3799 6.9572L12.3455 5.98759C12.9839 5.34655 12.9839 4.31002 12.3455 3.66897C11.7033 3.02415 10.6594 3.02415 10.0172 3.66897L9.06126 4.62892L9.05645 4.63375`,stroke:`currentColor`,strokeWidth:`0.9`,strokeLinecap:`round`,strokeLinejoin:`round`})}),ae=({size:e=24})=>(0,u.jsx)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`,children:(0,u.jsx)(`path`,{d:`M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4383 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z`,fill:`currentColor`})}),oe=({size:e=16})=>(0,u.jsx)(`svg`,{width:e,height:e,viewBox:`0 0 16 16`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`,children:(0,u.jsx)(`path`,{d:`M8.5 3.5L4 8L8.5 12.5`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`})}),se=({size:e=24})=>(0,u.jsxs)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`3`,y:`3`,width:`18`,height:`18`,rx:`2`,stroke:`currentColor`,strokeWidth:`1.5`}),(0,u.jsx)(`line`,{x1:`3`,y1:`9`,x2:`21`,y2:`9`,stroke:`currentColor`,strokeWidth:`1.5`}),(0,u.jsx)(`line`,{x1:`9`,y1:`9`,x2:`9`,y2:`21`,stroke:`currentColor`,strokeWidth:`1.5`})]}),E=[`data-feedback-toolbar`,`data-annotation-popup`,`data-annotation-marker`],ce=E.flatMap(e=>[`:not([${e}])`,`:not([${e}] *)`]).join(``),le=`feedback-freeze-styles`,D=`__agentation_freeze`;function ue(){if(typeof window>`u`)return{frozen:!1,installed:!0,origSetTimeout:setTimeout,origSetInterval:setInterval,origRAF:e=>0,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]};let e=window;return e[D]||(e[D]={frozen:!1,installed:!1,origSetTimeout:null,origSetInterval:null,origRAF:null,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]}),e[D]}var O=ue();typeof window<`u`&&!O.installed&&(O.origSetTimeout=window.setTimeout.bind(window),O.origSetInterval=window.setInterval.bind(window),O.origRAF=window.requestAnimationFrame.bind(window),window.setTimeout=(e,t,...n)=>typeof e==`string`?O.origSetTimeout(e,t):O.origSetTimeout((...t)=>{O.frozen?O.frozenTimeoutQueue.push(()=>e(...t)):e(...t)},t,...n),window.setInterval=(e,t,...n)=>typeof e==`string`?O.origSetInterval(e,t):O.origSetInterval((...t)=>{O.frozen||e(...t)},t,...n),window.requestAnimationFrame=e=>O.origRAF(t=>{O.frozen?O.frozenRAFQueue.push(e):e(t)}),O.installed=!0);var k=O.origSetTimeout,de=O.origSetInterval,fe=O.origRAF;function pe(e){return e?E.some(t=>!!e.closest?.(`[${t}]`)):!1}function me(){if(typeof document>`u`||O.frozen)return;O.frozen=!0,O.frozenTimeoutQueue=[],O.frozenRAFQueue=[];let e=document.getElementById(le);e||(e=document.createElement(`style`),e.id=le),e.textContent=`
    *${ce},
    *${ce}::before,
    *${ce}::after {
      animation-play-state: paused !important;
      transition: none !important;
    }
  `,document.head.appendChild(e),O.pausedAnimations=[];try{document.getAnimations().forEach(e=>{if(e.playState!==`running`)return;let t=e.effect?.target;pe(t)||(e.pause(),O.pausedAnimations.push(e))})}catch{}document.querySelectorAll(`video`).forEach(e=>{e.paused||(e.dataset.wasPaused=`false`,e.pause())})}function he(){if(typeof document>`u`||!O.frozen)return;O.frozen=!1;let e=O.frozenTimeoutQueue;O.frozenTimeoutQueue=[];for(let t of e)O.origSetTimeout(()=>{if(O.frozen){O.frozenTimeoutQueue.push(t);return}try{t()}catch(e){console.warn(`[agentation] Error replaying queued timeout:`,e)}},0);let t=O.frozenRAFQueue;O.frozenRAFQueue=[];for(let e of t)O.origRAF(t=>{if(O.frozen){O.frozenRAFQueue.push(e);return}e(t)});for(let e of O.pausedAnimations)try{e.play()}catch(e){console.warn(`[agentation] Error resuming animation:`,e)}O.pausedAnimations=[],document.getElementById(le)?.remove(),document.querySelectorAll(`video`).forEach(e=>{e.dataset.wasPaused===`false`&&(e.play().catch(()=>{}),delete e.dataset.wasPaused)})}function ge(e){if(!e)return;let t=e=>e.stopImmediatePropagation();document.addEventListener(`focusin`,t,!0),document.addEventListener(`focusout`,t,!0);try{e.focus()}finally{document.removeEventListener(`focusin`,t,!0),document.removeEventListener(`focusout`,t,!0)}}var _e=(0,c.forwardRef)(function({element:e,timestamp:t,selectedText:n,placeholder:r=`What should change?`,initialValue:i=``,submitLabel:a=`Add`,onSubmit:o,onCancel:s,onDelete:l,style:d,accentColor:f=`#3c82f7`,isExiting:m=!1,lightMode:h=!1,computedStyles:g},_){let[v,y]=(0,c.useState)(i),[b,ee]=(0,c.useState)(!1),[x,te]=(0,c.useState)(`initial`),[ne,S]=(0,c.useState)(!1),[C,re]=(0,c.useState)(!1),w=(0,c.useRef)(null),T=(0,c.useRef)(null),ie=(0,c.useRef)(null),oe=(0,c.useRef)(null);(0,c.useEffect)(()=>{m&&x!==`exit`&&te(`exit`)},[m,x]),(0,c.useEffect)(()=>{k(()=>{te(`enter`)},0);let e=k(()=>{te(`entered`)},200),t=k(()=>{let e=w.current;e&&(ge(e),e.selectionStart=e.selectionEnd=e.value.length,e.scrollTop=e.scrollHeight)},50);return()=>{clearTimeout(e),clearTimeout(t),ie.current&&clearTimeout(ie.current),oe.current&&clearTimeout(oe.current)}},[]);let se=(0,c.useCallback)(()=>{oe.current&&clearTimeout(oe.current),ee(!0),oe.current=k(()=>{ee(!1),ge(w.current)},250)},[]);(0,c.useImperativeHandle)(_,()=>({shake:se}),[se]);let E=(0,c.useCallback)(()=>{te(`exit`),ie.current=k(()=>{s()},150)},[s]),ce=(0,c.useCallback)(()=>{v.trim()&&o(v.trim())},[v,o]),le=(0,c.useCallback)(e=>{e.stopPropagation(),!e.nativeEvent.isComposing&&(e.key===`Enter`&&!e.shiftKey&&(e.preventDefault(),ce()),e.key===`Escape`&&E())},[ce,E]),D=[p.popup,h?p.light:``,x===`enter`?p.enter:``,x===`entered`?p.entered:``,x===`exit`?p.exit:``,b?p.shake:``].filter(Boolean).join(` `);return(0,u.jsxs)(`div`,{ref:T,className:D,"data-annotation-popup":!0,style:d,onClick:e=>e.stopPropagation(),children:[(0,u.jsxs)(`div`,{className:p.header,children:[g&&Object.keys(g).length>0?(0,u.jsxs)(`button`,{className:p.headerToggle,onClick:()=>{let e=C;re(!C),e&&k(()=>ge(w.current),0)},type:`button`,children:[(0,u.jsx)(`svg`,{className:`${p.chevron} ${C?p.expanded:``}`,width:`14`,height:`14`,viewBox:`0 0 14 14`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`,children:(0,u.jsx)(`path`,{d:`M5.5 10.25L9 7.25L5.75 4`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`})}),(0,u.jsx)(`span`,{className:p.element,children:e})]}):(0,u.jsx)(`span`,{className:p.element,children:e}),t&&(0,u.jsx)(`span`,{className:p.timestamp,children:t})]}),g&&Object.keys(g).length>0&&(0,u.jsx)(`div`,{className:`${p.stylesWrapper} ${C?p.expanded:``}`,children:(0,u.jsx)(`div`,{className:p.stylesInner,children:(0,u.jsx)(`div`,{className:p.stylesBlock,children:Object.entries(g).map(([e,t])=>(0,u.jsxs)(`div`,{className:p.styleLine,children:[(0,u.jsx)(`span`,{className:p.styleProperty,children:e.replace(/([A-Z])/g,`-$1`).toLowerCase()}),`: `,(0,u.jsx)(`span`,{className:p.styleValue,children:t}),`;`]},e))})})}),n&&(0,u.jsxs)(`div`,{className:p.quote,children:[`“`,n.slice(0,80),n.length>80?`...`:``,`”`]}),(0,u.jsx)(`textarea`,{ref:w,className:p.textarea,style:{borderColor:ne?f:void 0},placeholder:r,value:v,onChange:e=>y(e.target.value),onFocus:()=>S(!0),onBlur:()=>S(!1),rows:2,onKeyDown:le}),(0,u.jsxs)(`div`,{className:p.actions,children:[l&&(0,u.jsx)(`div`,{className:p.deleteWrapper,children:(0,u.jsx)(`button`,{className:p.deleteButton,onClick:l,type:`button`,children:(0,u.jsx)(ae,{size:22})})}),(0,u.jsx)(`button`,{className:p.cancel,onClick:E,children:`Cancel`}),(0,u.jsx)(`button`,{className:p.submit,style:{backgroundColor:f,opacity:v.trim()?1:.4},onClick:ce,disabled:!v.trim(),children:a})]})]})}),ve=({content:e,children:t,...n})=>{let[r,i]=(0,c.useState)(!1),[a,o]=(0,c.useState)(!1),[s,d]=(0,c.useState)({top:0,right:0}),f=(0,c.useRef)(null),p=(0,c.useRef)(null),m=(0,c.useRef)(null),h=()=>{if(f.current){let e=f.current.getBoundingClientRect();d({top:e.top+e.height/2,right:window.innerWidth-e.left+8})}};return(0,c.useEffect)(()=>()=>{p.current&&clearTimeout(p.current),m.current&&clearTimeout(m.current)},[]),(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(`span`,{ref:f,onMouseEnter:()=>{o(!0),m.current&&=(clearTimeout(m.current),null),h(),p.current=k(()=>{i(!0)},500)},onMouseLeave:()=>{p.current&&=(clearTimeout(p.current),null),i(!1),m.current=k(()=>{o(!1)},150)},...n,children:t}),a&&(0,l.createPortal)((0,u.jsx)(`div`,{"data-feedback-toolbar":!0,style:{position:`fixed`,top:s.top,right:s.right,transform:`translateY(-50%)`,padding:`6px 10px`,background:`#383838`,color:`rgba(255, 255, 255, 0.7)`,fontSize:`11px`,fontWeight:400,lineHeight:`14px`,borderRadius:`10px`,width:`180px`,textAlign:`left`,zIndex:100020,pointerEvents:`none`,boxShadow:`0px 1px 8px rgba(0, 0, 0, 0.28)`,opacity:+!!r,transition:`opacity 0.15s ease`},children:e}),document.body)]})},ye=`.styles-module__tooltip___mcXL2 {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: help;
}

.styles-module__tooltipIcon___Nq2nD {
  transform: translateY(0.5px);
  color: #fff;
  opacity: 0.2;
  transition: opacity 0.15s ease;
  will-change: transform;
}
.styles-module__tooltip___mcXL2:hover .styles-module__tooltipIcon___Nq2nD {
  opacity: 0.5;
}
[data-agentation-theme=light] .styles-module__tooltipIcon___Nq2nD {
  color: #000;
}`,be={tooltip:`styles-module__tooltip___mcXL2`,tooltipIcon:`styles-module__tooltipIcon___Nq2nD`};if(typeof document<`u`){let e=document.getElementById(`feedback-tool-styles-help-tooltip-styles`);e||(e=document.createElement(`style`),e.id=`feedback-tool-styles-help-tooltip-styles`,document.head.appendChild(e)),e.textContent=ye}var xe=be,Se=({content:e})=>(0,u.jsx)(ve,{className:xe.tooltip,content:e,children:(0,u.jsx)(y,{className:xe.tooltipIcon})}),A={navigation:{width:800,height:56},hero:{width:800,height:320},header:{width:800,height:80},section:{width:800,height:400},sidebar:{width:240,height:400},footer:{width:800,height:160},modal:{width:480,height:300},card:{width:280,height:240},text:{width:400,height:120},image:{width:320,height:200},video:{width:480,height:270},table:{width:560,height:220},grid:{width:600,height:300},list:{width:300,height:180},chart:{width:400,height:240},button:{width:140,height:40},input:{width:280,height:56},form:{width:360,height:320},tabs:{width:480,height:240},dropdown:{width:200,height:200},toggle:{width:44,height:24},search:{width:320,height:44},avatar:{width:48,height:48},badge:{width:80,height:28},breadcrumb:{width:300,height:24},pagination:{width:300,height:36},progress:{width:240,height:8},divider:{width:600,height:1},accordion:{width:400,height:200},carousel:{width:600,height:300},toast:{width:320,height:64},tooltip:{width:180,height:40},pricing:{width:300,height:360},testimonial:{width:360,height:200},cta:{width:600,height:160},alert:{width:400,height:56},banner:{width:800,height:48},stat:{width:200,height:120},stepper:{width:480,height:48},tag:{width:72,height:28},rating:{width:160,height:28},map:{width:480,height:300},timeline:{width:360,height:320},fileUpload:{width:360,height:180},codeBlock:{width:480,height:200},calendar:{width:300,height:300},notification:{width:360,height:72},productCard:{width:280,height:360},profile:{width:280,height:200},drawer:{width:320,height:400},popover:{width:240,height:160},logo:{width:120,height:40},faq:{width:560,height:320},gallery:{width:560,height:360},checkbox:{width:20,height:20},radio:{width:20,height:20},slider:{width:240,height:32},datePicker:{width:300,height:320},skeleton:{width:320,height:120},chip:{width:96,height:32},icon:{width:24,height:24},spinner:{width:32,height:32},feature:{width:360,height:200},team:{width:560,height:280},login:{width:360,height:360},contact:{width:400,height:320}},j=[{section:`Layout`,items:[{type:`navigation`,label:`Navigation`,...A.navigation},{type:`header`,label:`Header`,...A.header},{type:`hero`,label:`Hero`,...A.hero},{type:`section`,label:`Section`,...A.section},{type:`sidebar`,label:`Sidebar`,...A.sidebar},{type:`footer`,label:`Footer`,...A.footer},{type:`modal`,label:`Modal`,...A.modal},{type:`banner`,label:`Banner`,...A.banner},{type:`drawer`,label:`Drawer`,...A.drawer},{type:`popover`,label:`Popover`,...A.popover},{type:`divider`,label:`Divider`,...A.divider}]},{section:`Content`,items:[{type:`card`,label:`Card`,...A.card},{type:`text`,label:`Text`,...A.text},{type:`image`,label:`Image`,...A.image},{type:`video`,label:`Video`,...A.video},{type:`table`,label:`Table`,...A.table},{type:`grid`,label:`Grid`,...A.grid},{type:`list`,label:`List`,...A.list},{type:`chart`,label:`Chart`,...A.chart},{type:`codeBlock`,label:`Code Block`,...A.codeBlock},{type:`map`,label:`Map`,...A.map},{type:`timeline`,label:`Timeline`,...A.timeline},{type:`calendar`,label:`Calendar`,...A.calendar},{type:`accordion`,label:`Accordion`,...A.accordion},{type:`carousel`,label:`Carousel`,...A.carousel},{type:`logo`,label:`Logo`,...A.logo},{type:`faq`,label:`FAQ`,...A.faq},{type:`gallery`,label:`Gallery`,...A.gallery}]},{section:`Controls`,items:[{type:`button`,label:`Button`,...A.button},{type:`input`,label:`Input`,...A.input},{type:`search`,label:`Search`,...A.search},{type:`form`,label:`Form`,...A.form},{type:`tabs`,label:`Tabs`,...A.tabs},{type:`dropdown`,label:`Dropdown`,...A.dropdown},{type:`toggle`,label:`Toggle`,...A.toggle},{type:`stepper`,label:`Stepper`,...A.stepper},{type:`rating`,label:`Rating`,...A.rating},{type:`fileUpload`,label:`File Upload`,...A.fileUpload},{type:`checkbox`,label:`Checkbox`,...A.checkbox},{type:`radio`,label:`Radio`,...A.radio},{type:`slider`,label:`Slider`,...A.slider},{type:`datePicker`,label:`Date Picker`,...A.datePicker}]},{section:`Elements`,items:[{type:`avatar`,label:`Avatar`,...A.avatar},{type:`badge`,label:`Badge`,...A.badge},{type:`tag`,label:`Tag`,...A.tag},{type:`breadcrumb`,label:`Breadcrumb`,...A.breadcrumb},{type:`pagination`,label:`Pagination`,...A.pagination},{type:`progress`,label:`Progress`,...A.progress},{type:`alert`,label:`Alert`,...A.alert},{type:`toast`,label:`Toast`,...A.toast},{type:`notification`,label:`Notification`,...A.notification},{type:`tooltip`,label:`Tooltip`,...A.tooltip},{type:`stat`,label:`Stat`,...A.stat},{type:`skeleton`,label:`Skeleton`,...A.skeleton},{type:`chip`,label:`Chip`,...A.chip},{type:`icon`,label:`Icon`,...A.icon},{type:`spinner`,label:`Spinner`,...A.spinner}]},{section:`Blocks`,items:[{type:`pricing`,label:`Pricing`,...A.pricing},{type:`testimonial`,label:`Testimonial`,...A.testimonial},{type:`cta`,label:`CTA`,...A.cta},{type:`productCard`,label:`Product Card`,...A.productCard},{type:`profile`,label:`Profile`,...A.profile},{type:`feature`,label:`Feature`,...A.feature},{type:`team`,label:`Team`,...A.team},{type:`login`,label:`Login`,...A.login},{type:`contact`,label:`Contact`,...A.contact}]}],M={};for(let e of j)for(let t of e.items)M[t.type]=t;function N({w:e,h:t=3,strong:n}){return(0,u.jsx)(`div`,{style:{width:typeof e==`number`?`${e}px`:e,height:t,borderRadius:2,background:n?`var(--agd-bar-strong)`:`var(--agd-bar)`,flexShrink:0}})}function P({w:e,h:t,radius:n=3,style:r}){return(0,u.jsx)(`div`,{style:{width:typeof e==`number`?`${e}px`:e,height:typeof t==`number`?`${t}px`:t,borderRadius:n,border:`1px dashed var(--agd-stroke)`,background:`var(--agd-fill)`,flexShrink:0,...r}})}function F({size:e}){return(0,u.jsx)(`div`,{style:{width:e,height:e,borderRadius:`50%`,border:`1px dashed var(--agd-stroke)`,background:`var(--agd-fill)`,flexShrink:0}})}function Ce({width:e,height:t}){let n=Math.max(8,t*.2);return(0,u.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,height:`100%`,padding:`0 ${n}px`,gap:e*.02},children:[(0,u.jsx)(P,{w:Math.max(20,t*.5),h:Math.max(12,t*.4),radius:2}),(0,u.jsxs)(`div`,{style:{flex:1,display:`flex`,gap:e*.03,marginLeft:e*.04},children:[(0,u.jsx)(N,{w:e*.06}),(0,u.jsx)(N,{w:e*.07}),(0,u.jsx)(N,{w:e*.05}),(0,u.jsx)(N,{w:e*.06})]}),(0,u.jsx)(P,{w:e*.1,h:Math.min(28,t*.5),radius:4})]})}function we({width:e,height:t,text:n}){return(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`,height:`100%`,gap:t*.05},children:[n?(0,u.jsx)(`span`,{style:{fontSize:Math.min(20,t*.08),fontWeight:600,color:`var(--agd-text-3)`,textAlign:`center`,maxWidth:`80%`},children:n}):(0,u.jsx)(N,{w:e*.5,h:Math.max(6,t*.04),strong:!0}),(0,u.jsx)(N,{w:e*.6}),(0,u.jsx)(N,{w:e*.4}),(0,u.jsx)(P,{w:Math.min(140,e*.2),h:Math.min(36,t*.12),radius:6,style:{marginTop:t*.06}})]})}function Te({width:e,height:t}){let n=Math.max(3,Math.floor(t/36));return(0,u.jsxs)(`div`,{style:{padding:e*.08,display:`flex`,flexDirection:`column`,gap:t*.03},children:[(0,u.jsx)(N,{w:e*.6,h:4,strong:!0}),Array.from({length:n},(t,n)=>(0,u.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:6},children:[(0,u.jsx)(P,{w:10,h:10,radius:2}),(0,u.jsx)(N,{w:e*(.4+n*17%30/100)})]},n))]})}function Ee({width:e,height:t}){let n=Math.max(2,Math.min(4,Math.floor(e/160)));return(0,u.jsx)(`div`,{style:{display:`flex`,padding:`${t*.12}px ${e*.03}px`,gap:e*.05},children:Array.from({length:n},(e,t)=>(0,u.jsxs)(`div`,{style:{flex:1,display:`flex`,flexDirection:`column`,gap:4},children:[(0,u.jsx)(N,{w:`60%`,h:3,strong:!0}),(0,u.jsx)(N,{w:`80%`,h:2}),(0,u.jsx)(N,{w:`70%`,h:2}),(0,u.jsx)(N,{w:`60%`,h:2})]},t))})}function De({width:e,height:t}){return(0,u.jsxs)(`div`,{style:{height:`100%`,display:`flex`,flexDirection:`column`},children:[(0,u.jsxs)(`div`,{style:{padding:`10px 12px`,borderBottom:`1px solid var(--agd-stroke)`,display:`flex`,alignItems:`center`,justifyContent:`space-between`},children:[(0,u.jsx)(N,{w:e*.3,h:4,strong:!0}),(0,u.jsx)(`div`,{style:{width:14,height:14,border:`1px solid var(--agd-stroke)`,borderRadius:3}})]}),(0,u.jsxs)(`div`,{style:{flex:1,padding:12,display:`flex`,flexDirection:`column`,gap:6},children:[(0,u.jsx)(N,{w:`90%`}),(0,u.jsx)(N,{w:`70%`}),(0,u.jsx)(N,{w:`80%`})]}),(0,u.jsxs)(`div`,{style:{padding:`10px 12px`,borderTop:`1px solid var(--agd-stroke)`,display:`flex`,justifyContent:`flex-end`,gap:8},children:[(0,u.jsx)(P,{w:70,h:26,radius:4}),(0,u.jsx)(P,{w:70,h:26,radius:4,style:{background:`var(--agd-bar)`}})]})]})}function Oe({width:e,height:t}){return(0,u.jsxs)(`div`,{style:{height:`100%`,display:`flex`,flexDirection:`column`},children:[(0,u.jsx)(`div`,{style:{height:`40%`,background:`var(--agd-fill)`,borderBottom:`1px dashed var(--agd-stroke)`}}),(0,u.jsxs)(`div`,{style:{flex:1,padding:10,display:`flex`,flexDirection:`column`,gap:5},children:[(0,u.jsx)(N,{w:`70%`,h:4,strong:!0}),(0,u.jsx)(N,{w:`95%`,h:2}),(0,u.jsx)(N,{w:`85%`,h:2}),(0,u.jsx)(N,{w:`50%`,h:2})]})]})}function ke({width:e,height:t,text:n}){if(n)return(0,u.jsx)(`div`,{style:{padding:4,fontSize:Math.min(14,t*.3),lineHeight:1.5,color:`var(--agd-text-3)`,wordBreak:`break-word`,overflow:`hidden`},children:n});let r=Math.max(2,Math.floor(t/18));return(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:6,padding:4},children:[(0,u.jsx)(N,{w:e*.6,h:5,strong:!0}),Array.from({length:r},(e,t)=>(0,u.jsx)(N,{w:`${70+t*13%25}%`,h:2},t))]})}function Ae({width:e,height:t}){return(0,u.jsx)(`div`,{style:{height:`100%`,position:`relative`},children:(0,u.jsxs)(`svg`,{width:`100%`,height:`100%`,viewBox:`0 0 ${e} ${t}`,preserveAspectRatio:`none`,fill:`none`,children:[(0,u.jsx)(`line`,{x1:`0`,y1:`0`,x2:e,y2:t,stroke:`var(--agd-stroke)`,strokeWidth:`1`}),(0,u.jsx)(`line`,{x1:e,y1:`0`,x2:`0`,y2:t,stroke:`var(--agd-stroke)`,strokeWidth:`1`}),(0,u.jsx)(`circle`,{cx:e*.3,cy:t*.3,r:Math.min(e,t)*.08,fill:`var(--agd-fill)`,stroke:`var(--agd-stroke)`,strokeWidth:`0.8`})]})})}function je({width:e,height:t}){let n=Math.max(2,Math.min(5,Math.floor(e/100))),r=Math.max(2,Math.min(6,Math.floor(t/32)));return(0,u.jsxs)(`div`,{style:{height:`100%`,display:`flex`,flexDirection:`column`},children:[(0,u.jsx)(`div`,{style:{display:`flex`,borderBottom:`1px solid var(--agd-stroke)`,padding:`6px 0`},children:Array.from({length:n},(e,t)=>(0,u.jsx)(`div`,{style:{flex:1,padding:`0 8px`},children:(0,u.jsx)(N,{w:`70%`,h:3,strong:!0})},t))}),Array.from({length:r},(e,t)=>(0,u.jsx)(`div`,{style:{display:`flex`,borderBottom:`1px solid rgba(255,255,255,0.03)`,padding:`6px 0`},children:Array.from({length:n},(e,n)=>(0,u.jsx)(`div`,{style:{flex:1,padding:`0 8px`},children:(0,u.jsx)(N,{w:`${50+(t*7+n*13)%40}%`,h:2})},n))},t))]})}function Me({width:e,height:t}){let n=Math.max(2,Math.floor(t/28));return(0,u.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:4,padding:4},children:Array.from({length:n},(e,t)=>(0,u.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:8,padding:`4px 0`},children:[(0,u.jsx)(F,{size:8}),(0,u.jsx)(N,{w:`${55+t*17%35}%`,h:2})]},t))})}function Ne({width:e,height:t,text:n}){return(0,u.jsx)(`div`,{style:{height:`100%`,borderRadius:Math.min(8,t/3),border:`1px solid var(--agd-stroke)`,background:`var(--agd-fill)`,display:`flex`,alignItems:`center`,justifyContent:`center`},children:n?(0,u.jsx)(`span`,{style:{fontSize:Math.min(13,t*.4),fontWeight:500,color:`var(--agd-text-3)`,letterSpacing:`-0.01em`},children:n}):(0,u.jsx)(N,{w:Math.max(20,e*.5),h:3,strong:!0})})}function Pe({width:e,height:t}){return(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:4,height:`100%`,justifyContent:`center`},children:[(0,u.jsx)(N,{w:Math.min(80,e*.3),h:2}),(0,u.jsx)(`div`,{style:{height:Math.min(36,t*.6),borderRadius:4,border:`1px dashed var(--agd-stroke)`,background:`var(--agd-fill)`,display:`flex`,alignItems:`center`,paddingLeft:8},children:(0,u.jsx)(N,{w:`40%`,h:2})})]})}function Fe({width:e,height:t}){let n=Math.max(2,Math.min(5,Math.floor(t/56)));return(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:t*.04,padding:8},children:[Array.from({length:n},(e,t)=>(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:4},children:[(0,u.jsx)(N,{w:60+t*17%30,h:2}),(0,u.jsx)(P,{w:`100%`,h:28,radius:4})]},t)),(0,u.jsx)(P,{w:Math.min(120,e*.35),h:30,radius:6,style:{marginTop:8,alignSelf:`flex-end`,background:`var(--agd-bar)`}})]})}function Ie({width:e,height:t}){let n=Math.max(2,Math.min(4,Math.floor(e/120)));return(0,u.jsxs)(`div`,{style:{height:`100%`,display:`flex`,flexDirection:`column`},children:[(0,u.jsx)(`div`,{style:{display:`flex`,gap:2,borderBottom:`1px solid var(--agd-stroke)`},children:Array.from({length:n},(e,t)=>(0,u.jsx)(`div`,{style:{padding:`8px 12px`,borderBottom:t===0?`2px solid var(--agd-bar-strong)`:`none`},children:(0,u.jsx)(N,{w:60,h:3,strong:t===0})},t))}),(0,u.jsxs)(`div`,{style:{flex:1,padding:12,display:`flex`,flexDirection:`column`,gap:6},children:[(0,u.jsx)(N,{w:`80%`,h:2}),(0,u.jsx)(N,{w:`65%`,h:2}),(0,u.jsx)(N,{w:`75%`,h:2})]})]})}function Le({width:e,height:t}){let n=Math.min(e,t)/2;return(0,u.jsxs)(`svg`,{width:`100%`,height:`100%`,viewBox:`0 0 ${e} ${t}`,fill:`none`,children:[(0,u.jsx)(`circle`,{cx:e/2,cy:t/2,r:n-1,stroke:`var(--agd-stroke)`,fill:`var(--agd-fill)`,strokeWidth:`1.5`,strokeDasharray:`3 2`}),(0,u.jsx)(`circle`,{cx:e/2,cy:t*.38,r:n*.28,stroke:`var(--agd-stroke)`,fill:`var(--agd-fill)`,strokeWidth:`0.8`}),(0,u.jsx)(`path`,{d:`M${e/2-n*.55} ${t*.78} C${e/2-n*.55} ${t*.55} ${e/2+n*.55} ${t*.55} ${e/2+n*.55} ${t*.78}`,stroke:`var(--agd-stroke)`,fill:`var(--agd-fill)`,strokeWidth:`0.8`})]})}function I({width:e,height:t}){return(0,u.jsx)(`div`,{style:{height:`100%`,borderRadius:t/2,border:`1px solid var(--agd-stroke)`,background:`var(--agd-fill)`,display:`flex`,alignItems:`center`,justifyContent:`center`},children:(0,u.jsx)(N,{w:Math.max(16,e*.5),h:2,strong:!0})})}function Re({width:e,height:t}){return(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`,height:`100%`,gap:t*.08},children:[(0,u.jsx)(N,{w:e*.5,h:Math.max(5,t*.06),strong:!0}),(0,u.jsx)(N,{w:e*.35})]})}function ze({width:e,height:t}){return(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100%`,gap:t*.04,padding:e*.04},children:[(0,u.jsx)(N,{w:e*.3,h:4,strong:!0}),(0,u.jsx)(N,{w:e*.7}),(0,u.jsx)(N,{w:e*.5}),(0,u.jsxs)(`div`,{style:{flex:1,display:`flex`,gap:e*.03,marginTop:t*.06},children:[(0,u.jsx)(P,{w:`33%`,h:`100%`,radius:4}),(0,u.jsx)(P,{w:`33%`,h:`100%`,radius:4}),(0,u.jsx)(P,{w:`33%`,h:`100%`,radius:4})]})]})}function Be({width:e,height:t}){let n=Math.max(2,Math.min(4,Math.floor(e/140))),r=Math.max(1,Math.min(3,Math.floor(t/120)));return(0,u.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(${n}, 1fr)`,gridTemplateRows:`repeat(${r}, 1fr)`,gap:6,height:`100%`},children:Array.from({length:n*r},(e,t)=>(0,u.jsx)(P,{w:`100%`,h:`100%`,radius:4},t))})}function Ve({width:e,height:t}){let n=Math.max(2,Math.floor((t-32)/28));return(0,u.jsxs)(`div`,{style:{height:`100%`,display:`flex`,flexDirection:`column`},children:[(0,u.jsx)(`div`,{style:{padding:`6px 8px`,borderBottom:`1px solid var(--agd-stroke)`},children:(0,u.jsx)(N,{w:e*.5,h:3,strong:!0})}),(0,u.jsx)(`div`,{style:{flex:1,padding:4,display:`flex`,flexDirection:`column`,gap:2},children:Array.from({length:n},(e,t)=>(0,u.jsx)(`div`,{style:{padding:`4px 6px`,borderRadius:3,background:t===0?`var(--agd-fill)`:`transparent`},children:(0,u.jsx)(N,{w:`${50+t*17%35}%`,h:2,strong:t===0})},t))})]})}function He({width:e,height:t}){let n=Math.min(e,t)/2;return(0,u.jsxs)(`svg`,{width:`100%`,height:`100%`,viewBox:`0 0 ${e} ${t}`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`1`,y:`1`,width:e-2,height:t-2,rx:n,stroke:`var(--agd-stroke)`,strokeWidth:`1`}),(0,u.jsx)(`circle`,{cx:e-n,cy:t/2,r:n*.7,fill:`var(--agd-bar)`})]})}function Ue({width:e,height:t}){let n=Math.min(t/2,20);return(0,u.jsxs)(`div`,{style:{height:`100%`,borderRadius:n,border:`1px dashed var(--agd-stroke)`,background:`var(--agd-fill)`,display:`flex`,alignItems:`center`,padding:`0 ${n*.6}px`,gap:6},children:[(0,u.jsx)(F,{size:Math.min(14,t*.4)}),(0,u.jsx)(N,{w:`50%`,h:2})]})}function We({width:e,height:t}){return(0,u.jsxs)(`div`,{style:{height:`100%`,borderRadius:8,border:`1px dashed var(--agd-stroke)`,background:`var(--agd-fill)`,display:`flex`,alignItems:`center`,padding:`0 10px`,gap:8},children:[(0,u.jsx)(F,{size:Math.min(20,t*.5)}),(0,u.jsxs)(`div`,{style:{flex:1,display:`flex`,flexDirection:`column`,gap:3},children:[(0,u.jsx)(N,{w:`60%`,h:3,strong:!0}),(0,u.jsx)(N,{w:`80%`,h:2})]}),(0,u.jsx)(`div`,{style:{width:14,height:14,border:`1px solid var(--agd-stroke)`,borderRadius:3,flexShrink:0}})]})}function Ge({width:e,height:t}){return(0,u.jsxs)(`svg`,{width:`100%`,height:`100%`,viewBox:`0 0 ${e} ${t}`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`0`,y:`0`,width:e,height:t,rx:t/2,stroke:`var(--agd-stroke)`,strokeWidth:`0.8`}),(0,u.jsx)(`rect`,{x:`1`,y:`1`,width:e*.65,height:t-2,rx:(t-2)/2,fill:`var(--agd-bar)`})]})}function Ke({width:e,height:t}){let n=Math.max(3,Math.min(7,Math.floor(e/50))),r=e/(n*2);return(0,u.jsx)(`div`,{style:{height:`100%`,display:`flex`,alignItems:`flex-end`,justifyContent:`space-around`,padding:`0 4px`,borderBottom:`1px solid var(--agd-stroke)`},children:Array.from({length:n},(e,t)=>{let n=30+(t*37+17)%55;return(0,u.jsx)(P,{w:r,h:`${n}%`,radius:2},t)})})}function L({width:e,height:t}){let n=Math.min(e,t)*.12;return(0,u.jsxs)(`div`,{style:{height:`100%`,position:`relative`,display:`flex`,alignItems:`center`,justifyContent:`center`},children:[(0,u.jsx)(P,{w:`100%`,h:`100%`,radius:4}),(0,u.jsx)(`div`,{style:{position:`absolute`,width:n*2,height:n*2,borderRadius:`50%`,border:`1.5px solid var(--agd-stroke)`,background:`var(--agd-fill)`,display:`flex`,alignItems:`center`,justifyContent:`center`},children:(0,u.jsx)(`div`,{style:{width:0,height:0,borderLeft:`${n*.6}px solid var(--agd-bar-strong)`,borderTop:`${n*.4}px solid transparent`,borderBottom:`${n*.4}px solid transparent`,marginLeft:n*.15}})})]})}function qe({width:e,height:t}){return(0,u.jsxs)(`div`,{style:{height:`100%`,display:`flex`,flexDirection:`column`,alignItems:`center`},children:[(0,u.jsx)(`div`,{style:{flex:1,width:`100%`,borderRadius:6,border:`1px dashed var(--agd-stroke)`,background:`var(--agd-fill)`,display:`flex`,alignItems:`center`,justifyContent:`center`},children:(0,u.jsx)(N,{w:`60%`,h:2})}),(0,u.jsx)(`div`,{style:{width:8,height:8,background:`var(--agd-fill)`,border:`1px dashed var(--agd-stroke)`,borderTop:`none`,borderLeft:`none`,transform:`rotate(45deg)`,marginTop:-5}})]})}function Je({width:e,height:t}){let n=Math.max(2,Math.min(4,Math.floor(e/80)));return(0,u.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,height:`100%`,gap:4},children:Array.from({length:n},(e,t)=>(0,u.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:4},children:[t>0&&(0,u.jsx)(`span`,{style:{color:`var(--agd-stroke)`,fontSize:10},children:`/`}),(0,u.jsx)(N,{w:40+t*13%20,h:2,strong:t===n-1})]},t))})}function Ye({width:e,height:t}){let n=Math.max(3,Math.min(5,Math.floor(e/40))),r=Math.min(28,t*.8);return(0,u.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`center`,height:`100%`,gap:4},children:Array.from({length:n},(e,t)=>(0,u.jsx)(P,{w:r,h:r,radius:4,style:t===1?{background:`var(--agd-bar)`}:void 0},t))})}function Xe({width:e}){return(0,u.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,height:`100%`},children:(0,u.jsx)(`div`,{style:{width:`100%`,height:1,background:`var(--agd-stroke)`}})})}function Ze({width:e,height:t}){let n=Math.max(2,Math.min(4,Math.floor(t/40)));return(0,u.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100%`},children:Array.from({length:n},(e,t)=>(0,u.jsxs)(`div`,{style:{borderBottom:`1px solid var(--agd-stroke)`,padding:`8px 6px`,display:`flex`,alignItems:`center`,justifyContent:`space-between`,flex:t===0?2:1},children:[(0,u.jsx)(N,{w:`${40+t*17%25}%`,h:3,strong:!0}),(0,u.jsx)(`span`,{style:{fontSize:8,color:`var(--agd-stroke)`},children:t===0?`▼`:`▶`})]},t))})}function Qe({width:e,height:t}){return(0,u.jsxs)(`div`,{style:{height:`100%`,display:`flex`,flexDirection:`column`,gap:6},children:[(0,u.jsxs)(`div`,{style:{flex:1,display:`flex`,gap:6,alignItems:`center`},children:[(0,u.jsx)(`span`,{style:{fontSize:12,color:`var(--agd-stroke)`},children:`‹`}),(0,u.jsx)(P,{w:`100%`,h:`100%`,radius:4}),(0,u.jsx)(`span`,{style:{fontSize:12,color:`var(--agd-stroke)`},children:`›`})]}),(0,u.jsxs)(`div`,{style:{display:`flex`,justifyContent:`center`,gap:4},children:[(0,u.jsx)(F,{size:5}),(0,u.jsx)(F,{size:5}),(0,u.jsx)(F,{size:5})]})]})}function $e({width:e,height:t}){return(0,u.jsxs)(`div`,{style:{height:`100%`,display:`flex`,flexDirection:`column`,alignItems:`center`,padding:10,gap:t*.04},children:[(0,u.jsx)(N,{w:e*.4,h:3,strong:!0}),(0,u.jsx)(N,{w:e*.3,h:6,strong:!0}),(0,u.jsx)(`div`,{style:{flex:1,display:`flex`,flexDirection:`column`,gap:4,width:`100%`,padding:`8px 0`},children:Array.from({length:4},(e,t)=>(0,u.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:4},children:[(0,u.jsx)(F,{size:5}),(0,u.jsx)(N,{w:`${50+t*17%35}%`,h:2})]},t))}),(0,u.jsx)(P,{w:e*.7,h:Math.min(32,t*.1),radius:6,style:{background:`var(--agd-bar)`}})]})}function et({width:e,height:t}){return(0,u.jsxs)(`div`,{style:{height:`100%`,display:`flex`,flexDirection:`column`,padding:10,gap:8},children:[(0,u.jsx)(`span`,{style:{fontSize:18,lineHeight:1,color:`var(--agd-stroke)`,fontFamily:`serif`},children:`“`}),(0,u.jsxs)(`div`,{style:{flex:1,display:`flex`,flexDirection:`column`,gap:4},children:[(0,u.jsx)(N,{w:`90%`,h:2}),(0,u.jsx)(N,{w:`75%`,h:2}),(0,u.jsx)(N,{w:`60%`,h:2})]}),(0,u.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:6},children:[(0,u.jsx)(F,{size:20}),(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:2},children:[(0,u.jsx)(N,{w:60,h:3,strong:!0}),(0,u.jsx)(N,{w:40,h:2})]})]})]})}function tt({width:e,height:t}){return(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`,height:`100%`,gap:t*.08},children:[(0,u.jsx)(N,{w:e*.5,h:Math.max(4,t*.05),strong:!0}),(0,u.jsx)(N,{w:e*.35}),(0,u.jsx)(P,{w:Math.min(140,e*.25),h:Math.min(32,t*.15),radius:6,style:{marginTop:t*.04,background:`var(--agd-bar)`}})]})}function nt({width:e,height:t}){return(0,u.jsxs)(`div`,{style:{height:`100%`,borderRadius:6,border:`1px dashed var(--agd-stroke)`,background:`var(--agd-fill)`,display:`flex`,alignItems:`center`,padding:`0 10px`,gap:8},children:[(0,u.jsx)(`div`,{style:{width:16,height:16,borderRadius:`50%`,border:`1.5px solid var(--agd-bar-strong)`,display:`flex`,alignItems:`center`,justifyContent:`center`,flexShrink:0},children:(0,u.jsx)(`div`,{style:{width:2,height:6,background:`var(--agd-bar-strong)`,borderRadius:1}})}),(0,u.jsxs)(`div`,{style:{flex:1,display:`flex`,flexDirection:`column`,gap:3},children:[(0,u.jsx)(N,{w:`40%`,h:3,strong:!0}),(0,u.jsx)(N,{w:`70%`,h:2})]})]})}function rt({width:e,height:t}){return(0,u.jsxs)(`div`,{style:{height:`100%`,background:`var(--agd-fill)`,display:`flex`,alignItems:`center`,justifyContent:`center`,gap:8,padding:`0 12px`},children:[(0,u.jsx)(N,{w:e*.4,h:3,strong:!0}),(0,u.jsx)(P,{w:60,h:Math.min(24,t*.6),radius:4})]})}function R({width:e,height:t}){return(0,u.jsxs)(`div`,{style:{height:`100%`,display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`,gap:t*.06},children:[(0,u.jsx)(N,{w:e*.5,h:2}),(0,u.jsx)(N,{w:e*.4,h:Math.max(8,t*.18),strong:!0}),(0,u.jsx)(N,{w:e*.3,h:2})]})}function it({width:e,height:t}){let n=Math.max(3,Math.min(5,Math.floor(e/100))),r=Math.min(12,t*.35);return(0,u.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,height:`100%`,padding:`0 8px`},children:Array.from({length:n},(e,t)=>(0,u.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:0,flex:1},children:[(0,u.jsx)(`div`,{style:{width:r,height:r,borderRadius:`50%`,border:`1.5px solid var(--agd-stroke)`,background:t===0?`var(--agd-bar)`:`transparent`,flexShrink:0}}),t<n-1&&(0,u.jsx)(`div`,{style:{flex:1,height:1,background:`var(--agd-stroke)`,margin:`0 4px`}})]},t))})}function at({width:e,height:t}){return(0,u.jsxs)(`div`,{style:{height:`100%`,borderRadius:4,border:`1px solid var(--agd-stroke)`,background:`var(--agd-fill)`,display:`flex`,alignItems:`center`,justifyContent:`center`,gap:4,padding:`0 6px`},children:[(0,u.jsx)(N,{w:Math.max(16,e*.5),h:2,strong:!0}),(0,u.jsx)(`div`,{style:{width:8,height:8,borderRadius:`50%`,border:`1px solid var(--agd-stroke)`,flexShrink:0}})]})}function ot({width:e,height:t}){let n=Math.min(t*.7,e/7.5);return(0,u.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`center`,height:`100%`,gap:n*.2},children:Array.from({length:5},(e,t)=>(0,u.jsx)(`svg`,{width:n,height:n,viewBox:`0 0 16 16`,fill:`none`,children:(0,u.jsx)(`path`,{d:`M8 1.5l2 4 4.5.7-3.25 3.1.75 4.5L8 11.4l-4 2.4.75-4.5L1.5 6.2 6 5.5z`,stroke:`var(--agd-stroke)`,strokeWidth:`0.8`,fill:t<3?`var(--agd-bar)`:`none`})},t))})}function z({width:e,height:t}){return(0,u.jsxs)(`div`,{style:{height:`100%`,position:`relative`,borderRadius:4,border:`1px dashed var(--agd-stroke)`,background:`var(--agd-fill)`,overflow:`hidden`},children:[(0,u.jsxs)(`svg`,{width:`100%`,height:`100%`,viewBox:`0 0 ${e} ${t}`,fill:`none`,style:{position:`absolute`,inset:0},children:[(0,u.jsx)(`line`,{x1:0,y1:t*.3,x2:e,y2:t*.7,stroke:`var(--agd-stroke)`,strokeWidth:`0.5`,opacity:`.2`}),(0,u.jsx)(`line`,{x1:0,y1:t*.6,x2:e,y2:t*.2,stroke:`var(--agd-stroke)`,strokeWidth:`0.5`,opacity:`.15`}),(0,u.jsx)(`line`,{x1:e*.4,y1:0,x2:e*.6,y2:t,stroke:`var(--agd-stroke)`,strokeWidth:`0.5`,opacity:`.15`})]}),(0,u.jsx)(`div`,{style:{position:`absolute`,left:`50%`,top:`40%`,transform:`translate(-50%, -100%)`},children:(0,u.jsxs)(`svg`,{width:`16`,height:`22`,viewBox:`0 0 16 22`,fill:`none`,children:[(0,u.jsx)(`path`,{d:`M8 0C3.6 0 0 3.6 0 8c0 6 8 14 8 14s8-8 8-14c0-4.4-3.6-8-8-8z`,fill:`var(--agd-bar)`,opacity:`.4`}),(0,u.jsx)(`circle`,{cx:`8`,cy:`8`,r:`3`,fill:`var(--agd-fill)`})]})})]})}function st({width:e,height:t}){let n=Math.max(3,Math.min(5,Math.floor(t/60)));return(0,u.jsxs)(`div`,{style:{display:`flex`,height:`100%`,padding:`8px 0`},children:[(0,u.jsx)(`div`,{style:{width:16,display:`flex`,flexDirection:`column`,alignItems:`center`},children:Array.from({length:n},(e,t)=>(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,flex:1},children:[(0,u.jsx)(F,{size:8}),t<n-1&&(0,u.jsx)(`div`,{style:{flex:1,width:1,background:`var(--agd-stroke)`}})]},t))}),(0,u.jsx)(`div`,{style:{flex:1,display:`flex`,flexDirection:`column`,justifyContent:`space-around`,paddingLeft:8},children:Array.from({length:n},(e,t)=>(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:3},children:[(0,u.jsx)(N,{w:`${35+t*13%25}%`,h:3,strong:!0}),(0,u.jsx)(N,{w:`${50+t*17%30}%`,h:2})]},t))})]})}function ct({width:e,height:t}){return(0,u.jsxs)(`div`,{style:{height:`100%`,borderRadius:8,border:`2px dashed var(--agd-stroke)`,display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`,gap:t*.06},children:[(0,u.jsxs)(`svg`,{width:`24`,height:`24`,viewBox:`0 0 24 24`,fill:`none`,children:[(0,u.jsx)(`path`,{d:`M12 16V4m0 0l-4 4m4-4l4 4`,stroke:`var(--agd-stroke)`,strokeWidth:`1.5`}),(0,u.jsx)(`path`,{d:`M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2`,stroke:`var(--agd-stroke)`,strokeWidth:`1.5`})]}),(0,u.jsx)(N,{w:e*.4,h:2}),(0,u.jsx)(N,{w:e*.25,h:2})]})}function lt({width:e,height:t}){let n=Math.max(3,Math.min(8,Math.floor(t/20)));return(0,u.jsxs)(`div`,{style:{height:`100%`,borderRadius:6,background:`var(--agd-fill)`,border:`1px solid var(--agd-stroke)`,padding:8,display:`flex`,flexDirection:`column`,gap:4},children:[(0,u.jsxs)(`div`,{style:{display:`flex`,gap:3,marginBottom:4},children:[(0,u.jsx)(F,{size:6}),(0,u.jsx)(F,{size:6}),(0,u.jsx)(F,{size:6})]}),Array.from({length:n},(e,t)=>(0,u.jsx)(`div`,{style:{display:`flex`,gap:6,paddingLeft:t>0&&t<n-1?12:0},children:(0,u.jsx)(N,{w:`${25+t*23%50}%`,h:2,strong:t===0})},t))]})}function ut({width:e,height:t}){let n=Math.min((e-16)/7,(t-40)/6);return(0,u.jsxs)(`div`,{style:{height:`100%`,display:`flex`,flexDirection:`column`},children:[(0,u.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,padding:`6px 8px`},children:[(0,u.jsx)(`span`,{style:{fontSize:8,color:`var(--agd-stroke)`},children:`‹`}),(0,u.jsx)(N,{w:e*.3,h:3,strong:!0}),(0,u.jsx)(`span`,{style:{fontSize:8,color:`var(--agd-stroke)`},children:`›`})]}),(0,u.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(7, 1fr)`,gap:2,padding:`0 4px`,flex:1},children:[Array.from({length:7},(e,t)=>(0,u.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`center`,height:n*.6},children:(0,u.jsx)(N,{w:n*.5,h:2})},`h${t}`)),Array.from({length:35},(e,t)=>(0,u.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`center`,height:n},children:(0,u.jsx)(`div`,{style:{width:n*.6,height:n*.6,borderRadius:`50%`,background:t===12?`var(--agd-bar)`:`transparent`,display:`flex`,alignItems:`center`,justifyContent:`center`},children:(0,u.jsx)(`div`,{style:{width:2,height:2,borderRadius:1,background:`var(--agd-bar-strong)`,opacity:t===12?1:.3}})})},t))]})]})}function B({width:e,height:t}){return(0,u.jsxs)(`div`,{style:{height:`100%`,borderRadius:8,border:`1px dashed var(--agd-stroke)`,background:`var(--agd-fill)`,display:`flex`,alignItems:`center`,padding:`0 10px`,gap:8},children:[(0,u.jsx)(F,{size:Math.min(32,t*.55)}),(0,u.jsxs)(`div`,{style:{flex:1,display:`flex`,flexDirection:`column`,gap:3},children:[(0,u.jsx)(N,{w:`50%`,h:3,strong:!0}),(0,u.jsx)(N,{w:`75%`,h:2})]}),(0,u.jsx)(N,{w:30,h:2})]})}function dt({width:e,height:t}){return(0,u.jsxs)(`div`,{style:{height:`100%`,display:`flex`,flexDirection:`column`},children:[(0,u.jsx)(`div`,{style:{height:`50%`,background:`var(--agd-fill)`,borderBottom:`1px dashed var(--agd-stroke)`}}),(0,u.jsxs)(`div`,{style:{flex:1,padding:10,display:`flex`,flexDirection:`column`,gap:5},children:[(0,u.jsx)(N,{w:`65%`,h:4,strong:!0}),(0,u.jsx)(N,{w:`40%`,h:3}),(0,u.jsx)(`div`,{style:{flex:1}}),(0,u.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`},children:[(0,u.jsx)(N,{w:`30%`,h:5,strong:!0}),(0,u.jsx)(P,{w:Math.min(70,e*.3),h:26,radius:4,style:{background:`var(--agd-bar)`}})]})]})]})}function ft({width:e,height:t}){let n=Math.min(48,t*.3);return(0,u.jsxs)(`div`,{style:{height:`100%`,display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`,gap:t*.06},children:[(0,u.jsx)(F,{size:n}),(0,u.jsx)(N,{w:e*.45,h:4,strong:!0}),(0,u.jsx)(N,{w:e*.3,h:2}),(0,u.jsxs)(`div`,{style:{display:`flex`,gap:e*.08,marginTop:t*.04},children:[(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:2},children:[(0,u.jsx)(N,{w:20,h:3,strong:!0}),(0,u.jsx)(N,{w:28,h:2})]}),(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:2},children:[(0,u.jsx)(N,{w:20,h:3,strong:!0}),(0,u.jsx)(N,{w:28,h:2})]}),(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:2},children:[(0,u.jsx)(N,{w:20,h:3,strong:!0}),(0,u.jsx)(N,{w:28,h:2})]})]})]})}function pt({width:e,height:t}){let n=Math.max(e*.6,80),r=Math.max(3,Math.floor(t/40));return(0,u.jsxs)(`div`,{style:{height:`100%`,display:`flex`},children:[(0,u.jsx)(`div`,{style:{width:e-n,background:`var(--agd-fill)`,opacity:.3}}),(0,u.jsxs)(`div`,{style:{flex:1,borderLeft:`1px solid var(--agd-stroke)`,display:`flex`,flexDirection:`column`,padding:e*.04},children:[(0,u.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:t*.06},children:[(0,u.jsx)(N,{w:n*.4,h:4,strong:!0}),(0,u.jsx)(`div`,{style:{width:12,height:12,border:`1px solid var(--agd-stroke)`,borderRadius:3}})]}),Array.from({length:r},(e,t)=>(0,u.jsx)(`div`,{style:{padding:`6px 0`},children:(0,u.jsx)(N,{w:`${50+t*17%35}%`,h:2,strong:t===0})},t))]})]})}function mt({width:e,height:t}){return(0,u.jsxs)(`div`,{style:{height:`100%`,display:`flex`,flexDirection:`column`,alignItems:`center`},children:[(0,u.jsxs)(`div`,{style:{flex:1,width:`100%`,borderRadius:8,border:`1px dashed var(--agd-stroke)`,background:`var(--agd-fill)`,padding:10,display:`flex`,flexDirection:`column`,gap:5},children:[(0,u.jsx)(N,{w:`70%`,h:3,strong:!0}),(0,u.jsx)(N,{w:`90%`,h:2}),(0,u.jsx)(N,{w:`60%`,h:2})]}),(0,u.jsx)(`div`,{style:{width:10,height:10,background:`var(--agd-fill)`,border:`1px dashed var(--agd-stroke)`,borderTop:`none`,borderLeft:`none`,transform:`rotate(45deg)`,marginTop:-6}})]})}function ht({width:e,height:t}){let n=Math.min(t*.7,e*.3);return(0,u.jsxs)(`div`,{style:{height:`100%`,display:`flex`,alignItems:`center`,gap:e*.08},children:[(0,u.jsx)(P,{w:n,h:n,radius:n*.25}),(0,u.jsx)(N,{w:e*.45,h:Math.max(4,t*.2),strong:!0})]})}function gt({width:e,height:t}){let n=Math.max(2,Math.min(5,Math.floor(t/56)));return(0,u.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100%`},children:Array.from({length:n},(t,n)=>(0,u.jsxs)(`div`,{style:{borderBottom:`1px solid var(--agd-stroke)`,padding:`8px 6px`,display:`flex`,alignItems:`center`,justifyContent:`space-between`,flex:n===0?2:1},children:[(0,u.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:6},children:[(0,u.jsx)(`span`,{style:{fontSize:9,fontWeight:700,color:`var(--agd-stroke)`},children:`Q`}),(0,u.jsx)(N,{w:e*(.3+n*13%25/100),h:3,strong:!0})]}),(0,u.jsx)(`span`,{style:{fontSize:8,color:`var(--agd-stroke)`},children:n===0?`▼`:`▶`})]},n))})}function _t({width:e,height:t}){let n=Math.max(2,Math.min(4,Math.floor(e/120))),r=Math.max(1,Math.min(3,Math.floor(t/120)));return(0,u.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(${n}, 1fr)`,gridTemplateRows:`repeat(${r}, 1fr)`,gap:4,height:`100%`},children:Array.from({length:n*r},(e,t)=>(0,u.jsx)(`div`,{style:{borderRadius:4,border:`1px dashed var(--agd-stroke)`,background:`var(--agd-fill)`,position:`relative`,overflow:`hidden`},children:(0,u.jsxs)(`svg`,{width:`100%`,height:`100%`,viewBox:`0 0 100 100`,preserveAspectRatio:`none`,fill:`none`,children:[(0,u.jsx)(`line`,{x1:`0`,y1:`0`,x2:`100`,y2:`100`,stroke:`var(--agd-stroke)`,strokeWidth:`0.5`}),(0,u.jsx)(`line`,{x1:`100`,y1:`0`,x2:`0`,y2:`100`,stroke:`var(--agd-stroke)`,strokeWidth:`0.5`})]})},t))})}function vt({width:e,height:t}){let n=Math.min(e,t);return(0,u.jsxs)(`svg`,{width:`100%`,height:`100%`,viewBox:`0 0 ${e} ${t}`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`1`,y:(t-n+2)/2,width:n-2,height:n-2,rx:n*.15,stroke:`var(--agd-stroke)`,strokeWidth:`1.5`}),(0,u.jsx)(`path`,{d:`M${n*.25} ${t/2}l${n*.2} ${n*.2} ${n*.3}-${n*.35}`,stroke:`var(--agd-bar)`,strokeWidth:`1.5`,fill:`none`,strokeLinecap:`round`,strokeLinejoin:`round`})]})}function yt({width:e,height:t}){let n=Math.min(e,t)/2-1;return(0,u.jsxs)(`svg`,{width:`100%`,height:`100%`,viewBox:`0 0 ${e} ${t}`,fill:`none`,children:[(0,u.jsx)(`circle`,{cx:e/2,cy:t/2,r:n,stroke:`var(--agd-stroke)`,strokeWidth:`1.5`}),(0,u.jsx)(`circle`,{cx:e/2,cy:t/2,r:n*.45,fill:`var(--agd-bar)`})]})}function bt({width:e,height:t}){let n=Math.max(2,t*.12),r=Math.min(t*.35,10),i=e*.55;return(0,u.jsxs)(`div`,{style:{height:`100%`,display:`flex`,alignItems:`center`,position:`relative`},children:[(0,u.jsx)(`div`,{style:{width:`100%`,height:n,borderRadius:n/2,background:`var(--agd-fill)`,border:`1px solid var(--agd-stroke)`,position:`relative`},children:(0,u.jsx)(`div`,{style:{width:i,height:`100%`,borderRadius:n/2,background:`var(--agd-bar)`}})}),(0,u.jsx)(`div`,{style:{position:`absolute`,left:i-r,width:r*2,height:r*2,borderRadius:`50%`,border:`1.5px solid var(--agd-stroke)`,background:`var(--agd-fill)`}})]})}function xt({width:e,height:t}){let n=Math.min(36,t*.15),r=Math.min((e-16)/7,(t-n-40)/5);return(0,u.jsxs)(`div`,{style:{height:`100%`,display:`flex`,flexDirection:`column`,gap:4},children:[(0,u.jsxs)(`div`,{style:{height:n,borderRadius:4,border:`1px dashed var(--agd-stroke)`,background:`var(--agd-fill)`,display:`flex`,alignItems:`center`,padding:`0 8px`,justifyContent:`space-between`},children:[(0,u.jsx)(N,{w:`40%`,h:2}),(0,u.jsxs)(`svg`,{width:`12`,height:`12`,viewBox:`0 0 16 16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`3`,width:`12`,height:`11`,rx:`1`,stroke:`var(--agd-stroke)`,strokeWidth:`1`}),(0,u.jsx)(`line`,{x1:`2`,y1:`6`,x2:`14`,y2:`6`,stroke:`var(--agd-stroke)`,strokeWidth:`0.5`})]})]}),(0,u.jsxs)(`div`,{style:{flex:1,borderRadius:6,border:`1px dashed var(--agd-stroke)`,background:`var(--agd-fill)`,display:`flex`,flexDirection:`column`},children:[(0,u.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,padding:`4px 6px`},children:[(0,u.jsx)(`span`,{style:{fontSize:7,color:`var(--agd-stroke)`},children:`‹`}),(0,u.jsx)(N,{w:e*.25,h:2,strong:!0}),(0,u.jsx)(`span`,{style:{fontSize:7,color:`var(--agd-stroke)`},children:`›`})]}),(0,u.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(7, 1fr)`,gap:1,padding:`0 4px`,flex:1},children:Array.from({length:28},(e,t)=>(0,u.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`center`,height:r},children:(0,u.jsx)(`div`,{style:{width:r*.5,height:r*.5,borderRadius:`50%`,background:t===10?`var(--agd-bar)`:`transparent`},children:(0,u.jsx)(`div`,{style:{width:`100%`,height:`100%`,display:`flex`,alignItems:`center`,justifyContent:`center`},children:(0,u.jsx)(`div`,{style:{width:1.5,height:1.5,borderRadius:1,background:`var(--agd-bar-strong)`,opacity:t===10?1:.25}})})})},t))})]})]})}function V({width:e,height:t}){return(0,u.jsxs)(`div`,{style:{height:`100%`,display:`flex`,flexDirection:`column`,gap:t*.08,padding:4},children:[(0,u.jsx)(`div`,{style:{width:`100%`,height:t*.2,borderRadius:4,background:`var(--agd-fill)`}}),(0,u.jsx)(`div`,{style:{width:`70%`,height:Math.max(6,t*.1),borderRadius:3,background:`var(--agd-fill)`}}),(0,u.jsx)(`div`,{style:{width:`90%`,height:Math.max(4,t*.06),borderRadius:3,background:`var(--agd-fill)`}}),(0,u.jsx)(`div`,{style:{width:`50%`,height:Math.max(4,t*.06),borderRadius:3,background:`var(--agd-fill)`}})]})}function St({width:e,height:t}){return(0,u.jsx)(`div`,{style:{height:`100%`,display:`flex`,alignItems:`center`,gap:6},children:(0,u.jsxs)(`div`,{style:{height:`100%`,flex:1,borderRadius:t/2,border:`1px solid var(--agd-stroke)`,background:`var(--agd-fill)`,display:`flex`,alignItems:`center`,padding:`0 ${t*.3}px`,gap:4},children:[(0,u.jsx)(N,{w:`60%`,h:2,strong:!0}),(0,u.jsx)(`div`,{style:{width:Math.max(6,t*.3),height:Math.max(6,t*.3),borderRadius:`50%`,border:`1px solid var(--agd-stroke)`,flexShrink:0,marginLeft:`auto`}})]})})}function Ct({width:e,height:t}){let n=Math.min(e,t);return(0,u.jsx)(`svg`,{width:`100%`,height:`100%`,viewBox:`0 0 ${e} ${t}`,fill:`none`,children:(0,u.jsx)(`path`,{d:`M${e/2} ${(t-n)/2+n*.1}l${n*.12} ${n*.25} ${n*.28} ${n*.04}-${n*.2} ${n*.2} ${n*.05} ${n*.28}-${n*.25}-${n*.12}-${n*.25} ${n*.12} ${n*.05}-${n*.28}-${n*.2}-${n*.2} ${n*.28}-${n*.04}z`,stroke:`var(--agd-stroke)`,strokeWidth:`1`,fill:`var(--agd-fill)`})})}function wt({width:e,height:t}){let n=Math.min(e,t)/2-2;return(0,u.jsxs)(`svg`,{width:`100%`,height:`100%`,viewBox:`0 0 ${e} ${t}`,fill:`none`,children:[(0,u.jsx)(`circle`,{cx:e/2,cy:t/2,r:n,stroke:`var(--agd-stroke)`,strokeWidth:`1.5`,opacity:`.2`}),(0,u.jsx)(`path`,{d:`M${e/2} ${t/2-n}a${n} ${n} 0 0 1 ${n} ${n}`,stroke:`var(--agd-bar-strong)`,strokeWidth:`1.5`,strokeLinecap:`round`})]})}function Tt({width:e,height:t}){let n=Math.min(36,t*.25,e*.12),r=Math.max(1,Math.min(3,Math.floor(t/80)));return(0,u.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100%`,justifyContent:`space-around`,padding:8},children:Array.from({length:r},(t,r)=>(0,u.jsxs)(`div`,{style:{display:`flex`,gap:e*.04,alignItems:`flex-start`},children:[(0,u.jsx)(P,{w:n,h:n,radius:n*.25}),(0,u.jsxs)(`div`,{style:{flex:1,display:`flex`,flexDirection:`column`,gap:4},children:[(0,u.jsx)(N,{w:`${40+r*13%20}%`,h:3,strong:!0}),(0,u.jsx)(N,{w:`${60+r*17%25}%`,h:2})]})]},r))})}function Et({width:e,height:t}){let n=Math.max(2,Math.min(4,Math.floor(e/120))),r=Math.min(36,t*.25);return(0,u.jsxs)(`div`,{style:{height:`100%`,display:`flex`,flexDirection:`column`,alignItems:`center`,gap:t*.06,padding:t*.06},children:[(0,u.jsx)(N,{w:e*.3,h:4,strong:!0}),(0,u.jsx)(`div`,{style:{display:`flex`,gap:e*.06,justifyContent:`center`,flex:1,alignItems:`center`},children:Array.from({length:n},(t,n)=>(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:6},children:[(0,u.jsx)(F,{size:r}),(0,u.jsx)(N,{w:e*.12,h:3,strong:!0}),(0,u.jsx)(N,{w:e*.08,h:2})]},n))})]})}function Dt({width:e,height:t}){let n=Math.max(2,Math.min(3,Math.floor(t/80)));return(0,u.jsxs)(`div`,{style:{height:`100%`,display:`flex`,flexDirection:`column`,alignItems:`center`,padding:e*.06,gap:t*.04},children:[(0,u.jsx)(N,{w:e*.5,h:Math.max(5,t*.04),strong:!0}),(0,u.jsx)(N,{w:e*.35,h:2}),(0,u.jsx)(`div`,{style:{width:`100%`,display:`flex`,flexDirection:`column`,gap:t*.03,marginTop:t*.04},children:Array.from({length:n},(n,r)=>(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:3},children:[(0,u.jsx)(N,{w:Math.min(60,e*.2),h:2}),(0,u.jsx)(P,{w:`100%`,h:Math.min(32,t*.1),radius:4})]},r))}),(0,u.jsx)(P,{w:`100%`,h:Math.min(36,t*.12),radius:6,style:{marginTop:t*.03,background:`var(--agd-bar)`}}),(0,u.jsx)(N,{w:e*.4,h:2})]})}function Ot({width:e,height:t}){return(0,u.jsxs)(`div`,{style:{height:`100%`,display:`flex`,flexDirection:`column`,padding:e*.04,gap:t*.03},children:[(0,u.jsx)(N,{w:e*.4,h:4,strong:!0}),(0,u.jsx)(N,{w:e*.6,h:2}),(0,u.jsxs)(`div`,{style:{display:`flex`,gap:6,marginTop:t*.03},children:[(0,u.jsxs)(`div`,{style:{flex:1,display:`flex`,flexDirection:`column`,gap:3},children:[(0,u.jsx)(N,{w:50,h:2}),(0,u.jsx)(P,{w:`100%`,h:Math.min(28,t*.1),radius:4})]}),(0,u.jsxs)(`div`,{style:{flex:1,display:`flex`,flexDirection:`column`,gap:3},children:[(0,u.jsx)(N,{w:40,h:2}),(0,u.jsx)(P,{w:`100%`,h:Math.min(28,t*.1),radius:4})]})]}),(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:3},children:[(0,u.jsx)(N,{w:50,h:2}),(0,u.jsx)(P,{w:`100%`,h:Math.min(28,t*.1),radius:4})]}),(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:3,flex:1},children:[(0,u.jsx)(N,{w:60,h:2}),(0,u.jsx)(P,{w:`100%`,h:`100%`,radius:4})]}),(0,u.jsx)(P,{w:Math.min(120,e*.3),h:Math.min(30,t*.1),radius:6,style:{alignSelf:`flex-end`,background:`var(--agd-bar)`}})]})}var kt={navigation:Ce,hero:we,sidebar:Te,footer:Ee,modal:De,card:Oe,text:ke,image:Ae,table:je,list:Me,button:Ne,input:Pe,form:Fe,tabs:Ie,avatar:Le,badge:I,header:Re,section:ze,grid:Be,dropdown:Ve,toggle:He,search:Ue,toast:We,progress:Ge,chart:Ke,video:L,tooltip:qe,breadcrumb:Je,pagination:Ye,divider:Xe,accordion:Ze,carousel:Qe,pricing:$e,testimonial:et,cta:tt,alert:nt,banner:rt,stat:R,stepper:it,tag:at,rating:ot,map:z,timeline:st,fileUpload:ct,codeBlock:lt,calendar:ut,notification:B,productCard:dt,profile:ft,drawer:pt,popover:mt,logo:ht,faq:gt,gallery:_t,checkbox:vt,radio:yt,slider:bt,datePicker:xt,skeleton:V,chip:St,icon:Ct,spinner:wt,feature:Tt,team:Et,login:Dt,contact:Ot};function At({type:e,width:t,height:n,text:r}){let i=kt[e];return i?(0,u.jsx)(`div`,{style:{width:`100%`,height:`100%`,padding:8,position:`relative`,pointerEvents:`none`},children:(0,u.jsx)(i,{width:t,height:n,text:r})}):(0,u.jsx)(`div`,{style:{width:`100%`,height:`100%`,display:`flex`,alignItems:`center`,justifyContent:`center`},children:(0,u.jsx)(`span`,{style:{fontSize:10,fontWeight:600,color:`var(--agd-text-3)`,textTransform:`uppercase`,letterSpacing:`0.06em`,opacity:.5},children:e})})}var jt=`svg[fill=none] {
  fill: none !important;
}

.styles-module__overlayExiting___iEmYr {
  opacity: 0 !important;
  transition: opacity 0.25s ease !important;
  pointer-events: none !important;
}

.styles-module__overlay___aWh-q {
  position: fixed;
  inset: 0;
  z-index: 99995;
  pointer-events: auto;
  cursor: default;
  animation: styles-module__overlayFadeIn___aECVy 0.15s ease;
  --agd-stroke: rgba(59, 130, 246, 0.35);
  --agd-fill: rgba(59, 130, 246, 0.06);
  --agd-bar: rgba(59, 130, 246, 0.18);
  --agd-bar-strong: rgba(59, 130, 246, 0.28);
  --agd-text-3: rgba(255, 255, 255, 0.6);
  --agd-surface: #fff;
}
.styles-module__overlay___aWh-q.styles-module__light___ORIft {
  --agd-surface: #fff;
}
.styles-module__overlay___aWh-q:not(.styles-module__light___ORIft) {
  --agd-surface: #141414;
}
.styles-module__overlay___aWh-q.styles-module__wireframe___itvQU {
  --agd-stroke: rgba(249, 115, 22, 0.35);
  --agd-fill: rgba(249, 115, 22, 0.06);
  --agd-bar: rgba(249, 115, 22, 0.18);
  --agd-bar-strong: rgba(249, 115, 22, 0.28);
}
.styles-module__overlay___aWh-q.styles-module__placing___45yD8 {
  cursor: crosshair;
}
.styles-module__overlay___aWh-q.styles-module__passthrough___xaFeE {
  pointer-events: none;
}

.styles-module__blankCanvas___t2Eue {
  position: fixed;
  inset: 0;
  z-index: 99994;
  background: #fff;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}
.styles-module__blankCanvas___t2Eue.styles-module__visible___OKKqX {
  opacity: var(--canvas-opacity, 1);
  pointer-events: auto;
}
.styles-module__blankCanvas___t2Eue::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.08) 1px, transparent 1px);
  background-size: 24px 24px;
  background-position: 12px 12px;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.styles-module__blankCanvas___t2Eue.styles-module__gridActive___OZ-cf::after {
  opacity: 1;
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.22) 1px, transparent 1px);
}

.styles-module__paletteHeader___-Q5gQ {
  padding: 0 1rem 0.375rem;
}

.styles-module__paletteHeaderTitle___oHqZC {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #fff;
  letter-spacing: -0.0094em;
}
.styles-module__light___ORIft .styles-module__paletteHeaderTitle___oHqZC {
  color: rgba(0, 0, 0, 0.85);
}

.styles-module__paletteHeaderDesc___6i74T {
  font-size: 0.6875rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 2px;
  line-height: 14px;
}
.styles-module__light___ORIft .styles-module__paletteHeaderDesc___6i74T {
  color: rgba(0, 0, 0, 0.45);
}
.styles-module__paletteHeaderDesc___6i74T a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: underline dotted;
  text-decoration-color: rgba(255, 255, 255, 0.2);
  text-underline-offset: 2px;
  transition: color 0.15s ease;
}
.styles-module__paletteHeaderDesc___6i74T a:hover {
  color: #fff;
}
.styles-module__light___ORIft .styles-module__paletteHeaderDesc___6i74T a {
  color: rgba(0, 0, 0, 0.6);
  text-decoration-color: rgba(0, 0, 0, 0.2);
}
.styles-module__light___ORIft .styles-module__paletteHeaderDesc___6i74T a:hover {
  color: rgba(0, 0, 0, 0.85);
}

.styles-module__wireframePurposeWrap___To-tS {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.2s ease, opacity 0.15s ease;
  opacity: 1;
}
.styles-module__wireframePurposeWrap___To-tS.styles-module__collapsed___Ms9vS {
  grid-template-rows: 0fr;
  opacity: 0;
}

.styles-module__wireframePurposeInner___Lrahs {
  overflow: hidden;
}

.styles-module__wireframePurposeInput___7EtBN {
  display: block;
  width: calc(100% - 2rem);
  margin: 0.25rem 1rem 0.375rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.8125rem;
  font-family: inherit;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  resize: none;
  outline: none;
  transition: border-color 0.15s ease;
  letter-spacing: -0.0094em;
}
.styles-module__wireframePurposeInput___7EtBN::placeholder {
  color: rgba(255, 255, 255, 0.3);
}
.styles-module__wireframePurposeInput___7EtBN:focus {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.05);
}
.styles-module__light___ORIft .styles-module__wireframePurposeInput___7EtBN {
  color: rgba(0, 0, 0, 0.7);
  background: rgba(0, 0, 0, 0.03);
  border-color: rgba(0, 0, 0, 0.1);
}
.styles-module__light___ORIft .styles-module__wireframePurposeInput___7EtBN::placeholder {
  color: rgba(0, 0, 0, 0.3);
}
.styles-module__light___ORIft .styles-module__wireframePurposeInput___7EtBN:focus {
  border-color: rgba(0, 0, 0, 0.25);
  background: rgba(0, 0, 0, 0.05);
}

.styles-module__canvasToggle___-QqSy {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  margin: 0.25rem 1rem 0.25rem;
  padding: 0.375rem 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  background: transparent;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.styles-module__canvasToggle___-QqSy:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.15);
}
.styles-module__canvasToggle___-QqSy.styles-module__active___hosp7 {
  background: #f97316;
  border-color: transparent;
  border-style: solid;
  box-shadow: none;
}
.styles-module__light___ORIft .styles-module__canvasToggle___-QqSy {
  border-color: rgba(0, 0, 0, 0.08);
}
.styles-module__light___ORIft .styles-module__canvasToggle___-QqSy:hover {
  background: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.12);
}
.styles-module__light___ORIft .styles-module__canvasToggle___-QqSy.styles-module__active___hosp7 {
  background: #f97316;
  border-color: transparent;
  border-style: solid;
  box-shadow: none;
}

.styles-module__canvasToggleIcon___7pJ82 {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.35);
}
.styles-module__active___hosp7 .styles-module__canvasToggleIcon___7pJ82 {
  color: rgba(255, 255, 255, 0.85);
}
.styles-module__light___ORIft .styles-module__canvasToggleIcon___7pJ82 {
  color: rgba(0, 0, 0, 0.25);
}
.styles-module__light___ORIft .styles-module__active___hosp7 .styles-module__canvasToggleIcon___7pJ82 {
  color: rgba(255, 255, 255, 0.85);
}

.styles-module__canvasToggleLabel___OanpY {
  font-size: 0.8125rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: -0.0094em;
}
.styles-module__active___hosp7 .styles-module__canvasToggleLabel___OanpY {
  color: #fff;
}
.styles-module__light___ORIft .styles-module__canvasToggleLabel___OanpY {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__light___ORIft .styles-module__active___hosp7 .styles-module__canvasToggleLabel___OanpY {
  color: #fff;
}

.styles-module__canvasPurposeWrap___hj6zk {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.2s ease, opacity 0.15s ease;
  opacity: 1;
}
.styles-module__canvasPurposeWrap___hj6zk.styles-module__collapsed___Ms9vS {
  grid-template-rows: 0fr;
  opacity: 0;
}

.styles-module__canvasPurposeInner___VWiyu {
  overflow: hidden;
}

.styles-module__canvasPurposeToggle___byDH2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin: 0.375rem 1rem 0.375rem 1.1875rem;
}
.styles-module__canvasPurposeToggle___byDH2 input[type=checkbox] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.styles-module__canvasPurposeCheck___xqd7l {
  position: relative;
  width: 14px;
  height: 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.25s ease, border-color 0.25s ease;
}
.styles-module__canvasPurposeCheck___xqd7l svg {
  color: #1a1a1a;
  opacity: 1;
  transition: opacity 0.15s ease;
}
.styles-module__canvasPurposeCheck___xqd7l.styles-module__checked___-1JGH {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgb(255, 255, 255);
}
.styles-module__light___ORIft .styles-module__canvasPurposeCheck___xqd7l {
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: #fff;
}
.styles-module__light___ORIft .styles-module__canvasPurposeCheck___xqd7l.styles-module__checked___-1JGH {
  border-color: #1a1a1a;
  background: #1a1a1a;
}
.styles-module__light___ORIft .styles-module__canvasPurposeCheck___xqd7l.styles-module__checked___-1JGH svg {
  color: #fff;
}

.styles-module__canvasPurposeLabel___Zu-tD {
  font-size: 0.8125rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: -0.0094em;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.styles-module__light___ORIft .styles-module__canvasPurposeLabel___Zu-tD {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__canvasPurposeHelp___jijwR {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: help;
}
.styles-module__canvasPurposeHelp___jijwR svg {
  color: rgba(255, 255, 255, 0.2);
  transform: translateY(2px);
  transition: color 0.15s ease;
}
.styles-module__canvasPurposeHelp___jijwR:hover svg {
  color: rgba(255, 255, 255, 0.5);
}
.styles-module__light___ORIft .styles-module__canvasPurposeHelp___jijwR svg {
  color: rgba(0, 0, 0, 0.2);
}
.styles-module__light___ORIft .styles-module__canvasPurposeHelp___jijwR:hover svg {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__placement___zcxv8 {
  position: absolute;
  border: 1.5px dashed rgba(59, 130, 246, 0.4);
  border-radius: 6px;
  background: rgba(59, 130, 246, 0.08);
  cursor: grab;
  transition: box-shadow 0.15s, border-color 0.15s, opacity 0.15s ease, transform 0.15s ease;
  user-select: none;
  pointer-events: auto;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  animation: styles-module__placementEnter___TdRhf 0.25s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.styles-module__placement___zcxv8:active {
  cursor: grabbing;
}
.styles-module__placement___zcxv8:hover {
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(59, 130, 246, 0.1);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.12);
}
.styles-module__placement___zcxv8.styles-module__selected___6yrp6 {
  border-color: #3c82f7;
  border-style: solid;
  background: rgba(59, 130, 246, 0.1);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(59, 130, 246, 0.15);
}
.styles-module__placement___zcxv8.styles-module__selected___6yrp6:hover {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(59, 130, 246, 0.15);
}
.styles-module__wireframe___itvQU .styles-module__placement___zcxv8 {
  border-color: rgba(249, 115, 22, 0.4);
  background: rgba(249, 115, 22, 0.08);
}
.styles-module__wireframe___itvQU .styles-module__placement___zcxv8:hover {
  border-color: rgba(249, 115, 22, 0.5);
  background: rgba(249, 115, 22, 0.1);
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.12);
}
.styles-module__wireframe___itvQU .styles-module__placement___zcxv8.styles-module__selected___6yrp6 {
  border-color: #f97316;
  background: rgba(249, 115, 22, 0.1);
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.15), 0 2px 8px rgba(249, 115, 22, 0.15);
}
.styles-module__wireframe___itvQU .styles-module__placement___zcxv8.styles-module__selected___6yrp6:hover {
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.15), 0 2px 8px rgba(249, 115, 22, 0.15);
}
.styles-module__placement___zcxv8.styles-module__dragging___le6KZ {
  opacity: 0.85;
  z-index: 50;
}
.styles-module__placement___zcxv8.styles-module__exiting___YrM8F {
  opacity: 0;
  transform: scale(0.97);
  pointer-events: none;
  animation: none;
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);
}

.styles-module__placementContent___f64A4 {
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.styles-module__placementLabel___0KvWl {
  position: absolute;
  top: -18px;
  left: 0;
  font-size: 10px;
  font-weight: 600;
  color: rgba(59, 130, 246, 0.7);
  white-space: nowrap;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.8), 0 0 8px rgba(255, 255, 255, 0.5);
}
.styles-module__selected___6yrp6 .styles-module__placementLabel___0KvWl {
  color: #3c82f7;
}
.styles-module__wireframe___itvQU .styles-module__placementLabel___0KvWl {
  color: rgba(249, 115, 22, 0.7);
}
.styles-module__wireframe___itvQU .styles-module__selected___6yrp6 .styles-module__placementLabel___0KvWl {
  color: #f97316;
}

.styles-module__placementAnnotation___78pTr {
  position: absolute;
  bottom: -18px;
  left: 0;
  right: 0;
  font-weight: 450;
  color: rgba(0, 0, 0, 0.5);
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.9), 0 0 8px rgba(255, 255, 255, 0.6);
  opacity: 0;
  transform: translateY(-2px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.styles-module__placementAnnotation___78pTr.styles-module__annotationVisible___mrUyA {
  opacity: 1;
  transform: translateY(0);
}

.styles-module__sectionAnnotation___aUIs0 {
  position: absolute;
  bottom: -18px;
  left: 0;
  right: 0;
  font-weight: 450;
  color: rgba(59, 130, 246, 0.6);
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.9), 0 0 8px rgba(255, 255, 255, 0.6);
  opacity: 0;
  transform: translateY(-2px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.styles-module__sectionAnnotation___aUIs0.styles-module__annotationVisible___mrUyA {
  opacity: 1;
  transform: translateY(0);
}

.styles-module__handle___Ikbxm {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #fff;
  border: 1.5px solid #3c82f7;
  border-radius: 2px;
  z-index: 12;
  box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.12);
  opacity: 0;
  transform: scale(0.3);
  pointer-events: none;
  will-change: opacity, transform;
  transition: opacity 0.2s ease-out, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.styles-module__placement___zcxv8:hover .styles-module__handle___Ikbxm, .styles-module__sectionOutline___s0hy-:hover .styles-module__handle___Ikbxm, .styles-module__ghostOutline___po-kO:hover .styles-module__handle___Ikbxm, .styles-module__placement___zcxv8:active .styles-module__handle___Ikbxm, .styles-module__sectionOutline___s0hy-:active .styles-module__handle___Ikbxm, .styles-module__ghostOutline___po-kO:active .styles-module__handle___Ikbxm, .styles-module__selected___6yrp6 .styles-module__handle___Ikbxm {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}
.styles-module__sectionOutline___s0hy- .styles-module__handle___Ikbxm {
  border-color: inherit;
}
.styles-module__wireframe___itvQU .styles-module__handle___Ikbxm {
  border-color: #f97316;
}

.styles-module__handleNw___4TMIj {
  top: -4px;
  left: -4px;
  cursor: nw-resize;
}

.styles-module__handleNe___mnsTh {
  top: -4px;
  right: -4px;
  cursor: ne-resize;
}

.styles-module__handleSe___oSFnk {
  bottom: -4px;
  right: -4px;
  cursor: se-resize;
}

.styles-module__handleSw___pi--Z {
  bottom: -4px;
  left: -4px;
  cursor: sw-resize;
}

.styles-module__handleN___aBA-Q, .styles-module__handleE___0hM5u, .styles-module__handleS___JjDRv, .styles-module__handleW___ERWGQ {
  opacity: 0 !important;
  pointer-events: none !important;
}

.styles-module__edgeHandle___XxXdT {
  position: absolute;
  z-index: 11;
  display: flex;
  align-items: center;
  justify-content: center;
}
.styles-module__edgeHandle___XxXdT::after {
  content: "";
  position: absolute;
  border-radius: 4px;
  background: #3c82f7;
}
.styles-module__wireframe___itvQU .styles-module__edgeHandle___XxXdT::after {
  background: #f97316;
}
.styles-module__edgeHandle___XxXdT::after {
  opacity: 0;
  transition: opacity 0.1s ease, transform 0.1s ease;
  transform: scale(0.8);
}
.styles-module__edgeHandle___XxXdT:hover::after {
  opacity: 0.85;
  transform: scale(1);
}
.styles-module__edgeHandle___XxXdT svg {
  position: relative;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.1s ease;
  filter: drop-shadow(0 0 2px var(--agd-surface));
}
.styles-module__edgeHandle___XxXdT:hover svg {
  opacity: 1;
}

.styles-module__edgeN___-JJDj, .styles-module__edgeS___66lMX {
  left: 12px;
  right: 12px;
  height: 12px;
  cursor: n-resize;
}
.styles-module__edgeN___-JJDj::after, .styles-module__edgeS___66lMX::after {
  width: 24px;
  height: 4px;
}

.styles-module__edgeN___-JJDj {
  top: -6px;
}

.styles-module__edgeS___66lMX {
  bottom: -6px;
  cursor: s-resize;
}

.styles-module__edgeE___1bGDa, .styles-module__edgeW___lHQNo {
  top: 12px;
  bottom: 12px;
  width: 12px;
  cursor: e-resize;
}
.styles-module__edgeE___1bGDa::after, .styles-module__edgeW___lHQNo::after {
  width: 4px;
  height: 24px;
}

.styles-module__edgeE___1bGDa {
  right: -6px;
}

.styles-module__edgeW___lHQNo {
  left: -6px;
  cursor: w-resize;
}

.styles-module__deleteButton___LkGCb {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.35);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  line-height: 1;
  z-index: 15;
  pointer-events: none;
  opacity: 0;
  transform: scale(0.8);
  will-change: opacity, transform;
  transition: opacity 0.2s ease-out, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.12s ease, color 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease;
}
.styles-module__placement___zcxv8:hover .styles-module__deleteButton___LkGCb, .styles-module__selected___6yrp6 .styles-module__deleteButton___LkGCb, .styles-module__sectionOutline___s0hy-:hover .styles-module__deleteButton___LkGCb, .styles-module__sectionOutline___s0hy-.styles-module__selected___6yrp6 .styles-module__deleteButton___LkGCb, .styles-module__ghostOutline___po-kO:hover .styles-module__deleteButton___LkGCb, .styles-module__ghostOutline___po-kO.styles-module__selected___6yrp6 .styles-module__deleteButton___LkGCb {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}
.styles-module__deleteButton___LkGCb:hover {
  background: #ef4444;
  color: #fff;
  border-color: #ef4444;
  box-shadow: 0 1px 4px rgba(239, 68, 68, 0.3);
  transform: scale(1.1);
}
.styles-module__overlay___aWh-q:not(.styles-module__light___ORIft) .styles-module__deleteButton___LkGCb, .styles-module__rearrangeOverlay___-3R3t:not(.styles-module__light___ORIft) .styles-module__deleteButton___LkGCb {
  background: rgba(40, 40, 40, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
}
.styles-module__overlay___aWh-q:not(.styles-module__light___ORIft) .styles-module__deleteButton___LkGCb:hover, .styles-module__rearrangeOverlay___-3R3t:not(.styles-module__light___ORIft) .styles-module__deleteButton___LkGCb:hover {
  background: #ef4444;
  color: #fff;
  border-color: #ef4444;
}

.styles-module__drawBox___BrVAa {
  position: fixed;
  pointer-events: none;
  z-index: 99996;
  border: 2px solid #3c82f7;
  border-radius: 6px;
  background: rgba(59, 130, 246, 0.15);
}

.styles-module__selectBox___Iu8kB {
  position: fixed;
  pointer-events: none;
  z-index: 99996;
  border: 1px dashed #3c82f7;
  background: rgba(59, 130, 246, 0.08);
  border-radius: 2px;
}

.styles-module__sizeIndicator___7zJ4y {
  position: fixed;
  pointer-events: none;
  z-index: 100001;
  font-size: 10px;
  color: #fff;
  background: #3c82f7;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.styles-module__guideLine___DUQY2 {
  pointer-events: none;
  z-index: 100001;
  background: #f0f;
  opacity: 0.5;
}

.styles-module__dragPreview___onPbU {
  position: fixed;
  z-index: 100002;
  pointer-events: none;
  border: 1.5px dashed #3c82f7;
  border-radius: 6px;
  background: rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 600;
  color: #3c82f7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);
  transition: width 0.08s ease, height 0.08s ease, opacity 0.08s ease;
}

.styles-module__dragPreviewWireframe___jsg0G {
  border-color: #f97316;
  background: rgba(249, 115, 22, 0.1);
  color: #f97316;
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.15);
}

.styles-module__palette___C7iSH {
  position: absolute;
  right: 5px;
  bottom: calc(100% + 0.5rem);
  width: 256px;
  overflow: hidden;
  background: #1c1c1c;
  border: none;
  border-radius: 1rem;
  padding: 13px 0 16px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.04);
  z-index: 100001;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  cursor: default;
  opacity: 0;
  filter: blur(5px);
}
.styles-module__palette___C7iSH .styles-module__paletteItem___6TlnA,
.styles-module__palette___C7iSH .styles-module__paletteItemLabel___6ncO4,
.styles-module__palette___C7iSH .styles-module__paletteSectionTitle___PqnjX,
.styles-module__palette___C7iSH .styles-module__paletteFooter___QYnAG {
  transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}
.styles-module__palette___C7iSH.styles-module__enter___6LYk5 {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0px);
  transition: opacity 0.2s ease, transform 0.2s ease, filter 0.2s ease;
}
.styles-module__palette___C7iSH.styles-module__exit___iSGRw {
  opacity: 0;
  transform: translateY(6px);
  filter: blur(5px);
  pointer-events: none;
  transition: opacity 0.1s ease, transform 0.1s ease, filter 0.1s ease;
}
.styles-module__palette___C7iSH.styles-module__light___ORIft {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
}

.styles-module__paletteSection___V8DEA {
  padding: 0 1rem;
}
.styles-module__paletteSection___V8DEA + .styles-module__paletteSection___V8DEA {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}
.styles-module__light___ORIft .styles-module__paletteSection___V8DEA + .styles-module__paletteSection___V8DEA {
  border-top-color: rgba(0, 0, 0, 0.07);
}

.styles-module__paletteSectionTitle___PqnjX {
  font-size: 0.6875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: -0.0094em;
  padding: 0 0 3px 3px;
}
.styles-module__light___ORIft .styles-module__paletteSectionTitle___PqnjX {
  color: rgba(0, 0, 0, 0.4);
}

.styles-module__paletteItem___6TlnA {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.25rem;
  margin-bottom: 1px;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
  border: 1px solid transparent;
  user-select: none;
  min-height: 24px;
}
.styles-module__paletteItem___6TlnA:hover {
  background: rgba(255, 255, 255, 0.1);
}
.styles-module__paletteItem___6TlnA.styles-module__active___hosp7 {
  background: #3c82f7;
  border-color: transparent;
}
.styles-module__paletteItem___6TlnA.styles-module__wireframe___itvQU.styles-module__active___hosp7 {
  background: #f97316;
}
.styles-module__light___ORIft .styles-module__paletteItem___6TlnA:hover {
  background: rgba(0, 0, 0, 0.05);
}
.styles-module__light___ORIft .styles-module__paletteItem___6TlnA.styles-module__active___hosp7 {
  background: #3c82f7;
  border-color: transparent;
}
.styles-module__light___ORIft .styles-module__paletteItem___6TlnA.styles-module__wireframe___itvQU.styles-module__active___hosp7 {
  background: #f97316;
}

.styles-module__paletteItemIcon___0NPQK {
  width: 20px;
  height: 16px;
  border-radius: 2px;
  border: 1px dashed rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.45);
}
.styles-module__paletteItemIcon___0NPQK svg {
  display: block;
  width: 20px;
  height: 16px;
}
.styles-module__active___hosp7 .styles-module__paletteItemIcon___0NPQK {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}
.styles-module__light___ORIft .styles-module__paletteItemIcon___0NPQK {
  border-color: rgba(0, 0, 0, 0.12);
  background: rgba(0, 0, 0, 0.02);
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___ORIft .styles-module__active___hosp7 .styles-module__paletteItemIcon___0NPQK {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.styles-module__paletteItemLabel___6ncO4 {
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: -0.0094em;
  line-height: 1;
  min-width: 0;
}
.styles-module__active___hosp7 .styles-module__paletteItemLabel___6ncO4 {
  color: #fff;
  font-weight: 600;
}
.styles-module__light___ORIft .styles-module__paletteItemLabel___6ncO4 {
  color: rgba(0, 0, 0, 0.7);
}
.styles-module__light___ORIft .styles-module__active___hosp7 .styles-module__paletteItemLabel___6ncO4 {
  color: #fff;
  font-weight: 600;
}

.styles-module__placeScroll___7sClM {
  max-height: 240px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 0.25rem;
}
.styles-module__placeScroll___7sClM.styles-module__fadeTop___KT9tF {
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, black 32px);
  mask-image: linear-gradient(to bottom, transparent 0, black 32px);
}
.styles-module__placeScroll___7sClM.styles-module__fadeBottom___x3ShT {
  -webkit-mask-image: linear-gradient(to bottom, black calc(100% - 32px), transparent 100%);
  mask-image: linear-gradient(to bottom, black calc(100% - 32px), transparent 100%);
}
.styles-module__placeScroll___7sClM.styles-module__fadeTop___KT9tF.styles-module__fadeBottom___x3ShT {
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, black 32px, black calc(100% - 32px), transparent 100%);
  mask-image: linear-gradient(to bottom, transparent 0, black 32px, black calc(100% - 32px), transparent 100%);
}
.styles-module__placeScroll___7sClM::-webkit-scrollbar {
  width: 3px;
}
.styles-module__placeScroll___7sClM::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 2px;
}
.styles-module__light___ORIft .styles-module__placeScroll___7sClM::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
}

.styles-module__paletteFooterWrap___71-fI {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}
.styles-module__paletteFooterWrap___71-fI.styles-module__footerHidden___fJUik {
  grid-template-rows: 0fr;
}

.styles-module__paletteFooterInnerContent___VC26h {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.styles-module__footerHidden___fJUik .styles-module__paletteFooterInnerContent___VC26h {
  opacity: 0;
  transform: translateY(4px);
}

.styles-module__paletteFooterInner___dfylY {
  overflow: hidden;
}

.styles-module__paletteFooter___QYnAG {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
  padding: 0 1rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}
.styles-module__light___ORIft .styles-module__paletteFooter___QYnAG {
  border-top-color: rgba(0, 0, 0, 0.07);
}

.styles-module__paletteFooterCount___D3Fia {
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: -0.0094em;
  color: rgba(255, 255, 255, 0.5);
}
.styles-module__light___ORIft .styles-module__paletteFooterCount___D3Fia {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__paletteFooterClear___ybBoa {
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: -0.0094em;
  color: rgba(255, 255, 255, 0.5);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  transition: color 0.15s ease;
}
.styles-module__paletteFooterClear___ybBoa:hover {
  color: rgba(255, 255, 255, 0.7);
}
.styles-module__light___ORIft .styles-module__paletteFooterClear___ybBoa {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__light___ORIft .styles-module__paletteFooterClear___ybBoa:hover {
  color: rgba(0, 0, 0, 0.6);
}

.styles-module__paletteFooterActions___fLzv8 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.styles-module__rollingWrap___S75jM {
  display: inline-block;
  overflow: hidden;
  height: 1.15em;
  position: relative;
  vertical-align: bottom;
}

.styles-module__rollingNum___1RKDx {
  position: absolute;
  left: 0;
  top: 0;
}

.styles-module__exitUp___AFDRW {
  animation: styles-module__numExitUp___FRQqx 0.25s cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.styles-module__enterUp___CPlXb {
  animation: styles-module__numEnterUp___2Yd-w 0.25s cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.styles-module__exitDown___-1yAy {
  animation: styles-module__numExitDown___xm5by 0.25s cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.styles-module__enterDown___DDuFR {
  animation: styles-module__numEnterDown___hpxBk 0.25s cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

@keyframes styles-module__numExitUp___FRQqx {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-110%);
    opacity: 0;
  }
}
@keyframes styles-module__numEnterUp___2Yd-w {
  from {
    transform: translateY(110%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes styles-module__numExitDown___xm5by {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(110%);
    opacity: 0;
  }
}
@keyframes styles-module__numEnterDown___hpxBk {
  from {
    transform: translateY(-110%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.styles-module__rearrangeOverlay___-3R3t {
  position: fixed;
  inset: 0;
  z-index: 99995;
  pointer-events: none;
  cursor: default;
  user-select: none;
  animation: styles-module__overlayFadeIn___aECVy 0.15s ease;
}

.styles-module__hoverHighlight___8eT-v {
  position: fixed;
  pointer-events: none;
  z-index: 99994;
  border: 2px dashed rgba(59, 130, 246, 0.5);
  border-radius: 4px;
  background: rgba(59, 130, 246, 0.06);
  animation: styles-module__highlightFadeIn___Lg7KY 0.12s ease;
}

.styles-module__sectionOutline___s0hy- {
  position: fixed;
  border: 2px solid;
  border-radius: 4px;
  cursor: grab;
}
.styles-module__sectionOutline___s0hy-:active {
  cursor: grabbing;
}
.styles-module__sectionOutline___s0hy- {
  transition: box-shadow 0.15s, border-color 0.3s, background-color 0.3s, border-style 0s;
  user-select: none;
  pointer-events: auto;
  animation: styles-module__sectionEnter___-8BXT 0.2s ease;
}
.styles-module__sectionOutline___s0hy-:hover {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1), 0 4px 12px rgba(0, 0, 0, 0.15);
}
.styles-module__sectionOutline___s0hy-.styles-module__selected___6yrp6 {
  border-style: solid;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(59, 130, 246, 0.15);
}
.styles-module__sectionOutline___s0hy-.styles-module__selected___6yrp6:hover {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(59, 130, 246, 0.15);
}
.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6) {
  border: 1.5px dashed rgba(150, 150, 150, 0.35);
  background-color: transparent !important;
  box-shadow: none;
}
.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6):hover {
  border-color: rgba(150, 150, 150, 0.6);
  box-shadow: none;
}
.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6) .styles-module__sectionLabel___F80HQ {
  opacity: 0;
  transition: opacity 0.15s ease;
}
.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6):hover .styles-module__sectionLabel___F80HQ {
  opacity: 1;
}
.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6) .styles-module__movedBadge___s8z-q,
.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6) .styles-module__sectionDimensions___RcJSL {
  opacity: 0;
  transition: opacity 0.15s ease;
}
.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6):hover .styles-module__sectionDimensions___RcJSL {
  opacity: 1;
}
.styles-module__sectionOutline___s0hy-.styles-module__exiting___YrM8F {
  opacity: 0;
  transform: scale(0.97);
  pointer-events: none;
  animation: none;
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);
}

.styles-module__sectionLabel___F80HQ {
  position: absolute;
  top: 4px;
  left: 4px;
  font-size: 10px;
  font-weight: 600;
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  max-width: calc(100% - 8px);
  overflow: hidden;
  text-overflow: ellipsis;
}

.styles-module__movedBadge___s8z-q {
  position: absolute;
  bottom: 22px;
  right: 4px;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  background: #22c55e;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.styles-module__movedBadge___s8z-q.styles-module__badgeVisible___npbdS {
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.2s cubic-bezier(0.34, 1.2, 0.64, 1), transform 0.2s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.styles-module__resizedBadge___u51V8 {
  background: #3c82f7;
  bottom: 40px;
}

.styles-module__sectionDimensions___RcJSL {
  position: absolute;
  bottom: 4px;
  right: 4px;
  font-size: 9px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(0, 0, 0, 0.5);
  padding: 1px 5px;
  border-radius: 3px;
  white-space: nowrap;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.styles-module__light___ORIft .styles-module__sectionDimensions___RcJSL {
  color: rgba(0, 0, 0, 0.5);
  background: rgba(255, 255, 255, 0.7);
}

.styles-module__wireframeNotice___4GJyB {
  position: fixed;
  bottom: 16px;
  left: 24px;
  z-index: 99995;
  font-size: 9.5px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.4);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  pointer-events: auto;
  animation: styles-module__overlayFadeIn___aECVy 0.3s ease;
  line-height: 1.5;
  max-width: 280px;
}

.styles-module__wireframeOpacityRow___CJXzi {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.styles-module__wireframeOpacityLabel___afkfT {
  font-size: 9px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.32);
  letter-spacing: 0.02em;
  white-space: nowrap;
  user-select: none;
}

.styles-module__wireframeOpacitySlider___YcoEs {
  -webkit-appearance: none;
  appearance: none;
  width: 56px;
  height: 4px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s ease;
}
.styles-module__wireframeOpacitySlider___YcoEs:hover {
  background: rgba(0, 0, 0, 0.13);
}
.styles-module__wireframeOpacitySlider___YcoEs::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f97316;
  cursor: pointer;
  transition: background 0.15s ease;
}
.styles-module__wireframeOpacitySlider___YcoEs::-webkit-slider-thumb:hover {
  background: rgb(224.4209205021, 95.3548117155, 5.7790794979);
}
.styles-module__wireframeOpacitySlider___YcoEs::-moz-range-thumb {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f97316;
  border: none;
  cursor: pointer;
}
.styles-module__wireframeOpacitySlider___YcoEs::-moz-range-track {
  background: rgba(0, 0, 0, 0.08);
  height: 4px;
  border-radius: 2px;
}

.styles-module__wireframeNoticeTitleRow___PJqyG {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 2px;
}

.styles-module__wireframeNoticeTitle___okr08 {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.55);
}

.styles-module__wireframeNoticeDivider___PNKQ6 {
  width: 1px;
  height: 8px;
  background: rgba(0, 0, 0, 0.12);
  margin: 0 8px;
  flex-shrink: 0;
}

.styles-module__wireframeStartOver___YFk-I {
  font-size: 9.5px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.35);
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  text-decoration: none;
  transition: color 0.12s ease;
  white-space: nowrap;
}
.styles-module__wireframeStartOver___YFk-I:hover {
  color: rgba(0, 0, 0, 0.6);
}

.styles-module__ghostOutline___po-kO {
  position: fixed;
  border: 1.5px dashed rgba(59, 130, 246, 0.4);
  border-radius: 4px;
  background: rgba(59, 130, 246, 0.04);
  cursor: grab;
  opacity: 0.5;
  user-select: none;
  pointer-events: auto;
  animation: styles-module__ghostEnter___EC3Mb 0.25s ease;
  transition: box-shadow 0.15s, border-color 0.3s, opacity 0.25s;
}
.styles-module__ghostOutline___po-kO:active {
  cursor: grabbing;
}
.styles-module__ghostOutline___po-kO:hover {
  opacity: 0.7;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0, 0, 0, 0.08);
}
.styles-module__ghostOutline___po-kO.styles-module__selected___6yrp6 {
  opacity: 1;
  border-style: solid;
  border-width: 2px;
  border-color: #3c82f7;
  background: rgba(59, 130, 246, 0.08);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(59, 130, 246, 0.15);
}
.styles-module__ghostOutline___po-kO.styles-module__exiting___YrM8F {
  opacity: 0;
  transform: scale(0.97);
  pointer-events: none;
  animation: none;
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);
}

.styles-module__ghostBadge___tsQUK {
  position: absolute;
  bottom: calc(100% + 4px);
  left: -1px;
  font-size: 9px;
  font-weight: 600;
  color: rgba(59, 130, 246, 0.9);
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.2);
  padding: 1px 5px;
  border-radius: 3px;
  white-space: nowrap;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  letter-spacing: 0.02em;
  line-height: 1.2;
  animation: styles-module__badgeSlideIn___typJ7 0.2s ease both;
}

@keyframes styles-module__badgeSlideIn___typJ7 {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.styles-module__ghostBadgeExtra___6CVoD {
  display: inline;
  animation: styles-module__badgeExtraIn___i4W8F 0.2s ease both;
}

@keyframes styles-module__badgeExtraIn___i4W8F {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.styles-module__originalOutline___Y6DD1 {
  position: fixed;
  border: 1.5px dashed rgba(150, 150, 150, 0.3);
  border-radius: 4px;
  background: transparent;
  pointer-events: none;
  user-select: none;
  animation: styles-module__sectionEnter___-8BXT 0.2s ease;
}

.styles-module__originalLabel___HqI9g {
  position: absolute;
  top: 4px;
  left: 4px;
  font-size: 9px;
  font-weight: 500;
  color: rgba(150, 150, 150, 0.5);
  padding: 1px 6px;
  border-radius: 3px;
  white-space: nowrap;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: rgba(150, 150, 150, 0.08);
}

.styles-module__connectorSvg___Lovld {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 99996;
}

.styles-module__connectorLine___XeWh- {
  transition: opacity 0.2s ease;
  animation: styles-module__connectorDraw___8sK5I 0.3s ease both;
}

.styles-module__connectorDot___yvf7C {
  transform-box: fill-box;
  transform-origin: center;
  animation: styles-module__connectorDotIn___NwTUq 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
}

@keyframes styles-module__connectorDraw___8sK5I {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes styles-module__connectorDotIn___NwTUq {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.styles-module__connectorExiting___2lLOs {
  animation: styles-module__connectorOut___5QoPl 0.2s ease forwards;
}
.styles-module__connectorExiting___2lLOs .styles-module__connectorDot___yvf7C {
  animation: styles-module__connectorDotOut___FEq7e 0.2s ease forwards;
}

@keyframes styles-module__connectorOut___5QoPl {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes styles-module__connectorDotOut___FEq7e {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0);
    opacity: 0;
  }
}
@keyframes styles-module__placementEnter___TdRhf {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__sectionEnter___-8BXT {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__highlightFadeIn___Lg7KY {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes styles-module__overlayFadeIn___aECVy {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes styles-module__ghostEnter___EC3Mb {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 0.6;
    transform: scale(1);
  }
}`,Mt={overlayExiting:`styles-module__overlayExiting___iEmYr`,overlay:`styles-module__overlay___aWh-q`,overlayFadeIn:`styles-module__overlayFadeIn___aECVy`,light:`styles-module__light___ORIft`,wireframe:`styles-module__wireframe___itvQU`,placing:`styles-module__placing___45yD8`,passthrough:`styles-module__passthrough___xaFeE`,blankCanvas:`styles-module__blankCanvas___t2Eue`,visible:`styles-module__visible___OKKqX`,gridActive:`styles-module__gridActive___OZ-cf`,paletteHeader:`styles-module__paletteHeader___-Q5gQ`,paletteHeaderTitle:`styles-module__paletteHeaderTitle___oHqZC`,paletteHeaderDesc:`styles-module__paletteHeaderDesc___6i74T`,wireframePurposeWrap:`styles-module__wireframePurposeWrap___To-tS`,collapsed:`styles-module__collapsed___Ms9vS`,wireframePurposeInner:`styles-module__wireframePurposeInner___Lrahs`,wireframePurposeInput:`styles-module__wireframePurposeInput___7EtBN`,canvasToggle:`styles-module__canvasToggle___-QqSy`,active:`styles-module__active___hosp7`,canvasToggleIcon:`styles-module__canvasToggleIcon___7pJ82`,canvasToggleLabel:`styles-module__canvasToggleLabel___OanpY`,canvasPurposeWrap:`styles-module__canvasPurposeWrap___hj6zk`,canvasPurposeInner:`styles-module__canvasPurposeInner___VWiyu`,canvasPurposeToggle:`styles-module__canvasPurposeToggle___byDH2`,canvasPurposeCheck:`styles-module__canvasPurposeCheck___xqd7l`,checked:`styles-module__checked___-1JGH`,canvasPurposeLabel:`styles-module__canvasPurposeLabel___Zu-tD`,canvasPurposeHelp:`styles-module__canvasPurposeHelp___jijwR`,placement:`styles-module__placement___zcxv8`,placementEnter:`styles-module__placementEnter___TdRhf`,selected:`styles-module__selected___6yrp6`,dragging:`styles-module__dragging___le6KZ`,exiting:`styles-module__exiting___YrM8F`,placementContent:`styles-module__placementContent___f64A4`,placementLabel:`styles-module__placementLabel___0KvWl`,placementAnnotation:`styles-module__placementAnnotation___78pTr`,annotationVisible:`styles-module__annotationVisible___mrUyA`,sectionAnnotation:`styles-module__sectionAnnotation___aUIs0`,handle:`styles-module__handle___Ikbxm`,sectionOutline:`styles-module__sectionOutline___s0hy-`,ghostOutline:`styles-module__ghostOutline___po-kO`,handleNw:`styles-module__handleNw___4TMIj`,handleNe:`styles-module__handleNe___mnsTh`,handleSe:`styles-module__handleSe___oSFnk`,handleSw:`styles-module__handleSw___pi--Z`,handleN:`styles-module__handleN___aBA-Q`,handleE:`styles-module__handleE___0hM5u`,handleS:`styles-module__handleS___JjDRv`,handleW:`styles-module__handleW___ERWGQ`,edgeHandle:`styles-module__edgeHandle___XxXdT`,edgeN:`styles-module__edgeN___-JJDj`,edgeS:`styles-module__edgeS___66lMX`,edgeE:`styles-module__edgeE___1bGDa`,edgeW:`styles-module__edgeW___lHQNo`,deleteButton:`styles-module__deleteButton___LkGCb`,rearrangeOverlay:`styles-module__rearrangeOverlay___-3R3t`,drawBox:`styles-module__drawBox___BrVAa`,selectBox:`styles-module__selectBox___Iu8kB`,sizeIndicator:`styles-module__sizeIndicator___7zJ4y`,guideLine:`styles-module__guideLine___DUQY2`,dragPreview:`styles-module__dragPreview___onPbU`,dragPreviewWireframe:`styles-module__dragPreviewWireframe___jsg0G`,palette:`styles-module__palette___C7iSH`,paletteItem:`styles-module__paletteItem___6TlnA`,paletteItemLabel:`styles-module__paletteItemLabel___6ncO4`,paletteSectionTitle:`styles-module__paletteSectionTitle___PqnjX`,paletteFooter:`styles-module__paletteFooter___QYnAG`,enter:`styles-module__enter___6LYk5`,exit:`styles-module__exit___iSGRw`,paletteSection:`styles-module__paletteSection___V8DEA`,paletteItemIcon:`styles-module__paletteItemIcon___0NPQK`,placeScroll:`styles-module__placeScroll___7sClM`,fadeTop:`styles-module__fadeTop___KT9tF`,fadeBottom:`styles-module__fadeBottom___x3ShT`,paletteFooterWrap:`styles-module__paletteFooterWrap___71-fI`,footerHidden:`styles-module__footerHidden___fJUik`,paletteFooterInnerContent:`styles-module__paletteFooterInnerContent___VC26h`,paletteFooterInner:`styles-module__paletteFooterInner___dfylY`,paletteFooterCount:`styles-module__paletteFooterCount___D3Fia`,paletteFooterClear:`styles-module__paletteFooterClear___ybBoa`,paletteFooterActions:`styles-module__paletteFooterActions___fLzv8`,rollingWrap:`styles-module__rollingWrap___S75jM`,rollingNum:`styles-module__rollingNum___1RKDx`,exitUp:`styles-module__exitUp___AFDRW`,numExitUp:`styles-module__numExitUp___FRQqx`,enterUp:`styles-module__enterUp___CPlXb`,numEnterUp:`styles-module__numEnterUp___2Yd-w`,exitDown:`styles-module__exitDown___-1yAy`,numExitDown:`styles-module__numExitDown___xm5by`,enterDown:`styles-module__enterDown___DDuFR`,numEnterDown:`styles-module__numEnterDown___hpxBk`,hoverHighlight:`styles-module__hoverHighlight___8eT-v`,highlightFadeIn:`styles-module__highlightFadeIn___Lg7KY`,sectionEnter:`styles-module__sectionEnter___-8BXT`,settled:`styles-module__settled___b5U5o`,sectionLabel:`styles-module__sectionLabel___F80HQ`,movedBadge:`styles-module__movedBadge___s8z-q`,sectionDimensions:`styles-module__sectionDimensions___RcJSL`,badgeVisible:`styles-module__badgeVisible___npbdS`,resizedBadge:`styles-module__resizedBadge___u51V8`,wireframeNotice:`styles-module__wireframeNotice___4GJyB`,wireframeOpacityRow:`styles-module__wireframeOpacityRow___CJXzi`,wireframeOpacityLabel:`styles-module__wireframeOpacityLabel___afkfT`,wireframeOpacitySlider:`styles-module__wireframeOpacitySlider___YcoEs`,wireframeNoticeTitleRow:`styles-module__wireframeNoticeTitleRow___PJqyG`,wireframeNoticeTitle:`styles-module__wireframeNoticeTitle___okr08`,wireframeNoticeDivider:`styles-module__wireframeNoticeDivider___PNKQ6`,wireframeStartOver:`styles-module__wireframeStartOver___YFk-I`,ghostEnter:`styles-module__ghostEnter___EC3Mb`,ghostBadge:`styles-module__ghostBadge___tsQUK`,badgeSlideIn:`styles-module__badgeSlideIn___typJ7`,ghostBadgeExtra:`styles-module__ghostBadgeExtra___6CVoD`,badgeExtraIn:`styles-module__badgeExtraIn___i4W8F`,originalOutline:`styles-module__originalOutline___Y6DD1`,originalLabel:`styles-module__originalLabel___HqI9g`,connectorSvg:`styles-module__connectorSvg___Lovld`,connectorLine:`styles-module__connectorLine___XeWh-`,connectorDraw:`styles-module__connectorDraw___8sK5I`,connectorDot:`styles-module__connectorDot___yvf7C`,connectorDotIn:`styles-module__connectorDotIn___NwTUq`,connectorExiting:`styles-module__connectorExiting___2lLOs`,connectorOut:`styles-module__connectorOut___5QoPl`,connectorDotOut:`styles-module__connectorDotOut___FEq7e`};if(typeof document<`u`){let e=document.getElementById(`feedback-tool-styles-design-mode-styles`);e||(e=document.createElement(`style`),e.id=`feedback-tool-styles-design-mode-styles`,document.head.appendChild(e)),e.textContent=jt}var H=Mt,Nt=24,Pt=5;function Ft(e,t,n,r,i){let a=1/0,o=1/0,s=e.x,c=e.x+e.width,l=e.x+e.width/2,u=e.y,d=e.y+e.height,f=e.y+e.height/2,p=!r,m=p?[s,c,l]:[...r.left?[s]:[],...r.right?[c]:[]],h=p?[u,d,f]:[...r.top?[u]:[],...r.bottom?[d]:[]],g=[];for(let e of t)n.has(e.id)||g.push(e);i&&g.push(...i);for(let e of g){let t=e.x,n=e.x+e.width,r=e.x+e.width/2,i=e.y,s=e.y+e.height,c=e.y+e.height/2;for(let e of m)for(let i of[t,n,r]){let t=i-e;Math.abs(t)<Pt&&Math.abs(t)<Math.abs(a)&&(a=t)}for(let e of h)for(let t of[i,s,c]){let n=t-e;Math.abs(n)<Pt&&Math.abs(n)<Math.abs(o)&&(o=n)}}let _=Math.abs(a)<Pt?a:0,v=Math.abs(o)<Pt?o:0,y=[],b=new Set,ee=s+_,x=c+_,te=l+_,ne=u+v,S=d+v,C=f+v;for(let e of g){let t=e.x,n=e.x+e.width,r=e.x+e.width/2,i=e.y,a=e.y+e.height,o=e.y+e.height/2;for(let e of[t,r,n])for(let t of[ee,te,x])if(Math.abs(t-e)<.5){let t=`x:${Math.round(e)}`;b.has(t)||(b.add(t),y.push({axis:`x`,pos:e}))}for(let e of[i,o,a])for(let t of[ne,C,S])if(Math.abs(t-e)<.5){let t=`y:${Math.round(e)}`;b.has(t)||(b.add(t),y.push({axis:`y`,pos:e}))}}return{dx:_,dy:v,guides:y}}function It(){return`dp-${Date.now()}-${Math.random().toString(36).slice(2,7)}`}function Lt({placements:e,onChange:t,activeComponent:n,onActiveComponentChange:r,isDarkMode:i,exiting:a,onInteractionChange:o,className:s,passthrough:l,extraSnapRects:d,onSelectionChange:f,deselectSignal:p,onDragMove:m,onDragEnd:h,clearSignal:g,wireframe:_}){let[v,y]=(0,c.useState)(new Set),[b,ee]=(0,c.useState)(null),[x,te]=(0,c.useState)(null),[ne,S]=(0,c.useState)(null),[C,re]=(0,c.useState)([]),[w,T]=(0,c.useState)(null),[ie,ae]=(0,c.useState)(!1),oe=(0,c.useRef)(!1),[se,E]=(0,c.useState)(new Set),ce=(0,c.useRef)(new Map),le=(0,c.useRef)(null),D=(0,c.useRef)(null),ue=(0,c.useRef)(e);ue.current=e;let O=(0,c.useRef)(f);O.current=f;let de=(0,c.useRef)(m);de.current=m;let fe=(0,c.useRef)(h);fe.current=h;let pe=(0,c.useRef)(p);(0,c.useEffect)(()=>{p!==pe.current&&(pe.current=p,y(new Set))},[p]);let me=(0,c.useRef)(g);(0,c.useEffect)(()=>{if(g!==void 0&&g!==me.current){me.current=g;let e=new Set(ue.current.map(e=>e.id));e.size>0&&(E(e),y(new Set),D.current=null,k(()=>{t([]),E(new Set)},180))}},[g,t]),(0,c.useEffect)(()=>{let i=i=>{let a=i.target;if(!(a.tagName===`INPUT`||a.tagName===`TEXTAREA`||a.isContentEditable)){if((i.key===`Backspace`||i.key===`Delete`)&&v.size>0){i.preventDefault();let e=new Set(v);E(e),y(new Set),k(()=>{t(ue.current.filter(t=>!e.has(t.id))),E(new Set)},180);return}if([`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`].includes(i.key)&&v.size>0){i.preventDefault();let n=i.shiftKey?20:1,r=i.key===`ArrowLeft`?-n:i.key===`ArrowRight`?n:0,a=i.key===`ArrowUp`?-n:i.key===`ArrowDown`?n:0;t(e.map(e=>v.has(e.id)?{...e,x:Math.max(0,e.x+r),y:Math.max(0,e.y+a)}:e));return}if(i.key===`Escape`){n?r(null):v.size>0&&y(new Set);return}}};return document.addEventListener(`keydown`,i),()=>document.removeEventListener(`keydown`,i)},[v,n,e,t,r]);let he=(0,c.useCallback)(i=>{if(i.button!==0||l||i.target.closest(`.${H.placement}`))return;i.preventDefault(),i.stopPropagation();let a=window.scrollY,s=i.clientX,c=i.clientY;if(n){D.current=`place`,o?.(!0);let i=!1,l=s,u=c,d=e=>{l=e.clientX,u=e.clientY;let t=Math.abs(l-s),n=Math.abs(u-c);if((t>5||n>5)&&(i=!0),i){let t=Math.min(s,l),n=Math.min(c,u),r=Math.abs(l-s),i=Math.abs(u-c);ee({x:t,y:n,w:r,h:i}),S({x:e.clientX+12,y:e.clientY+12,text:`${Math.round(r)} \xD7 ${Math.round(i)}`})}},f=p=>{window.removeEventListener(`mousemove`,d),window.removeEventListener(`mouseup`,f),ee(null),S(null),D.current=null,o?.(!1);let m=A[n],h,g,_,v;i?(h=Math.min(s,l),g=Math.min(c,u)+a,_=Math.max(Nt,Math.abs(l-s)),v=Math.max(Nt,Math.abs(u-c))):(_=m.width,v=m.height,h=s-_/2,g=c+a-v/2),h=Math.max(0,h),g=Math.max(0,g);let b={id:It(),type:n,x:h,y:g,width:_,height:v,scrollY:a,timestamp:Date.now()};t([...e,b]),y(new Set([b.id])),r(null)};window.addEventListener(`mousemove`,d),window.addEventListener(`mouseup`,f)}else{i.shiftKey||y(new Set),D.current=`select`;let t=!1,n=e=>{let n=Math.abs(e.clientX-s),r=Math.abs(e.clientY-c);if((n>4||r>4)&&(t=!0),t){let t=Math.min(s,e.clientX),n=Math.min(c,e.clientY);te({x:t,y:n,w:Math.abs(e.clientX-s),h:Math.abs(e.clientY-c)})}},r=o=>{if(window.removeEventListener(`mousemove`,n),window.removeEventListener(`mouseup`,r),D.current=null,t){let t=Math.min(s,o.clientX),n=Math.min(c,o.clientY)+a,r=Math.abs(o.clientX-s),l=Math.abs(o.clientY-c),u=new Set(i.shiftKey?v:new Set);for(let i of e)i.y-a,i.x+i.width>t&&i.x<t+r&&i.y+i.height>n&&i.y<n+l&&u.add(i.id);y(u)}te(null)};window.addEventListener(`mousemove`,n),window.addEventListener(`mouseup`,r)}},[n,l,e,t,v]),ge=(0,c.useCallback)((n,r)=>{if(n.button!==0)return;let i=n.target;if(i.closest(`.${H.handle}`)||i.closest(`.${H.deleteButton}`))return;n.preventDefault(),n.stopPropagation();let a;n.shiftKey?(a=new Set(v),a.has(r)?a.delete(r):a.add(r)):a=v.has(r)?new Set(v):new Set([r]),y(a),(a.size!==v.size||[...a].some(e=>!v.has(e)))&&O.current?.(a,n.shiftKey),window.scrollY;let s=n.clientX,c=n.clientY,l=new Map;for(let t of e)a.has(t.id)&&l.set(t.id,{x:t.x,y:t.y});D.current=`move`,o?.(!0);let u=!1,f=!1,p=e,m=0,h=0,g=new Map;for(let t of e)l.has(t.id)&&g.set(t.id,{w:t.width,h:t.height});let _=n=>{let r=n.clientX-s,i=n.clientY-c;if((Math.abs(r)>2||Math.abs(i)>2)&&(u=!0),!u)return;if(n.altKey&&!f){f=!0;let t=[];for(let n of e)l.has(n.id)&&t.push({...n,id:It(),timestamp:Date.now()});p=[...e,...t]}let a=1/0,o=1/0,_=-1/0,v=-1/0;for(let[e,t]of l){let n=g.get(e);n&&(a=Math.min(a,t.x+r),o=Math.min(o,t.y+i),_=Math.max(_,t.x+r+n.w),v=Math.max(v,t.y+i+n.h))}let{dx:y,dy:b,guides:ee}=Ft({x:a,y:o,width:_-a,height:v-o},p,new Set(l.keys()),void 0,d);re(ee);let x=r+y,te=i+b;m=x,h=te,t(p.map(e=>{let t=l.get(e.id);return t?{...e,x:Math.max(0,t.x+x),y:Math.max(0,t.y+te)}:e})),de.current?.(x,te)},b=()=>{window.removeEventListener(`mousemove`,_),window.removeEventListener(`mouseup`,b),D.current=null,o?.(!1),re([]),fe.current?.(m,h,u)};window.addEventListener(`mousemove`,_),window.addEventListener(`mouseup`,b)},[v,e,t,o]),ve=(0,c.useCallback)((n,r,i)=>{n.preventDefault(),n.stopPropagation();let a=e.find(e=>e.id===r);if(!a)return;y(new Set([r])),D.current=`resize`,o?.(!0);let s=n.clientX,c=n.clientY,l=a.width,u=a.height,f=a.x,p=a.y,m={left:i.includes(`w`),right:i.includes(`e`),top:i.includes(`n`),bottom:i.includes(`s`)},h=e=>{let n=e.clientX-s,a=e.clientY-c,o=l,h=u,g=f,_=p;i.includes(`e`)&&(o=Math.max(Nt,l+n)),i.includes(`w`)&&(o=Math.max(Nt,l-n),g=f+l-o),i.includes(`s`)&&(h=Math.max(Nt,u+a)),i.includes(`n`)&&(h=Math.max(Nt,u-a),_=p+u-h);let{dx:v,dy:y,guides:b}=Ft({x:g,y:_,width:o,height:h},ue.current,new Set([r]),m,d);re(b),v!==0&&(m.right?o+=v:m.left&&(g+=v,o-=v)),y!==0&&(m.bottom?h+=y:m.top&&(_+=y,h-=y)),t(ue.current.map(e=>e.id===r?{...e,x:g,y:_,width:o,height:h}:e)),S({x:e.clientX+12,y:e.clientY+12,text:`${Math.round(o)} \xD7 ${Math.round(h)}`})},g=()=>{window.removeEventListener(`mousemove`,h),window.removeEventListener(`mouseup`,g),S(null),D.current=null,o?.(!1),re([])};window.addEventListener(`mousemove`,h),window.addEventListener(`mouseup`,g)},[e,t,o]),ye=(0,c.useCallback)(e=>{D.current=null,E(t=>{let n=new Set(t);return n.add(e),n}),y(t=>{let n=new Set(t);return n.delete(e),n}),k(()=>{t(ue.current.filter(t=>t.id!==e)),E(t=>{let n=new Set(t);return n.delete(e),n})},180)},[t]),be={hero:`Headline text`,button:`Button label`,badge:`Badge label`,cta:`Call to action text`,toast:`Notification message`,modal:`Dialog title`,card:`Card title`,navigation:`Brand / nav items`,tabs:`Tab labels`,input:`Placeholder text`,search:`Search placeholder`,pricing:`Plan name or price`,testimonial:`Quote text`,alert:`Alert message`,banner:`Banner text`,tag:`Tag label`,notification:`Notification message`,stat:`Metric value`,productCard:`Product name`},xe=(0,c.useCallback)(t=>{let n=e.find(e=>e.id===t);n&&(oe.current=!!n.text,T(t),ae(!1))},[e]),Se=(0,c.useCallback)(()=>{w&&(ae(!0),k(()=>{T(null),ae(!1)},150))},[w]);(0,c.useEffect)(()=>{a&&w&&Se()},[a]);let j=(0,c.useCallback)(n=>{w&&(t(e.map(e=>e.id===w?{...e,text:n.trim()||void 0}:e)),Se())},[w,e,t,Se]),N=typeof window<`u`?window.scrollY:0,P=[`nw`,`ne`,`se`,`sw`],F=_?`#f97316`:`#3c82f7`,Ce=[{dir:`n`,cls:H.edgeN,arrow:(0,u.jsx)(`svg`,{width:`8`,height:`6`,viewBox:`0 0 8 6`,fill:`none`,children:(0,u.jsx)(`path`,{d:`M4 0.5L1 4.5h6z`,fill:F})})},{dir:`e`,cls:H.edgeE,arrow:(0,u.jsx)(`svg`,{width:`6`,height:`8`,viewBox:`0 0 6 8`,fill:`none`,children:(0,u.jsx)(`path`,{d:`M5.5 4L1.5 1v6z`,fill:F})})},{dir:`s`,cls:H.edgeS,arrow:(0,u.jsx)(`svg`,{width:`8`,height:`6`,viewBox:`0 0 8 6`,fill:`none`,children:(0,u.jsx)(`path`,{d:`M4 5.5L1 1.5h6z`,fill:F})})},{dir:`w`,cls:H.edgeW,arrow:(0,u.jsx)(`svg`,{width:`6`,height:`8`,viewBox:`0 0 6 8`,fill:`none`,children:(0,u.jsx)(`path`,{d:`M0.5 4L4.5 1v6z`,fill:F})})}];return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(`div`,{ref:le,className:`${H.overlay} ${i?``:H.light} ${n?H.placing:``} ${l?H.passthrough:``} ${a?H.overlayExiting:``} ${_?H.wireframe:``}${s?` ${s}`:``}`,"data-feedback-toolbar":!0,onMouseDown:he,children:e.map(e=>{let t=v.has(e.id),n=M[e.type]?.label||e.type,r=e.y-N;return(0,u.jsxs)(`div`,{"data-design-placement":e.id,className:`${H.placement} ${t?H.selected:``} ${se.has(e.id)?H.exiting:``}`,style:{left:e.x,top:r,width:e.width,height:e.height,position:`fixed`},onMouseDown:t=>ge(t,e.id),onDoubleClick:()=>xe(e.id),children:[(0,u.jsx)(`span`,{className:H.placementLabel,children:n}),(0,u.jsx)(`span`,{className:`${H.placementAnnotation} ${e.text?H.annotationVisible:``}`,children:(e.text&&ce.current.set(e.id,e.text),e.text||ce.current.get(e.id)||``)}),(0,u.jsx)(`div`,{className:H.placementContent,children:(0,u.jsx)(At,{type:e.type,width:e.width,height:e.height,text:e.text})}),(0,u.jsx)(`div`,{className:H.deleteButton,onMouseDown:e=>e.stopPropagation(),onClick:()=>ye(e.id),children:`✕`}),P.map(t=>(0,u.jsx)(`div`,{className:`${H.handle} ${H[`handle${t.charAt(0).toUpperCase()}${t.slice(1)}`]}`,onMouseDown:n=>ve(n,e.id,t)},t)),Ce.map(({dir:t,cls:n,arrow:r})=>(0,u.jsx)(`div`,{className:`${H.edgeHandle} ${n}`,onMouseDown:n=>ve(n,e.id,t),children:r},t))]},e.id)})}),w&&(()=>{let t=e.find(e=>e.id===w);if(!t)return null;let n=t.y-N,r=t.x+t.width/2,a=n-8,o=n+t.height+8,s=a>200,c=o<window.innerHeight-100,l=Math.max(160,Math.min(window.innerWidth-160,r)),d;return d=s?{left:l,bottom:window.innerHeight-a}:c?{left:l,top:o}:{left:l,top:Math.max(80,window.innerHeight/2-80)},(0,u.jsx)(_e,{element:M[t.type]?.label||t.type,placeholder:be[t.type]||`Label or content text`,initialValue:t.text??``,submitLabel:oe.current?`Save`:`Set`,onSubmit:j,onCancel:Se,onDelete:oe.current?()=>{j(``)}:void 0,isExiting:ie,lightMode:!i,style:d})})(),b&&(0,u.jsx)(`div`,{className:H.drawBox,style:{left:b.x,top:b.y,width:b.w,height:b.h},"data-feedback-toolbar":!0}),x&&(0,u.jsx)(`div`,{className:H.selectBox,style:{left:x.x,top:x.y,width:x.w,height:x.h},"data-feedback-toolbar":!0}),ne&&(0,u.jsx)(`div`,{className:H.sizeIndicator,style:{left:ne.x,top:ne.y},"data-feedback-toolbar":!0,children:ne.text}),C.map((e,t)=>(0,u.jsx)(`div`,{className:H.guideLine,style:e.axis===`x`?{position:`fixed`,left:e.pos,top:0,width:1,bottom:0}:{position:`fixed`,left:0,top:e.pos-N,right:0,height:1},"data-feedback-toolbar":!0},`${e.axis}-${e.pos}-${t}`))]})}function Rt(e){if(!e)return``;let t=e.scrollTop>2,n=e.scrollTop+e.clientHeight<e.scrollHeight-2;return`${t?H.fadeTop:``} ${n?H.fadeBottom:``}`}var U=`currentColor`,W=`0.5`;function zt({type:e}){switch(e){case`navigation`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`1`,y:`4`,width:`18`,height:`8`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`2.5`,y:`7`,width:`3`,height:`1.5`,rx:`.5`,fill:U,opacity:`.4`}),(0,u.jsx)(`rect`,{x:`7`,y:`7`,width:`2.5`,height:`1.5`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`11`,y:`7`,width:`2.5`,height:`1.5`,rx:`.5`,fill:U,opacity:`.25`})]});case`header`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`1`,y:`2`,width:`18`,height:`12`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`3`,y:`5.5`,width:`8`,height:`2`,rx:`.5`,fill:U,opacity:`.35`}),(0,u.jsx)(`rect`,{x:`3`,y:`9`,width:`12`,height:`1`,rx:`.5`,fill:U,opacity:`.15`})]});case`hero`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`1`,y:`1`,width:`18`,height:`14`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`5`,y:`5`,width:`10`,height:`1.5`,rx:`.5`,fill:U,opacity:`.35`}),(0,u.jsx)(`rect`,{x:`7`,y:`8`,width:`6`,height:`1`,rx:`.5`,fill:U,opacity:`.15`}),(0,u.jsx)(`rect`,{x:`7.5`,y:`10.5`,width:`5`,height:`2.5`,rx:`1`,stroke:U,strokeWidth:W})]});case`section`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`1`,y:`1`,width:`18`,height:`14`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`3`,y:`4`,width:`6`,height:`1`,rx:`.5`,fill:U,opacity:`.3`}),(0,u.jsx)(`rect`,{x:`3`,y:`6.5`,width:`14`,height:`1`,rx:`.5`,fill:U,opacity:`.15`}),(0,u.jsx)(`rect`,{x:`3`,y:`9`,width:`10`,height:`1`,rx:`.5`,fill:U,opacity:`.15`})]});case`sidebar`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`1`,y:`1`,width:`7`,height:`14`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`2.5`,y:`4`,width:`4`,height:`1`,rx:`.5`,fill:U,opacity:`.3`}),(0,u.jsx)(`rect`,{x:`2.5`,y:`6.5`,width:`3.5`,height:`1`,rx:`.5`,fill:U,opacity:`.15`}),(0,u.jsx)(`rect`,{x:`2.5`,y:`9`,width:`4`,height:`1`,rx:`.5`,fill:U,opacity:`.15`})]});case`footer`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`1`,y:`7`,width:`18`,height:`8`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`3`,y:`9.5`,width:`4`,height:`1`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`9`,y:`9.5`,width:`4`,height:`1`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`15`,y:`9.5`,width:`3`,height:`1`,rx:`.5`,fill:U,opacity:`.2`})]});case`modal`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`3`,y:`2`,width:`14`,height:`12`,rx:`1.5`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`5`,y:`4.5`,width:`7`,height:`1`,rx:`.5`,fill:U,opacity:`.3`}),(0,u.jsx)(`rect`,{x:`5`,y:`7`,width:`10`,height:`1`,rx:`.5`,fill:U,opacity:`.15`}),(0,u.jsx)(`rect`,{x:`11`,y:`11`,width:`5`,height:`2`,rx:`.75`,stroke:U,strokeWidth:W})]});case`divider`:return(0,u.jsx)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:(0,u.jsx)(`line`,{x1:`2`,y1:`8`,x2:`18`,y2:`8`,stroke:U,strokeWidth:`0.5`,opacity:`.3`})});case`card`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`1`,width:`16`,height:`14`,rx:`1.5`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`2`,y:`1`,width:`16`,height:`5.5`,rx:`1`,fill:U,opacity:`.04`}),(0,u.jsx)(`rect`,{x:`4`,y:`8.5`,width:`8`,height:`1`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`4`,y:`11`,width:`11`,height:`1`,rx:`.5`,fill:U,opacity:`.12`})]});case`text`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`4`,width:`14`,height:`1.5`,rx:`.5`,fill:U,opacity:`.3`}),(0,u.jsx)(`rect`,{x:`2`,y:`7`,width:`11`,height:`1`,rx:`.5`,fill:U,opacity:`.15`}),(0,u.jsx)(`rect`,{x:`2`,y:`9.5`,width:`13`,height:`1`,rx:`.5`,fill:U,opacity:`.15`}),(0,u.jsx)(`rect`,{x:`2`,y:`12`,width:`8`,height:`1`,rx:`.5`,fill:U,opacity:`.12`})]});case`image`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`2`,width:`16`,height:`12`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`line`,{x1:`2`,y1:`2`,x2:`18`,y2:`14`,stroke:U,strokeWidth:`.3`,opacity:`.25`}),(0,u.jsx)(`line`,{x1:`18`,y1:`2`,x2:`2`,y2:`14`,stroke:U,strokeWidth:`.3`,opacity:`.25`})]});case`video`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`2`,width:`16`,height:`12`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`path`,{d:`M8.5 5.5v5l4.5-2.5z`,stroke:U,strokeWidth:W,fill:U,opacity:`.15`})]});case`table`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`1`,y:`2`,width:`18`,height:`12`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`line`,{x1:`1`,y1:`5.5`,x2:`19`,y2:`5.5`,stroke:U,strokeWidth:`.3`,opacity:`.25`}),(0,u.jsx)(`line`,{x1:`1`,y1:`9`,x2:`19`,y2:`9`,stroke:U,strokeWidth:`.3`,opacity:`.25`}),(0,u.jsx)(`line`,{x1:`7`,y1:`2`,x2:`7`,y2:`14`,stroke:U,strokeWidth:`.3`,opacity:`.25`}),(0,u.jsx)(`line`,{x1:`13`,y1:`2`,x2:`13`,y2:`14`,stroke:U,strokeWidth:`.3`,opacity:`.25`})]});case`grid`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`1.5`,y:`2`,width:`7`,height:`5.5`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`11.5`,y:`2`,width:`7`,height:`5.5`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`1.5`,y:`9.5`,width:`7`,height:`5.5`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`11.5`,y:`9.5`,width:`7`,height:`5.5`,rx:`1`,stroke:U,strokeWidth:W})]});case`list`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`circle`,{cx:`3.5`,cy:`4.5`,r:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`6.5`,y:`4`,width:`10`,height:`1`,rx:`.5`,fill:U,opacity:`.2`}),(0,u.jsx)(`circle`,{cx:`3.5`,cy:`8`,r:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`6.5`,y:`7.5`,width:`8`,height:`1`,rx:`.5`,fill:U,opacity:`.2`}),(0,u.jsx)(`circle`,{cx:`3.5`,cy:`11.5`,r:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`6.5`,y:`11`,width:`11`,height:`1`,rx:`.5`,fill:U,opacity:`.2`})]});case`chart`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`3`,y:`9`,width:`2.5`,height:`4`,rx:`.5`,fill:U,opacity:`.2`}),(0,u.jsx)(`rect`,{x:`7`,y:`6`,width:`2.5`,height:`7`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`11`,y:`3`,width:`2.5`,height:`10`,rx:`.5`,fill:U,opacity:`.3`}),(0,u.jsx)(`rect`,{x:`15`,y:`5`,width:`2.5`,height:`8`,rx:`.5`,fill:U,opacity:`.2`})]});case`accordion`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`1.5`,y:`2`,width:`17`,height:`4`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`3`,y:`3.5`,width:`6`,height:`1`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`1.5`,y:`7.5`,width:`17`,height:`3`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`1.5`,y:`12`,width:`17`,height:`3`,rx:`1`,stroke:U,strokeWidth:W})]});case`carousel`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`3`,y:`2`,width:`14`,height:`10`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`path`,{d:`M1.5 7L3 8.5 1.5 10`,stroke:U,strokeWidth:W,opacity:`.35`}),(0,u.jsx)(`path`,{d:`M18.5 7L17 8.5 18.5 10`,stroke:U,strokeWidth:W,opacity:`.35`}),(0,u.jsx)(`circle`,{cx:`8.5`,cy:`14`,r:`.6`,fill:U,opacity:`.35`}),(0,u.jsx)(`circle`,{cx:`10`,cy:`14`,r:`.6`,fill:U,opacity:`.15`}),(0,u.jsx)(`circle`,{cx:`11.5`,cy:`14`,r:`.6`,fill:U,opacity:`.15`})]});case`button`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`3`,y:`5`,width:`14`,height:`6`,rx:`2`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`6.5`,y:`7.5`,width:`7`,height:`1`,rx:`.5`,fill:U,opacity:`.25`})]});case`input`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`4`,width:`5.5`,height:`1`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`2`,y:`6.5`,width:`16`,height:`5.5`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`3.5`,y:`8.5`,width:`7`,height:`1`,rx:`.5`,fill:U,opacity:`.12`})]});case`search`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`4.5`,width:`16`,height:`7`,rx:`3.5`,stroke:U,strokeWidth:W}),(0,u.jsx)(`circle`,{cx:`6`,cy:`8`,r:`2`,stroke:U,strokeWidth:W,opacity:`.3`}),(0,u.jsx)(`line`,{x1:`7.5`,y1:`9.5`,x2:`9`,y2:`11`,stroke:U,strokeWidth:W,opacity:`.3`}),(0,u.jsx)(`rect`,{x:`9.5`,y:`7.5`,width:`6`,height:`1`,rx:`.5`,fill:U,opacity:`.12`})]});case`form`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`1.5`,width:`5.5`,height:`1`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`2`,y:`3.5`,width:`16`,height:`3`,rx:`.75`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`2`,y:`8`,width:`7`,height:`1`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`2`,y:`10`,width:`16`,height:`3`,rx:`.75`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`12`,y:`14`,width:`6`,height:`2`,rx:`.75`,stroke:U,strokeWidth:W})]});case`tabs`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`1`,y:`5`,width:`18`,height:`10`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`1`,y:`2`,width:`6`,height:`3.5`,rx:`.75`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`2.5`,y:`3.25`,width:`3`,height:`1`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`7`,y:`2`,width:`6`,height:`3.5`,rx:`.75`,stroke:U,strokeWidth:W})]});case`dropdown`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`2`,width:`16`,height:`4`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`3.5`,y:`3.5`,width:`7`,height:`1`,rx:`.5`,fill:U,opacity:`.2`}),(0,u.jsx)(`path`,{d:`M15 3.5l1.5 1.5L18 3.5`,stroke:U,strokeWidth:W,opacity:`.3`}),(0,u.jsx)(`rect`,{x:`2`,y:`7`,width:`16`,height:`7`,rx:`1`,stroke:U,strokeWidth:W,strokeDasharray:`2 1`,opacity:`.3`})]});case`toggle`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`4`,y:`5`,width:`12`,height:`6`,rx:`3`,stroke:U,strokeWidth:W}),(0,u.jsx)(`circle`,{cx:`13`,cy:`8`,r:`2`,fill:U,opacity:`.3`})]});case`avatar`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`circle`,{cx:`10`,cy:`8`,r:`6`,stroke:U,strokeWidth:W}),(0,u.jsx)(`circle`,{cx:`10`,cy:`6.5`,r:`2`,stroke:U,strokeWidth:W}),(0,u.jsx)(`path`,{d:`M6.5 13c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5`,stroke:U,strokeWidth:W})]});case`badge`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`3`,y:`5`,width:`14`,height:`6`,rx:`3`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`6`,y:`7.5`,width:`8`,height:`1`,rx:`.5`,fill:U,opacity:`.25`})]});case`breadcrumb`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`1.5`,y:`7`,width:`3.5`,height:`1`,rx:`.5`,fill:U,opacity:`.3`}),(0,u.jsx)(`path`,{d:`M6.5 7l1 1-1 1`,stroke:U,strokeWidth:W,opacity:`.2`}),(0,u.jsx)(`rect`,{x:`9`,y:`7`,width:`3.5`,height:`1`,rx:`.5`,fill:U,opacity:`.2`}),(0,u.jsx)(`path`,{d:`M14 7l1 1-1 1`,stroke:U,strokeWidth:W,opacity:`.2`}),(0,u.jsx)(`rect`,{x:`16.5`,y:`7`,width:`2`,height:`1`,rx:`.5`,fill:U,opacity:`.15`})]});case`pagination`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`5.5`,width:`3.5`,height:`5`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`6.5`,y:`5.5`,width:`3.5`,height:`5`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`11`,y:`5.5`,width:`3.5`,height:`5`,rx:`1`,fill:U,opacity:`.15`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`15.5`,y:`5.5`,width:`3.5`,height:`5`,rx:`1`,stroke:U,strokeWidth:W})]});case`progress`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`7`,width:`16`,height:`2`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`2`,y:`7`,width:`10`,height:`2`,rx:`1`,fill:U,opacity:`.2`})]});case`toast`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`4`,width:`16`,height:`8`,rx:`1.5`,stroke:U,strokeWidth:W}),(0,u.jsx)(`circle`,{cx:`5`,cy:`8`,r:`1.5`,stroke:U,strokeWidth:W,opacity:`.3`}),(0,u.jsx)(`rect`,{x:`8`,y:`6.5`,width:`7`,height:`1`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`8`,y:`9`,width:`5`,height:`1`,rx:`.5`,fill:U,opacity:`.12`})]});case`tooltip`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`3`,y:`3`,width:`14`,height:`7`,rx:`1.5`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`5.5`,y:`5.5`,width:`9`,height:`1`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`path`,{d:`M9 10l1 2.5 1-2.5`,stroke:U,strokeWidth:W})]});case`pricing`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`1`,width:`16`,height:`14`,rx:`1.5`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`6`,y:`3`,width:`8`,height:`1.5`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`7`,y:`5.5`,width:`6`,height:`2`,rx:`.5`,fill:U,opacity:`.15`}),(0,u.jsx)(`rect`,{x:`5`,y:`9`,width:`10`,height:`1`,rx:`.5`,fill:U,opacity:`.1`}),(0,u.jsx)(`rect`,{x:`5`,y:`11`,width:`10`,height:`1`,rx:`.5`,fill:U,opacity:`.1`}),(0,u.jsx)(`rect`,{x:`6`,y:`13`,width:`8`,height:`1.5`,rx:`.5`,fill:U,opacity:`.2`})]});case`testimonial`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`1`,width:`16`,height:`14`,rx:`1.5`,stroke:U,strokeWidth:W}),(0,u.jsx)(`text`,{x:`4`,y:`5.5`,fontSize:`4`,fill:U,opacity:`.2`,fontFamily:`serif`,children:`“`}),(0,u.jsx)(`rect`,{x:`4`,y:`7`,width:`12`,height:`1`,rx:`.5`,fill:U,opacity:`.15`}),(0,u.jsx)(`rect`,{x:`4`,y:`9`,width:`9`,height:`1`,rx:`.5`,fill:U,opacity:`.12`}),(0,u.jsx)(`circle`,{cx:`5.5`,cy:`12.5`,r:`1.5`,stroke:U,strokeWidth:W,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`8`,y:`12`,width:`5`,height:`1`,rx:`.5`,fill:U,opacity:`.15`})]});case`cta`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`1`,y:`2`,width:`18`,height:`12`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`5`,y:`4.5`,width:`10`,height:`1.5`,rx:`.5`,fill:U,opacity:`.3`}),(0,u.jsx)(`rect`,{x:`6`,y:`7.5`,width:`8`,height:`1`,rx:`.5`,fill:U,opacity:`.15`}),(0,u.jsx)(`rect`,{x:`7`,y:`10`,width:`6`,height:`2.5`,rx:`1`,stroke:U,strokeWidth:W})]});case`alert`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`4`,width:`16`,height:`8`,rx:`1.5`,stroke:U,strokeWidth:W}),(0,u.jsx)(`circle`,{cx:`6`,cy:`8`,r:`2`,stroke:U,strokeWidth:W,opacity:`.3`}),(0,u.jsx)(`line`,{x1:`6`,y1:`7`,x2:`6`,y2:`8.5`,stroke:U,strokeWidth:`0.6`,opacity:`.5`}),(0,u.jsx)(`circle`,{cx:`6`,cy:`9.3`,r:`.3`,fill:U,opacity:`.5`}),(0,u.jsx)(`rect`,{x:`9.5`,y:`7`,width:`6`,height:`1`,rx:`.5`,fill:U,opacity:`.2`})]});case`banner`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`1`,y:`5`,width:`18`,height:`6`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`4`,y:`7.5`,width:`8`,height:`1`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`14`,y:`7`,width:`3.5`,height:`2`,rx:`.75`,stroke:U,strokeWidth:W})]});case`stat`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`3`,y:`2`,width:`14`,height:`12`,rx:`1.5`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`6`,y:`4.5`,width:`8`,height:`1`,rx:`.5`,fill:U,opacity:`.15`}),(0,u.jsx)(`rect`,{x:`5`,y:`7`,width:`10`,height:`2.5`,rx:`.5`,fill:U,opacity:`.3`}),(0,u.jsx)(`rect`,{x:`7`,y:`11`,width:`6`,height:`1`,rx:`.5`,fill:U,opacity:`.12`})]});case`stepper`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`circle`,{cx:`4`,cy:`8`,r:`2`,fill:U,opacity:`.2`,stroke:U,strokeWidth:W}),(0,u.jsx)(`line`,{x1:`6`,y1:`8`,x2:`8`,y2:`8`,stroke:U,strokeWidth:`.4`,opacity:`.3`}),(0,u.jsx)(`circle`,{cx:`10`,cy:`8`,r:`2`,stroke:U,strokeWidth:W}),(0,u.jsx)(`line`,{x1:`12`,y1:`8`,x2:`14`,y2:`8`,stroke:U,strokeWidth:`.4`,opacity:`.3`}),(0,u.jsx)(`circle`,{cx:`16`,cy:`8`,r:`2`,stroke:U,strokeWidth:W})]});case`tag`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`3`,y:`5`,width:`14`,height:`6`,rx:`1.5`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`5.5`,y:`7.5`,width:`6`,height:`1`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`line`,{x1:`14`,y1:`6.5`,x2:`15.5`,y2:`9.5`,stroke:U,strokeWidth:W,opacity:`.2`}),(0,u.jsx)(`line`,{x1:`15.5`,y1:`6.5`,x2:`14`,y2:`9.5`,stroke:U,strokeWidth:W,opacity:`.2`})]});case`rating`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`path`,{d:`M4 5.5l1 2 2.2.3-1.6 1.5.4 2.2L4 10.3l-2 1.2.4-2.2L.8 7.8 3 7.5z`,fill:U,opacity:`.25`}),(0,u.jsx)(`path`,{d:`M10 5.5l1 2 2.2.3-1.6 1.5.4 2.2L10 10.3l-2 1.2.4-2.2L6.8 7.8 9 7.5z`,fill:U,opacity:`.25`}),(0,u.jsx)(`path`,{d:`M16 5.5l1 2 2.2.3-1.6 1.5.4 2.2L16 10.3l-2 1.2.4-2.2-1.6-1.5 2.2-.3z`,stroke:U,strokeWidth:W,opacity:`.25`})]});case`map`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`2`,width:`16`,height:`12`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`line`,{x1:`2`,y1:`6`,x2:`18`,y2:`10`,stroke:U,strokeWidth:`.3`,opacity:`.15`}),(0,u.jsx)(`line`,{x1:`7`,y1:`2`,x2:`11`,y2:`14`,stroke:U,strokeWidth:`.3`,opacity:`.15`}),(0,u.jsx)(`path`,{d:`M10 5c-1.7 0-3 1.3-3 3 0 2.5 3 5 3 5s3-2.5 3-5c0-1.7-1.3-3-3-3z`,fill:U,opacity:`.15`,stroke:U,strokeWidth:W})]});case`timeline`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`line`,{x1:`5`,y1:`2`,x2:`5`,y2:`14`,stroke:U,strokeWidth:`.4`,opacity:`.25`}),(0,u.jsx)(`circle`,{cx:`5`,cy:`4`,r:`1.5`,fill:U,opacity:`.2`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`8`,y:`3`,width:`8`,height:`1`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`circle`,{cx:`5`,cy:`8.5`,r:`1.5`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`8`,y:`7.5`,width:`6`,height:`1`,rx:`.5`,fill:U,opacity:`.15`}),(0,u.jsx)(`circle`,{cx:`5`,cy:`13`,r:`1.5`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`8`,y:`12`,width:`7`,height:`1`,rx:`.5`,fill:U,opacity:`.15`})]});case`fileUpload`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`3`,y:`2`,width:`14`,height:`12`,rx:`1.5`,stroke:U,strokeWidth:W,strokeDasharray:`2 1`}),(0,u.jsx)(`path`,{d:`M10 10V5.5m0 0L7.5 8m2.5-2.5L12.5 8`,stroke:U,strokeWidth:W,opacity:`.3`}),(0,u.jsx)(`rect`,{x:`7`,y:`11.5`,width:`6`,height:`1`,rx:`.5`,fill:U,opacity:`.15`})]});case`codeBlock`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`2`,width:`16`,height:`12`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`circle`,{cx:`4`,cy:`4`,r:`.6`,fill:U,opacity:`.3`}),(0,u.jsx)(`circle`,{cx:`5.5`,cy:`4`,r:`.6`,fill:U,opacity:`.3`}),(0,u.jsx)(`circle`,{cx:`7`,cy:`4`,r:`.6`,fill:U,opacity:`.3`}),(0,u.jsx)(`rect`,{x:`4`,y:`7`,width:`7`,height:`1`,rx:`.5`,fill:U,opacity:`.2`}),(0,u.jsx)(`rect`,{x:`6`,y:`9`,width:`5`,height:`1`,rx:`.5`,fill:U,opacity:`.15`}),(0,u.jsx)(`rect`,{x:`4`,y:`11`,width:`8`,height:`1`,rx:`.5`,fill:U,opacity:`.12`})]});case`calendar`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`3`,width:`16`,height:`12`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`line`,{x1:`2`,y1:`6.5`,x2:`18`,y2:`6.5`,stroke:U,strokeWidth:`.4`,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`5`,y:`4`,width:`1`,height:`1.5`,rx:`.3`,fill:U,opacity:`.2`}),(0,u.jsx)(`rect`,{x:`14`,y:`4`,width:`1`,height:`1.5`,rx:`.3`,fill:U,opacity:`.2`}),(0,u.jsx)(`circle`,{cx:`7`,cy:`9`,r:`.6`,fill:U,opacity:`.2`}),(0,u.jsx)(`circle`,{cx:`10`,cy:`9`,r:`.6`,fill:U,opacity:`.2`}),(0,u.jsx)(`circle`,{cx:`13`,cy:`9`,r:`.6`,fill:U,opacity:`.3`}),(0,u.jsx)(`circle`,{cx:`7`,cy:`12`,r:`.6`,fill:U,opacity:`.2`}),(0,u.jsx)(`circle`,{cx:`10`,cy:`12`,r:`.6`,fill:U,opacity:`.2`})]});case`notification`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`3`,width:`16`,height:`10`,rx:`1.5`,stroke:U,strokeWidth:W}),(0,u.jsx)(`circle`,{cx:`5.5`,cy:`8`,r:`2`,stroke:U,strokeWidth:W,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`9`,y:`6`,width:`6`,height:`1`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`9`,y:`8.5`,width:`4.5`,height:`1`,rx:`.5`,fill:U,opacity:`.12`}),(0,u.jsx)(`circle`,{cx:`16.5`,cy:`4.5`,r:`1.5`,fill:U,opacity:`.25`})]});case`productCard`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`3`,y:`1`,width:`14`,height:`14`,rx:`1.5`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`3`,y:`1`,width:`14`,height:`6`,rx:`1`,fill:U,opacity:`.04`}),(0,u.jsx)(`rect`,{x:`5`,y:`8.5`,width:`7`,height:`1`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`5`,y:`10.5`,width:`4`,height:`1.5`,rx:`.5`,fill:U,opacity:`.15`}),(0,u.jsx)(`rect`,{x:`12`,y:`12`,width:`4`,height:`2`,rx:`.75`,stroke:U,strokeWidth:W})]});case`profile`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`circle`,{cx:`10`,cy:`5`,r:`3`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`5`,y:`10`,width:`10`,height:`1.5`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`7`,y:`12.5`,width:`6`,height:`1`,rx:`.5`,fill:U,opacity:`.12`})]});case`drawer`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`9`,y:`1`,width:`10`,height:`14`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`10.5`,y:`4`,width:`5`,height:`1`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`10.5`,y:`6.5`,width:`7`,height:`1`,rx:`.5`,fill:U,opacity:`.15`}),(0,u.jsx)(`rect`,{x:`10.5`,y:`9`,width:`6`,height:`1`,rx:`.5`,fill:U,opacity:`.15`}),(0,u.jsx)(`rect`,{x:`1`,y:`1`,width:`7`,height:`14`,rx:`1`,stroke:U,strokeWidth:W,opacity:`.15`})]});case`popover`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`3`,y:`2`,width:`14`,height:`9`,rx:`1.5`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`5`,y:`4.5`,width:`8`,height:`1`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`5`,y:`7`,width:`6`,height:`1`,rx:`.5`,fill:U,opacity:`.15`}),(0,u.jsx)(`path`,{d:`M9 11l1 2.5 1-2.5`,stroke:U,strokeWidth:W})]});case`logo`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`3`,width:`10`,height:`10`,rx:`2`,stroke:U,strokeWidth:W}),(0,u.jsx)(`path`,{d:`M5 9.5l2-4 2 4`,stroke:U,strokeWidth:W,opacity:`.3`}),(0,u.jsx)(`rect`,{x:`14`,y:`6`,width:`4`,height:`1`,rx:`.5`,fill:U,opacity:`.2`}),(0,u.jsx)(`rect`,{x:`14`,y:`8.5`,width:`3`,height:`1`,rx:`.5`,fill:U,opacity:`.12`})]});case`faq`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`text`,{x:`2.5`,y:`5.5`,fontSize:`4`,fill:U,opacity:`.3`,fontWeight:`bold`,children:`?`}),(0,u.jsx)(`rect`,{x:`7`,y:`3`,width:`10`,height:`1`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`7`,y:`5.5`,width:`8`,height:`1`,rx:`.5`,fill:U,opacity:`.12`}),(0,u.jsx)(`text`,{x:`2.5`,y:`11.5`,fontSize:`4`,fill:U,opacity:`.3`,fontWeight:`bold`,children:`?`}),(0,u.jsx)(`rect`,{x:`7`,y:`9`,width:`9`,height:`1`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`7`,y:`11.5`,width:`7`,height:`1`,rx:`.5`,fill:U,opacity:`.12`})]});case`gallery`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`1.5`,y:`1.5`,width:`5`,height:`5`,rx:`.75`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`7.5`,y:`1.5`,width:`5`,height:`5`,rx:`.75`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`13.5`,y:`1.5`,width:`5`,height:`5`,rx:`.75`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`1.5`,y:`9.5`,width:`5`,height:`5`,rx:`.75`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`7.5`,y:`9.5`,width:`5`,height:`5`,rx:`.75`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`13.5`,y:`9.5`,width:`5`,height:`5`,rx:`.75`,stroke:U,strokeWidth:W})]});case`checkbox`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`5`,y:`4`,width:`8`,height:`8`,rx:`1.5`,stroke:U,strokeWidth:W}),(0,u.jsx)(`path`,{d:`M7.5 8l1.5 1.5 3-3`,stroke:U,strokeWidth:W,opacity:`.35`})]});case`radio`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`circle`,{cx:`10`,cy:`8`,r:`4`,stroke:U,strokeWidth:W}),(0,u.jsx)(`circle`,{cx:`10`,cy:`8`,r:`2`,fill:U,opacity:`.3`})]});case`slider`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`7.5`,width:`16`,height:`1`,rx:`.5`,fill:U,opacity:`.15`}),(0,u.jsx)(`rect`,{x:`2`,y:`7.5`,width:`10`,height:`1`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`circle`,{cx:`12`,cy:`8`,r:`2.5`,stroke:U,strokeWidth:W})]});case`datePicker`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`1`,width:`16`,height:`5`,rx:`1`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`3.5`,y:`3`,width:`5`,height:`1`,rx:`.5`,fill:U,opacity:`.2`}),(0,u.jsx)(`rect`,{x:`14`,y:`2.5`,width:`2.5`,height:`2`,rx:`.5`,fill:U,opacity:`.12`}),(0,u.jsx)(`rect`,{x:`2`,y:`7`,width:`16`,height:`8`,rx:`1`,stroke:U,strokeWidth:W,strokeDasharray:`2 1`,opacity:`.3`}),(0,u.jsx)(`circle`,{cx:`6`,cy:`10`,r:`.6`,fill:U,opacity:`.2`}),(0,u.jsx)(`circle`,{cx:`10`,cy:`10`,r:`.6`,fill:U,opacity:`.3`}),(0,u.jsx)(`circle`,{cx:`14`,cy:`10`,r:`.6`,fill:U,opacity:`.2`}),(0,u.jsx)(`circle`,{cx:`6`,cy:`13`,r:`.6`,fill:U,opacity:`.2`}),(0,u.jsx)(`circle`,{cx:`10`,cy:`13`,r:`.6`,fill:U,opacity:`.2`})]});case`skeleton`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`2`,width:`16`,height:`3`,rx:`1`,fill:U,opacity:`.08`}),(0,u.jsx)(`rect`,{x:`2`,y:`7`,width:`10`,height:`2`,rx:`.75`,fill:U,opacity:`.08`}),(0,u.jsx)(`rect`,{x:`2`,y:`11`,width:`13`,height:`2`,rx:`.75`,fill:U,opacity:`.08`})]});case`chip`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`1.5`,y:`5`,width:`10`,height:`6`,rx:`3`,fill:U,opacity:`.08`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`4`,y:`7.5`,width:`4`,height:`1`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`line`,{x1:`9.5`,y1:`6.5`,x2:`10.5`,y2:`9.5`,stroke:U,strokeWidth:W,opacity:`.2`}),(0,u.jsx)(`line`,{x1:`10.5`,y1:`6.5`,x2:`9.5`,y2:`9.5`,stroke:U,strokeWidth:W,opacity:`.2`}),(0,u.jsx)(`rect`,{x:`13`,y:`5`,width:`5.5`,height:`6`,rx:`3`,stroke:U,strokeWidth:W,opacity:`.25`})]});case`icon`:return(0,u.jsx)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:(0,u.jsx)(`path`,{d:`M10 3l1.5 3 3.5.5-2.5 2.5.5 3.5L10 11l-3 1.5.5-3.5L5 6.5l3.5-.5z`,stroke:U,strokeWidth:W,opacity:`.3`})});case`spinner`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`circle`,{cx:`10`,cy:`8`,r:`5`,stroke:U,strokeWidth:W,opacity:`.12`}),(0,u.jsx)(`path`,{d:`M10 3a5 5 0 0 1 5 5`,stroke:U,strokeWidth:W,opacity:`.35`,strokeLinecap:`round`})]});case`feature`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`2`,width:`5`,height:`5`,rx:`1.5`,stroke:U,strokeWidth:W}),(0,u.jsx)(`path`,{d:`M4.5 3.5v3m-1.5-1.5h3`,stroke:U,strokeWidth:W,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`9`,y:`2.5`,width:`8`,height:`1.5`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`9`,y:`5.5`,width:`6`,height:`1`,rx:`.5`,fill:U,opacity:`.12`}),(0,u.jsx)(`rect`,{x:`2`,y:`10`,width:`5`,height:`5`,rx:`1.5`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`9`,y:`10.5`,width:`7`,height:`1.5`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`9`,y:`13.5`,width:`5`,height:`1`,rx:`.5`,fill:U,opacity:`.12`})]});case`team`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`circle`,{cx:`5`,cy:`5`,r:`2.5`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`2.5`,y:`9`,width:`5`,height:`1`,rx:`.5`,fill:U,opacity:`.2`}),(0,u.jsx)(`circle`,{cx:`15`,cy:`5`,r:`2.5`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`12.5`,y:`9`,width:`5`,height:`1`,rx:`.5`,fill:U,opacity:`.2`}),(0,u.jsx)(`circle`,{cx:`10`,cy:`5`,r:`2.5`,stroke:U,strokeWidth:W,opacity:`.5`}),(0,u.jsx)(`rect`,{x:`7.5`,y:`9`,width:`5`,height:`1`,rx:`.5`,fill:U,opacity:`.15`}),(0,u.jsx)(`rect`,{x:`4`,y:`12`,width:`12`,height:`1`,rx:`.5`,fill:U,opacity:`.1`})]});case`login`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`3`,y:`1`,width:`14`,height:`14`,rx:`1.5`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`6`,y:`3`,width:`8`,height:`1.5`,rx:`.5`,fill:U,opacity:`.25`}),(0,u.jsx)(`rect`,{x:`5`,y:`5.5`,width:`10`,height:`3`,rx:`.75`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`5`,y:`9.5`,width:`10`,height:`3`,rx:`.75`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`6.5`,y:`13.5`,width:`7`,height:`2`,rx:`.75`,fill:U,opacity:`.2`})]});case`contact`:return(0,u.jsxs)(`svg`,{viewBox:`0 0 20 16`,width:`20`,height:`16`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`2`,y:`1`,width:`16`,height:`14`,rx:`1.5`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`4`,y:`3`,width:`5`,height:`1`,rx:`.5`,fill:U,opacity:`.2`}),(0,u.jsx)(`rect`,{x:`4`,y:`5`,width:`12`,height:`2.5`,rx:`.75`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`4`,y:`8.5`,width:`12`,height:`4`,rx:`.75`,stroke:U,strokeWidth:W}),(0,u.jsx)(`rect`,{x:`11`,y:`13.5`,width:`5`,height:`1.5`,rx:`.5`,fill:U,opacity:`.2`})]});default:return null}}function Bt({activeType:e,onSelect:t,onDragStart:n,scrollRef:r,fadeClass:i,blankCanvas:a}){return(0,u.jsx)(`div`,{ref:r,className:`${H.placeScroll} ${i||``}`,children:j.map(r=>(0,u.jsxs)(`div`,{className:H.paletteSection,children:[(0,u.jsx)(`div`,{className:H.paletteSectionTitle,children:r.section}),r.items.map(r=>(0,u.jsxs)(`div`,{className:`${H.paletteItem} ${e===r.type?H.active:``} ${a?H.wireframe:``}`,onClick:()=>t(r.type),onMouseDown:e=>{e.button===0&&n(r.type,e)},children:[(0,u.jsx)(`div`,{className:H.paletteItemIcon,children:(0,u.jsx)(zt,{type:r.type})}),(0,u.jsx)(`span`,{className:H.paletteItemLabel,children:r.label})]},r.type))]},r.section))})}function Vt({value:e,suffix:t}){let[n,r]=(0,c.useState)(null),[i,a]=(0,c.useState)(t),[o,s]=(0,c.useState)(`up`),l=(0,c.useRef)(e),d=(0,c.useRef)(t),f=(0,c.useRef)(),p=n!==null&&i!==t;return(0,c.useEffect)(()=>{if(e!==l.current){if(e===0){l.current=e,d.current=t,r(null);return}s(e>l.current?`up`:`down`),r(l.current),a(d.current),l.current=e,d.current=t,clearTimeout(f.current),f.current=k(()=>r(null),250)}else d.current=t},[e,t]),n===null?(0,u.jsxs)(u.Fragment,{children:[e,t?` ${t}`:``]}):p?(0,u.jsxs)(`span`,{className:H.rollingWrap,children:[(0,u.jsxs)(`span`,{style:{visibility:`hidden`},children:[e,` `,t]}),(0,u.jsxs)(`span`,{className:`${H.rollingNum} ${o===`up`?H.exitUp:H.exitDown}`,children:[n,` `,i]},`o${n}-${e}`),(0,u.jsxs)(`span`,{className:`${H.rollingNum} ${o===`up`?H.enterUp:H.enterDown}`,children:[e,` `,t]},`n${e}`)]}):(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)(`span`,{className:H.rollingWrap,children:[(0,u.jsx)(`span`,{style:{visibility:`hidden`},children:e}),(0,u.jsx)(`span`,{className:`${H.rollingNum} ${o===`up`?H.exitUp:H.exitDown}`,children:n},`o${n}-${e}`),(0,u.jsx)(`span`,{className:`${H.rollingNum} ${o===`up`?H.enterUp:H.enterDown}`,children:e},`n${e}`)]}),t?` ${t}`:``]})}function Ht({activeType:e,onSelect:t,isDarkMode:n,sectionCount:r,onDetectSections:i,visible:a,onExited:o,placementCount:s,onClearPlacements:l,onDragStart:d,blankCanvas:f,onBlankCanvasChange:p,wireframePurpose:m,onWireframePurposeChange:h,Tooltip:g}){let[_,v]=(0,c.useState)(!1),[y,b]=(0,c.useState)(`exit`),[ee,x]=(0,c.useState)(!1),[te,ne]=(0,c.useState)(!0),S=(0,c.useRef)(0),C=(0,c.useRef)(``),re=(0,c.useRef)(0),w=(0,c.useRef)(),T=(0,c.useRef)(null),[ie,ae]=(0,c.useState)(``);(0,c.useEffect)(()=>(a?(v(!0),clearTimeout(w.current),cancelAnimationFrame(re.current),re.current=fe(()=>{re.current=fe(()=>{b(`enter`)})})):(cancelAnimationFrame(re.current),b(`exit`),clearTimeout(w.current),w.current=k(()=>{v(!1),o?.()},200)),()=>cancelAnimationFrame(re.current)),[a]);let oe=s>0||r>0,se=s+r;if(se>0&&(S.current=se,C.current=f?se===1?`Component`:`Components`:se===1?`Change`:`Changes`),(0,c.useEffect)(()=>{if(oe)ee?ne(!1):(ne(!0),x(!0),fe(()=>{fe(()=>{ne(!1)})}));else{ne(!0);let e=k(()=>x(!1),300);return()=>clearTimeout(e)}},[oe]),(0,c.useEffect)(()=>{if(!_)return;let e=T.current;if(!e)return;let t=()=>ae(Rt(e));t(),e.addEventListener(`scroll`,t,{passive:!0});let n=new ResizeObserver(t);return n.observe(e),()=>{e.removeEventListener(`scroll`,t),n.disconnect()}},[_]),!_)return null;let E=[];return s>0&&E.push(`placed`),r>0&&E.push(`captured`),(0,u.jsxs)(`div`,{className:`${H.palette} ${H[y]} ${n?``:H.light}`,"data-feedback-toolbar":!0,"data-agentation-palette":!0,onClick:e=>e.stopPropagation(),onMouseDown:e=>e.stopPropagation(),onTransitionEnd:e=>{e.target===e.currentTarget&&(a||(clearTimeout(w.current),v(!1),b(`exit`),o?.()))},children:[(0,u.jsxs)(`div`,{className:H.paletteHeader,children:[(0,u.jsx)(`div`,{className:H.paletteHeaderTitle,children:`Layout Mode`}),(0,u.jsxs)(`div`,{className:H.paletteHeaderDesc,children:[`Rearrange and resize existing elements, add new components, and explore layout ideas. Agent results may vary.`,` `,(0,u.jsx)(`a`,{href:`https://agentation.dev/features#layout-mode`,target:`_blank`,rel:`noopener noreferrer`,children:`Learn more.`})]})]}),(0,u.jsxs)(`div`,{className:`${H.canvasToggle} ${f?H.active:``}`,onClick:()=>p(!f),children:[(0,u.jsx)(`span`,{className:H.canvasToggleIcon,children:(0,u.jsxs)(`svg`,{viewBox:`0 0 14 14`,width:`14`,height:`14`,fill:`none`,children:[(0,u.jsx)(`rect`,{x:`1`,y:`1`,width:`12`,height:`12`,rx:`2`,stroke:`currentColor`,strokeWidth:`1`}),(0,u.jsx)(`circle`,{cx:`4.5`,cy:`4.5`,r:`0.8`,fill:`currentColor`,opacity:`.6`}),(0,u.jsx)(`circle`,{cx:`7`,cy:`4.5`,r:`0.8`,fill:`currentColor`,opacity:`.6`}),(0,u.jsx)(`circle`,{cx:`9.5`,cy:`4.5`,r:`0.8`,fill:`currentColor`,opacity:`.6`}),(0,u.jsx)(`circle`,{cx:`4.5`,cy:`7`,r:`0.8`,fill:`currentColor`,opacity:`.6`}),(0,u.jsx)(`circle`,{cx:`7`,cy:`7`,r:`0.8`,fill:`currentColor`,opacity:`.6`}),(0,u.jsx)(`circle`,{cx:`9.5`,cy:`7`,r:`0.8`,fill:`currentColor`,opacity:`.6`}),(0,u.jsx)(`circle`,{cx:`4.5`,cy:`9.5`,r:`0.8`,fill:`currentColor`,opacity:`.6`}),(0,u.jsx)(`circle`,{cx:`7`,cy:`9.5`,r:`0.8`,fill:`currentColor`,opacity:`.6`}),(0,u.jsx)(`circle`,{cx:`9.5`,cy:`9.5`,r:`0.8`,fill:`currentColor`,opacity:`.6`})]})}),(0,u.jsx)(`span`,{className:H.canvasToggleLabel,children:`Wireframe New Page`})]}),(0,u.jsx)(`div`,{className:`${H.wireframePurposeWrap} ${f?``:H.collapsed}`,children:(0,u.jsx)(`div`,{className:H.wireframePurposeInner,children:(0,u.jsx)(`textarea`,{className:H.wireframePurposeInput,placeholder:`Describe this page to provide additional context for your agent.`,value:m,onChange:e=>h(e.target.value),rows:2})})}),(0,u.jsx)(Bt,{activeType:e,onSelect:t,onDragStart:d,scrollRef:T,fadeClass:ie,blankCanvas:f}),ee&&(0,u.jsx)(`div`,{className:`${H.paletteFooterWrap} ${te?H.footerHidden:``}`,children:(0,u.jsx)(`div`,{className:H.paletteFooterInner,children:(0,u.jsx)(`div`,{className:H.paletteFooterInnerContent,children:(0,u.jsxs)(`div`,{className:H.paletteFooter,children:[(0,u.jsx)(`span`,{className:H.paletteFooterCount,children:(0,u.jsx)(Vt,{value:S.current,suffix:C.current})}),(0,u.jsx)(`button`,{className:H.paletteFooterClear,onClick:l,children:`Clear`})]})})})})]})}function Ut(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function Wt(e,t){let n=e;for(;n;){if(n.matches(t))return n;n=Ut(n)}return null}function Gt(e,t=4){let n=[],r=e,i=0;for(;r&&i<t;){let e=r.tagName.toLowerCase();if(e===`html`||e===`body`)break;let t=e;if(r.id)t=`#${r.id}`;else if(r.className&&typeof r.className==`string`){let e=r.className.split(/\s+/).find(e=>e.length>2&&!e.match(/^[a-z]{1,2}$/)&&!e.match(/[A-Z0-9]{5,}/));e&&(t=`.${e.split(`_`)[0]}`)}let a=Ut(r);!r.parentElement&&a&&(t=`\u27E8shadow\u27E9 ${t}`),n.unshift(t),r=a,i++}return n.join(` > `)}function Kt(e){let t=Gt(e);if(e.dataset.element)return{name:e.dataset.element,path:t};let n=e.tagName.toLowerCase();if([`path`,`circle`,`rect`,`line`,`g`].includes(n)){let n=Wt(e,`svg`);if(n){let e=Ut(n);if(e instanceof HTMLElement)return{name:`graphic in ${Kt(e).name}`,path:t}}return{name:`graphic element`,path:t}}if(n===`svg`){let n=Ut(e);if(n?.tagName.toLowerCase()===`button`){let e=n.textContent?.trim();return{name:e?`icon in "${e}" button`:`button icon`,path:t}}return{name:`icon`,path:t}}if(n===`button`){let n=e.textContent?.trim(),r=e.getAttribute(`aria-label`);return r?{name:`button [${r}]`,path:t}:{name:n?`button "${n.slice(0,25)}"`:`button`,path:t}}if(n===`a`){let n=e.textContent?.trim(),r=e.getAttribute(`href`);return n?{name:`link "${n.slice(0,25)}"`,path:t}:r?{name:`link to ${r.slice(0,30)}`,path:t}:{name:`link`,path:t}}if(n===`input`){let n=e.getAttribute(`type`)||`text`,r=e.getAttribute(`placeholder`),i=e.getAttribute(`name`);return r?{name:`input "${r}"`,path:t}:i?{name:`input [${i}]`,path:t}:{name:`${n} input`,path:t}}if([`h1`,`h2`,`h3`,`h4`,`h5`,`h6`].includes(n)){let r=e.textContent?.trim();return{name:r?`${n} "${r.slice(0,35)}"`:n,path:t}}if(n===`p`){let n=e.textContent?.trim();return n?{name:`paragraph: "${n.slice(0,40)}${n.length>40?`...`:``}"`,path:t}:{name:`paragraph`,path:t}}if(n===`span`||n===`label`){let r=e.textContent?.trim();return r&&r.length<40?{name:`"${r}"`,path:t}:{name:n,path:t}}if(n===`li`){let n=e.textContent?.trim();return n&&n.length<40?{name:`list item: "${n.slice(0,35)}"`,path:t}:{name:`list item`,path:t}}if(n===`blockquote`)return{name:`blockquote`,path:t};if(n===`code`){let n=e.textContent?.trim();return n&&n.length<30?{name:`code: \`${n}\``,path:t}:{name:`code`,path:t}}if(n===`pre`)return{name:`code block`,path:t};if(n===`img`){let n=e.getAttribute(`alt`);return{name:n?`image "${n.slice(0,30)}"`:`image`,path:t}}if(n===`video`)return{name:`video`,path:t};if([`div`,`section`,`article`,`nav`,`header`,`footer`,`aside`,`main`].includes(n)){let r=e.className,i=e.getAttribute(`role`),a=e.getAttribute(`aria-label`);if(a)return{name:`${n} [${a}]`,path:t};if(i)return{name:`${i}`,path:t};if(typeof r==`string`&&r){let e=r.split(/[\s_-]+/).map(e=>e.replace(/[A-Z0-9]{5,}.*$/,``)).filter(e=>e.length>2&&!/^[a-z]{1,2}$/.test(e)).slice(0,2);if(e.length>0)return{name:e.join(` `),path:t}}return{name:n===`div`?`container`:n,path:t}}return{name:n,path:t}}function qt(e){let t=[],n=e.textContent?.trim();n&&n.length<100&&t.push(n);let r=e.previousElementSibling;if(r){let e=r.textContent?.trim();e&&e.length<50&&t.unshift(`[before: "${e.slice(0,40)}"]`)}let i=e.nextElementSibling;if(i){let e=i.textContent?.trim();e&&e.length<50&&t.push(`[after: "${e.slice(0,40)}"]`)}return t.join(` `)}function Jt(e){let t=Ut(e);if(!t)return``;let n=(e.getRootNode()instanceof ShadowRoot&&e.parentElement?Array.from(e.parentElement.children):Array.from(t.children)).filter(t=>t!==e&&t instanceof HTMLElement);if(n.length===0)return``;let r=n.slice(0,4).map(e=>{let t=e.tagName.toLowerCase(),n=e.className,r=``;if(typeof n==`string`&&n){let e=n.split(/\s+/).map(e=>e.replace(/[_][a-zA-Z0-9]{5,}.*$/,``)).find(e=>e.length>2&&!/^[a-z]{1,2}$/.test(e));e&&(r=`.${e}`)}if(t===`button`||t===`a`){let n=e.textContent?.trim().slice(0,15);if(n)return`${t}${r} "${n}"`}return`${t}${r}`}),i=t.tagName.toLowerCase();if(typeof t.className==`string`&&t.className){let e=t.className.split(/\s+/).map(e=>e.replace(/[_][a-zA-Z0-9]{5,}.*$/,``)).find(e=>e.length>2&&!/^[a-z]{1,2}$/.test(e));e&&(i=`.${e}`)}let a=t.children.length,o=a>r.length+1?` (${a} total in ${i})`:``;return r.join(`, `)+o}function Yt(e){let t=e.className;return typeof t!=`string`||!t?``:t.split(/\s+/).filter(e=>e.length>0).map(e=>{let t=e.match(/^([a-zA-Z][a-zA-Z0-9_-]*?)(?:_[a-zA-Z0-9]{5,})?$/);return t?t[1]:e}).filter((e,t,n)=>n.indexOf(e)===t).join(`, `)}var Xt=new Set([`none`,`normal`,`auto`,`0px`,`rgba(0, 0, 0, 0)`,`transparent`,`static`,`visible`]),Zt=new Set(`p.span.h1.h2.h3.h4.h5.h6.label.li.td.th.blockquote.figcaption.caption.legend.dt.dd.pre.code.em.strong.b.i.a.time.cite.q`.split(`.`)),Qt=new Set([`input`,`textarea`,`select`]),$t=new Set([`img`,`video`,`canvas`,`svg`]),en=new Set([`div`,`section`,`article`,`nav`,`header`,`footer`,`aside`,`main`,`ul`,`ol`,`form`,`fieldset`]);function tn(e){if(typeof window>`u`)return{};let t=window.getComputedStyle(e),n={},r=e.tagName.toLowerCase(),i;i=Zt.has(r)?[`color`,`fontSize`,`fontWeight`,`fontFamily`,`lineHeight`]:r===`button`||r===`a`&&e.getAttribute(`role`)===`button`||Qt.has(r)?[`backgroundColor`,`color`,`padding`,`borderRadius`,`fontSize`]:$t.has(r)?[`width`,`height`,`objectFit`,`borderRadius`]:en.has(r)?[`display`,`padding`,`margin`,`gap`,`backgroundColor`]:[`color`,`fontSize`,`margin`,`padding`,`backgroundColor`];for(let e of i){let r=e.replace(/([A-Z])/g,`-$1`).toLowerCase(),i=t.getPropertyValue(r);i&&!Xt.has(i)&&(n[e]=i)}return n}var nn=`color.backgroundColor.borderColor.fontSize.fontWeight.fontFamily.lineHeight.letterSpacing.textAlign.width.height.padding.margin.border.borderRadius.display.position.top.right.bottom.left.zIndex.flexDirection.justifyContent.alignItems.gap.opacity.visibility.overflow.boxShadow.transform`.split(`.`);function rn(e){if(typeof window>`u`)return``;let t=window.getComputedStyle(e),n=[];for(let e of nn){let r=e.replace(/([A-Z])/g,`-$1`).toLowerCase(),i=t.getPropertyValue(r);i&&!Xt.has(i)&&n.push(`${r}: ${i}`)}return n.join(`; `)}function an(e){if(!e)return;let t={},n=e.split(`;`).map(e=>e.trim()).filter(Boolean);for(let e of n){let n=e.indexOf(`:`);if(n>0){let r=e.slice(0,n).trim(),i=e.slice(n+1).trim();r&&i&&(t[r]=i)}}return Object.keys(t).length>0?t:void 0}function on(e){let t=[],n=e.getAttribute(`role`),r=e.getAttribute(`aria-label`),i=e.getAttribute(`aria-describedby`),a=e.getAttribute(`tabindex`),o=e.getAttribute(`aria-hidden`);return n&&t.push(`role="${n}"`),r&&t.push(`aria-label="${r}"`),i&&t.push(`aria-describedby="${i}"`),a&&t.push(`tabindex=${a}`),o===`true`&&t.push(`aria-hidden`),e.matches(`a, button, input, select, textarea, [tabindex]`)&&t.push(`focusable`),t.join(`, `)}function sn(e){let t=[],n=e;for(;n&&n.tagName.toLowerCase()!==`html`;){let e=n.tagName.toLowerCase(),r=e;if(n.id)r=`${e}#${n.id}`;else if(n.className&&typeof n.className==`string`){let t=n.className.split(/\s+/).map(e=>e.replace(/[_][a-zA-Z0-9]{5,}.*$/,``)).find(e=>e.length>2);t&&(r=`${e}.${t}`)}let i=Ut(n);!n.parentElement&&i&&(r=`\u27E8shadow\u27E9 ${r}`),t.unshift(r),n=i}return t.join(` > `)}var cn=new Set([`nav`,`header`,`main`,`section`,`article`,`footer`,`aside`]),ln={banner:`Header`,navigation:`Navigation`,main:`Main Content`,contentinfo:`Footer`,complementary:`Sidebar`,region:`Section`},G={nav:`Navigation`,header:`Header`,main:`Main Content`,section:`Section`,article:`Article`,footer:`Footer`,aside:`Sidebar`},un=new Set([`script`,`style`,`noscript`,`link`,`meta`]),dn=40;function fn(e){let t=e;for(;t&&t!==document.body&&t!==document.documentElement;){let e=window.getComputedStyle(t).position;if(e===`fixed`||e===`sticky`)return!0;t=t.parentElement}return!1}function pn(e){let t=e.tagName.toLowerCase();if([`nav`,`header`,`footer`,`main`].includes(t)&&document.querySelectorAll(t).length===1)return t;if(e.id)return`#${CSS.escape(e.id)}`;if(e.className&&typeof e.className==`string`){let n=e.className.split(/\s+/).filter(e=>e.length>0).find(e=>e.length>2&&!/^[a-zA-Z0-9]{6,}$/.test(e)&&!/^[a-z]{1,2}$/.test(e));if(n){let e=`${t}.${CSS.escape(n)}`;if(document.querySelectorAll(e).length===1)return e}}let n=e.parentElement;if(n){let r=Array.from(n.children).indexOf(e)+1;return`${n===document.body?`body`:pn(n)} > ${t}:nth-child(${r})`}return t}function mn(e){let t=e.tagName.toLowerCase(),n=e.getAttribute(`aria-label`);if(n)return n;let r=e.getAttribute(`role`);if(r&&ln[r])return ln[r];if(G[t])return G[t];let i=e.querySelector(`h1, h2, h3, h4, h5, h6`);if(i){let e=i.textContent?.trim();if(e&&e.length<=50)return e;if(e)return e.slice(0,47)+`...`}let{name:a}=Kt(e);return a.charAt(0).toUpperCase()+a.slice(1)}function hn(e){let t=e.className;return typeof t!=`string`||!t?null:t.split(/\s+/).map(e=>e.replace(/[_][a-zA-Z0-9]{5,}.*$/,``)).find(e=>e.length>2&&!/^[a-z]{1,2}$/.test(e))||null}function K(e){let t=e.textContent?.trim();if(!t)return null;let n=t.replace(/\s+/g,` `);return n.length<=30?n:n.slice(0,30)+`…`}function gn(){let e=document.querySelector(`main`)||document.body,t=Array.from(e.children),n=t;e!==document.body&&t.length<3&&(n=Array.from(document.body.children));let r=[];return n.forEach((e,t)=>{if(!(e instanceof HTMLElement))return;let n=e.tagName.toLowerCase();if(un.has(n)||e.hasAttribute(`data-feedback-toolbar`)||e.closest(`[data-feedback-toolbar]`))return;let i=window.getComputedStyle(e);if(i.display===`none`||i.visibility===`hidden`)return;let a=e.getBoundingClientRect();if(a.height<dn)return;let o=cn.has(n),s=e.getAttribute(`role`)&&ln[e.getAttribute(`role`)],c=n===`div`&&a.height>=60;if(!o&&!s&&!c)return;let l=window.scrollY,u=fn(e),d={x:a.x,y:u?a.y:a.y+l,width:a.width,height:a.height};r.push({id:`rs-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,label:mn(e),tagName:n,selector:pn(e),role:e.getAttribute(`role`),className:hn(e),textSnippet:K(e),originalRect:d,currentRect:{...d},originalIndex:t,isFixed:u})}),r}function _n(e){let t=window.scrollY,n=e.getBoundingClientRect(),r=fn(e),i={x:n.x,y:r?n.y:n.y+t,width:n.width,height:n.height},a=e.parentElement,o=0;return a&&(o=Array.from(a.children).indexOf(e)),{id:`rs-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,label:mn(e),tagName:e.tagName.toLowerCase(),selector:pn(e),role:e.getAttribute(`role`),className:hn(e),textSnippet:K(e),originalRect:i,currentRect:{...i},originalIndex:o,isFixed:r}}var vn={bg:`rgba(59, 130, 246, 0.08)`,border:`rgba(59, 130, 246, 0.5)`,pill:`#3b82f6`},yn=[`nw`,`n`,`ne`,`e`,`se`,`s`,`sw`,`w`],bn=24,xn=16,Sn=5;function q(e,t,n,r){let i=1/0,a=1/0,o=e.x,s=e.x+e.width,c=e.x+e.width/2,l=e.y,u=e.y+e.height,d=e.y+e.height/2,f=[];for(let e of t)n.has(e.id)||f.push(e.currentRect);r&&f.push(...r);for(let e of f){let t=e.x,n=e.x+e.width,r=e.x+e.width/2,f=e.y,p=e.y+e.height,m=e.y+e.height/2;for(let e of[o,s,c])for(let a of[t,n,r]){let t=a-e;Math.abs(t)<Sn&&Math.abs(t)<Math.abs(i)&&(i=t)}for(let e of[l,u,d])for(let t of[f,p,m]){let n=t-e;Math.abs(n)<Sn&&Math.abs(n)<Math.abs(a)&&(a=n)}}let p=Math.abs(i)<Sn?i:0,m=Math.abs(a)<Sn?a:0,h=[],g=new Set,_=o+p,v=s+p,y=c+p,b=l+m,ee=u+m,x=d+m;for(let e of f){let t=e.x,n=e.x+e.width,r=e.x+e.width/2,i=e.y,a=e.y+e.height,o=e.y+e.height/2;for(let e of[t,r,n])for(let t of[_,y,v])if(Math.abs(t-e)<.5){let t=`x:${Math.round(e)}`;g.has(t)||(g.add(t),h.push({axis:`x`,pos:e}))}for(let e of[i,o,a])for(let t of[b,x,ee])if(Math.abs(t-e)<.5){let t=`y:${Math.round(e)}`;g.has(t)||(g.add(t),h.push({axis:`y`,pos:e}))}}return{dx:p,dy:m,guides:h}}var Cn=new Set([`script`,`style`,`noscript`,`link`,`meta`,`br`,`hr`]);function wn(e){let t=e;for(;t&&t!==document.body&&t!==document.documentElement;){if(t.closest(`[data-feedback-toolbar]`))return null;if(Cn.has(t.tagName.toLowerCase())){t=t.parentElement;continue}let e=t.getBoundingClientRect();if(e.width>=xn&&e.height>=xn)return t;t=t.parentElement}return null}function Tn({rearrangeState:e,onChange:t,isDarkMode:n,exiting:r,className:i,blankCanvas:a,extraSnapRects:o,onSelectionChange:s,deselectSignal:l,onDragMove:d,onDragEnd:f,clearSignal:p}){let{sections:m}=e,h=(0,c.useRef)(e);h.current=e;let[g,_]=(0,c.useState)(new Set),[v,y]=(0,c.useState)(!1),b=(0,c.useRef)(p);(0,c.useEffect)(()=>{p!==void 0&&p!==b.current&&(b.current=p,m.length>0&&y(!0))},[p,m.length]);let ee=(0,c.useRef)(l);(0,c.useEffect)(()=>{l!==ee.current&&(ee.current=l,_(new Set))},[l]);let[x,te]=(0,c.useState)(null),[ne,S]=(0,c.useState)(!1),C=(0,c.useRef)(!1),re=(0,c.useCallback)(e=>{let t=m.find(t=>t.id===e);t&&(C.current=!!t.note,te(e),S(!1))},[m]),w=(0,c.useCallback)(()=>{x&&(S(!0),k(()=>{te(null),S(!1)},150))},[x]),T=(0,c.useCallback)(n=>{x&&(t({...e,sections:m.map(e=>e.id===x?{...e,note:n.trim()||void 0}:e)}),w())},[x,m,e,t,w]);(0,c.useEffect)(()=>{r&&x&&w()},[r]);let[ie,ae]=(0,c.useState)(new Set),oe=(0,c.useRef)(new Map),[se,E]=(0,c.useState)(null),[ce,le]=(0,c.useState)(null),[D,ue]=(0,c.useState)([]),[O,de]=(0,c.useState)(0),fe=(0,c.useRef)(null),pe=(0,c.useRef)(new Set),me=(0,c.useRef)(new Map),[he,ge]=(0,c.useState)(new Map),[ve,ye]=(0,c.useState)(new Map),be=(0,c.useRef)(new Set),xe=(0,c.useRef)(new Map),Se=(0,c.useRef)(s);Se.current=s;let A=(0,c.useRef)(d);A.current=d;let j=(0,c.useRef)(f);j.current=f,(0,c.useEffect)(()=>{a&&_(new Set)},[a]);let[M,N]=(0,c.useState)(()=>!e.sections.some(e=>{let t=e.originalRect,n=e.currentRect;return Math.abs(t.x-n.x)>1||Math.abs(t.y-n.y)>1||Math.abs(t.width-n.width)>1||Math.abs(t.height-n.height)>1}));(0,c.useEffect)(()=>{if(!M){let e=k(()=>N(!0),380);return()=>clearTimeout(e)}},[]);let P=(0,c.useRef)(new Set);(0,c.useEffect)(()=>{P.current=new Set(m.map(e=>e.selector))},[m]),(0,c.useEffect)(()=>{let e=()=>de(window.scrollY);return e(),window.addEventListener(`scroll`,e,{passive:!0}),window.addEventListener(`resize`,e,{passive:!0}),()=>{window.removeEventListener(`scroll`,e),window.removeEventListener(`resize`,e)}},[]),(0,c.useEffect)(()=>{let e=e=>{if(fe.current){E(null);return}let t=document.elementFromPoint(e.clientX,e.clientY);if(!t){E(null);return}if(t.closest(`[data-feedback-toolbar]`)){E(null);return}if(t.closest(`[data-design-placement]`)){E(null);return}if(t.closest(`[data-annotation-popup]`)){E(null);return}let n=wn(t);if(!n){E(null);return}for(let e of P.current)try{let t=document.querySelector(e);if(t&&(t===n||n.contains(t))){E(null);return}}catch{}let r=n.getBoundingClientRect();E({x:r.x,y:r.y,w:r.width,h:r.height})};return document.addEventListener(`mousemove`,e,{passive:!0}),()=>document.removeEventListener(`mousemove`,e)},[m]),(0,c.useEffect)(()=>{let e=document.body.style.userSelect;return document.body.style.userSelect=`none`,()=>{document.body.style.userSelect=e}},[]),(0,c.useEffect)(()=>{let n=n=>{if(fe.current||n.button!==0)return;let r=n.target;if(!r||r.closest(`[data-feedback-toolbar]`)||r.closest(`[data-design-placement]`)||r.closest(`[data-annotation-popup]`))return;let i=wn(r),a=!1;if(i)for(let e of P.current)try{let t=document.querySelector(e);if(t&&(t===i||i.contains(t))){a=!0;break}}catch{}let s=!!(n.shiftKey||n.metaKey||n.ctrlKey);if(i&&!a){n.preventDefault(),n.stopPropagation();let r=_n(i),a=[...m,r],c=[...e.originalOrder,r.id];t({...e,sections:a,originalOrder:c});let l=new Set([r.id]);_(l),Se.current?.(l,s),E(null);let u=n.clientX,d=n.clientY,f={x:r.currentRect.x,y:r.currentRect.y};r.originalRect;let p=!1,h=0,g=0;fe.current=`move`;let v=e=>{let t=e.clientX-u,n=e.clientY-d;if(!p&&(Math.abs(t)>2||Math.abs(n)>2)&&(p=!0),!p)return;let i=q({x:f.x+t,y:f.y+n,width:r.currentRect.width,height:r.currentRect.height},a,new Set([r.id]),o);ue(i.guides);let s=t+i.dx,c=n+i.dy;h=s,g=c;let l=document.querySelector(`[data-rearrange-section="${r.id}"]`);l&&(l.style.transform=`translate(${s}px, ${c}px)`),ge(new Map([[r.id,{x:f.x+s,y:f.y+c,width:r.currentRect.width,height:r.currentRect.height}]])),A.current?.(s,c)},y=()=>{window.removeEventListener(`mousemove`,v),window.removeEventListener(`mouseup`,y),fe.current=null,ue([]),ge(new Map);let n=document.querySelector(`[data-rearrange-section="${r.id}"]`);n&&(n.style.transform=``),p&&t({...e,sections:a.map(e=>e.id===r.id?{...e,currentRect:{...e.currentRect,x:Math.max(0,f.x+h),y:Math.max(0,f.y+g)}}:e),originalOrder:c}),j.current?.(h,g,p)};window.addEventListener(`mousemove`,v),window.addEventListener(`mouseup`,y)}else if(a&&i){n.preventDefault();for(let e of m)try{let t=document.querySelector(e.selector);if(t&&t===i){let t=new Set([e.id]);_(t),Se.current?.(t,s);return}}catch{}s||(_(new Set),Se.current?.(new Set,!1))}else s||(_(new Set),Se.current?.(new Set,!1))};return document.addEventListener(`mousedown`,n,!0),()=>document.removeEventListener(`mousedown`,n,!0)},[m,e,t]),(0,c.useEffect)(()=>{let n=n=>{let r=n.target;if(!(r.tagName===`INPUT`||r.tagName===`TEXTAREA`||r.isContentEditable)){if((n.key===`Backspace`||n.key===`Delete`)&&g.size>0){n.preventDefault();let e=new Set(g);ae(t=>{let n=new Set(t);for(let t of e)n.add(t);return n}),_(new Set),k(()=>{let n=h.current;t({...n,sections:n.sections.filter(t=>!e.has(t.id)),originalOrder:n.originalOrder.filter(t=>!e.has(t))}),ae(t=>{let n=new Set(t);for(let t of e)n.delete(t);return n})},180);return}if([`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`].includes(n.key)&&g.size>0){n.preventDefault();let r=n.shiftKey?20:1,i=n.key===`ArrowLeft`?-r:n.key===`ArrowRight`?r:0,a=n.key===`ArrowUp`?-r:n.key===`ArrowDown`?r:0;t({...e,sections:m.map(e=>g.has(e.id)?{...e,currentRect:{...e.currentRect,x:Math.max(0,e.currentRect.x+i),y:Math.max(0,e.currentRect.y+a)}}:e)});return}n.key===`Escape`&&g.size>0&&_(new Set)}};return document.addEventListener(`keydown`,n),()=>document.removeEventListener(`keydown`,n)},[g,m,e,t]);let F=(0,c.useCallback)((n,r)=>{if(n.button!==0)return;let i=n.target;if(i.closest(`.${H.handle}`)||i.closest(`.${H.deleteButton}`))return;n.preventDefault(),n.stopPropagation();let a;n.shiftKey||n.metaKey||n.ctrlKey?(a=new Set(g),a.has(r)?a.delete(r):a.add(r)):a=g.has(r)?new Set(g):new Set([r]),_(a),(a.size!==g.size||[...a].some(e=>!g.has(e)))&&Se.current?.(a,!!(n.shiftKey||n.metaKey||n.ctrlKey));let s=n.clientX,c=n.clientY,l=new Map;for(let e of m)a.has(e.id)&&l.set(e.id,{x:e.currentRect.x,y:e.currentRect.y});fe.current=`move`;let u=!1,d=0,f=0,p=new Map;for(let e of m)if(a.has(e.id)){let t=document.querySelector(`[data-rearrange-section="${e.id}"]`);p.set(e.id,{outlineEl:t,curW:e.currentRect.width,curH:e.currentRect.height})}let h=e=>{let t=e.clientX-s,n=e.clientY-c;if(t===0&&n===0)return;u=!0;let r=1/0,i=1/0,h=-1/0,g=-1/0;for(let[e,{curW:a,curH:o}]of p){let s=l.get(e);if(!s)continue;let c=s.x+t,u=s.y+n;r=Math.min(r,c),i=Math.min(i,u),h=Math.max(h,c+a),g=Math.max(g,u+o)}let _=q({x:r,y:i,width:h-r,height:g-i},m,a,o),v=t+_.dx,y=n+_.dy;d=v,f=y,ue(_.guides);for(let[,{outlineEl:e}]of p)e&&(e.style.transform=`translate(${v}px, ${y}px)`);let b=new Map;for(let[e,{curW:t,curH:n}]of p){let r=l.get(e);if(r){let i={x:Math.max(0,r.x+v),y:Math.max(0,r.y+y),width:t,height:n};b.set(e,i)}}ge(b),A.current?.(v,y)},v=n=>{window.removeEventListener(`mousemove`,h),window.removeEventListener(`mouseup`,v),fe.current=null,ue([]),ge(new Map);for(let[,{outlineEl:e}]of p)e&&(e.style.transform=``);if(u){let r=n.clientX-s,i=n.clientY-c;if(Math.abs(r)<5&&Math.abs(i)<5)t({...e,sections:m.map(e=>{let t=l.get(e.id);return t?{...e,currentRect:{...e.currentRect,x:t.x,y:t.y}}:e})});else{t({...e,sections:m.map(e=>{let t=l.get(e.id);return t?{...e,currentRect:{...e.currentRect,x:Math.max(0,t.x+d),y:Math.max(0,t.y+f)}}:e})}),j.current?.(d,f,!0);return}}j.current?.(0,0,!1)};window.addEventListener(`mousemove`,h),window.addEventListener(`mouseup`,v)},[g,m,e,t]),Ce=(0,c.useCallback)((n,r,i)=>{n.preventDefault(),n.stopPropagation();let a=m.find(e=>e.id===r);if(!a)return;_(new Set([r])),fe.current=`resize`;let o=n.clientX,s=n.clientY,c={...a.currentRect};a.originalRect;let l=c.width/c.height,u={...c},d=document.querySelector(`[data-rearrange-section="${r}"]`),f=e=>{let t=e.clientX-o,n=e.clientY-s,a=c.x,f=c.y,p=c.width,m=c.height;i.includes(`e`)&&(p=Math.max(bn,c.width+t)),i.includes(`w`)&&(p=Math.max(bn,c.width-t),a=c.x+c.width-p),i.includes(`s`)&&(m=Math.max(bn,c.height+n)),i.includes(`n`)&&(m=Math.max(bn,c.height-n),f=c.y+c.height-m),e.shiftKey&&(i.length===2?(Math.abs(p-c.width)>Math.abs(m-c.height)?m=p/l:p=m*l,i.includes(`w`)&&(a=c.x+c.width-p),i.includes(`n`)&&(f=c.y+c.height-m)):(i===`e`||i===`w`?m=p/l:p=m*l,i===`w`&&(a=c.x+c.width-p),i===`n`&&(f=c.y+c.height-m))),u={x:a,y:f,width:p,height:m},d&&(d.style.left=`${a}px`,d.style.top=`${f-O}px`,d.style.width=`${p}px`,d.style.height=`${m}px`),le({x:e.clientX+12,y:e.clientY+12,text:`${Math.round(p)} \xD7 ${Math.round(m)}`}),ge(new Map([[r,u]]))},p=()=>{window.removeEventListener(`mousemove`,f),window.removeEventListener(`mouseup`,p),le(null),fe.current=null,ge(new Map),t({...e,sections:m.map(e=>e.id===r?{...e,currentRect:u}:e)})};window.addEventListener(`mousemove`,f),window.addEventListener(`mouseup`,p)},[m,e,t,O]),we=(0,c.useCallback)(e=>{ae(t=>{let n=new Set(t);return n.add(e),n}),_(t=>{let n=new Set(t);return n.delete(e),n}),k(()=>{let n=h.current;t({...n,sections:n.sections.filter(t=>t.id!==e),originalOrder:n.originalOrder.filter(t=>t!==e)}),ae(t=>{let n=new Set(t);return n.delete(e),n})},180)},[t]),Te=e=>{let t=e.originalRect,n=e.currentRect;return Math.abs(t.x-n.x)>1||Math.abs(t.y-n.y)>1||Math.abs(t.width-n.width)>1||Math.abs(t.height-n.height)>1},Ee=e=>{let t=e.originalRect,n=e.currentRect;return Math.abs(t.x-n.x)>1||Math.abs(t.y-n.y)>1},De=e=>{let t=e.originalRect,n=e.currentRect;return Math.abs(t.width-n.width)>1||Math.abs(t.height-n.height)>1};for(let e of m)me.current.has(e.id)||(Ee(e)?me.current.set(e.id,`move`):De(e)&&me.current.set(e.id,`resize`));for(let e of me.current.keys())m.some(t=>t.id===e)||me.current.delete(e);let Oe=m.filter(e=>{try{if(ie.has(e.id)||g.has(e.id))return!0;let t=document.querySelector(e.selector);if(!t)return!1;let n=t.getBoundingClientRect(),r=e.originalRect;return Math.abs(n.width-r.width)+Math.abs(n.height-r.height)<200}catch{return!1}}),ke=Oe.filter(e=>Te(e)),Ae=Oe.filter(e=>!Te(e)),je=new Set(ke.map(e=>e.id));for(let e of pe.current)je.has(e)||pe.current.delete(e);let Me=[...je].sort().join(`,`);for(let e of ke)xe.current.set(e.id,{currentRect:e.currentRect,originalRect:e.originalRect,isFixed:e.isFixed});return(0,c.useEffect)(()=>{let e=be.current;be.current=je;let t=new Map;for(let n of e)if(!je.has(n)){if(!m.some(e=>e.id===n))continue;let e=xe.current.get(n);e&&(t.set(n,{orig:e.originalRect,target:e.currentRect,isFixed:e.isFixed}),xe.current.delete(n))}if(t.size>0){ye(e=>{let n=new Map(e);for(let[e,r]of t)n.set(e,r);return n});let e=k(()=>{ye(e=>{let n=new Map(e);for(let e of t.keys())n.delete(e);return n})},250);return()=>clearTimeout(e)}},[Me,m]),(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)(`div`,{className:`${H.rearrangeOverlay} ${n?``:H.light} ${r?H.overlayExiting:``}${i?` ${i}`:``}`,"data-feedback-toolbar":!0,children:[se&&(0,u.jsx)(`div`,{className:H.hoverHighlight,style:{left:se.x,top:se.y,width:se.w,height:se.h}}),Ae.map(e=>{let t=e.currentRect,n=e.isFixed?t.y:t.y-O,i=vn,a=g.has(e.id);return(0,u.jsxs)(`div`,{"data-rearrange-section":e.id,className:`${H.sectionOutline} ${a?H.selected:``} ${v||r||ie.has(e.id)?H.exiting:``}`,style:{left:t.x,top:n,width:t.width,height:t.height,borderColor:i.border,backgroundColor:i.bg,...M?{}:{opacity:0,animation:`none`,transition:`none`}},onMouseDown:t=>F(t,e.id),onDoubleClick:()=>re(e.id),children:[(0,u.jsx)(`span`,{className:H.sectionLabel,style:{backgroundColor:i.pill},children:e.label}),(0,u.jsx)(`span`,{className:`${H.sectionAnnotation} ${e.note?H.annotationVisible:``}`,children:(e.note&&oe.current.set(e.id,e.note),e.note||oe.current.get(e.id)||``)}),(0,u.jsxs)(`span`,{className:H.sectionDimensions,children:[Math.round(t.width),` × `,Math.round(t.height)]}),(0,u.jsx)(`div`,{className:H.deleteButton,onMouseDown:e=>e.stopPropagation(),onClick:()=>we(e.id),children:`✕`}),yn.map(t=>(0,u.jsx)(`div`,{className:`${H.handle} ${H[`handle${t.charAt(0).toUpperCase()}${t.slice(1)}`]}`,onMouseDown:n=>Ce(n,e.id,t)},t))]},e.id)}),ke.map(e=>{let t=e.currentRect,n=e.isFixed?t.y:t.y-O,i=g.has(e.id),o=Ee(e),s=De(e);if(a&&!i)return null;let c=!pe.current.has(e.id);return c&&pe.current.add(e.id),(0,u.jsxs)(`div`,{"data-rearrange-section":e.id,className:`${H.ghostOutline} ${i?H.selected:``} ${v||r||ie.has(e.id)?H.exiting:``}`,style:{left:t.x,top:n,width:t.width,height:t.height,...M?{}:{opacity:0,animation:`none`,transition:`none`},...c?{}:{animation:`none`}},onMouseDown:t=>F(t,e.id),onDoubleClick:()=>re(e.id),children:[(0,u.jsx)(`span`,{className:H.sectionLabel,style:{backgroundColor:vn.pill},children:e.label}),(0,u.jsx)(`span`,{className:`${H.sectionAnnotation} ${e.note?H.annotationVisible:``}`,children:(e.note&&oe.current.set(e.id,e.note),e.note||oe.current.get(e.id)||``)}),(0,u.jsxs)(`span`,{className:H.sectionDimensions,children:[Math.round(t.width),` × `,Math.round(t.height)]}),(0,u.jsx)(`div`,{className:H.deleteButton,onMouseDown:e=>e.stopPropagation(),onClick:()=>we(e.id),children:`✕`}),yn.map(t=>(0,u.jsx)(`div`,{className:`${H.handle} ${H[`handle${t.charAt(0).toUpperCase()}${t.slice(1)}`]}`,onMouseDown:n=>Ce(n,e.id,t)},t)),(0,u.jsx)(`span`,{className:H.ghostBadge,children:(()=>{let t=me.current.get(e.id);if(o&&s){let[e,n]=t===`resize`?[`Resize`,`Move`]:[`Move`,`Resize`];return(0,u.jsxs)(u.Fragment,{children:[`Suggested `,e,` `,(0,u.jsxs)(`span`,{className:H.ghostBadgeExtra,children:[`& `,n]})]})}return`Suggested ${s?`Resize`:`Move`}`})()})]},e.id)})]}),!a&&(()=>{let e=[];for(let t of ke){let n=he.get(t.id);e.push({id:t.id,orig:t.originalRect,target:n||t.currentRect,isFixed:t.isFixed,isSelected:g.has(t.id),isExiting:ie.has(t.id)})}for(let[t,n]of he)if(!e.some(e=>e.id===t)){let r=m.find(e=>e.id===t);r&&e.push({id:t,orig:r.originalRect,target:n,isFixed:r.isFixed,isSelected:g.has(t)})}for(let[t,n]of ve)e.some(e=>e.id===t)||e.push({id:t,orig:n.orig,target:n.target,isFixed:n.isFixed,isSelected:!1,isExiting:!0});return e.length===0?null:(0,u.jsxs)(`svg`,{className:`${H.connectorSvg} ${v||r?H.connectorExiting:``}`,children:[e.map(({id:e,orig:t,target:n,isFixed:r,isSelected:i,isExiting:a})=>{let o=t.x+t.width/2,s=(r?t.y:t.y-O)+t.height/2,c=n.x+n.width/2,l=(r?n.y:n.y-O)+n.height/2,d=c-o,f=l-s,p=Math.sqrt(d*d+f*f);if(p<2)return null;let m=Math.min(1,p/40),h=Math.min(p*.3,60),g=p>0?-f/p:0,_=p>0?d/p:0,v=(o+c)/2+g*h,y=(s+l)/2+_*h,b=he.has(e),ee=b||i?1:.4,x=b||i?1:.5;return(0,u.jsxs)(`g`,{className:a?H.connectorExiting:``,children:[(0,u.jsx)(`path`,{className:H.connectorLine,d:`M ${o} ${s} Q ${v} ${y} ${c} ${l}`,fill:`none`,stroke:`rgba(59, 130, 246, 0.45)`,strokeWidth:`1.5`,opacity:ee*m}),(0,u.jsx)(`circle`,{className:H.connectorDot,cx:o,cy:s,r:4*m,fill:`rgba(59, 130, 246, 0.8)`,stroke:`#fff`,strokeWidth:`1.5`,opacity:x*m,filter:`url(#connDotShadow)`}),(0,u.jsx)(`circle`,{className:H.connectorDot,cx:c,cy:l,r:4*m,fill:`rgba(59, 130, 246, 0.8)`,stroke:`#fff`,strokeWidth:`1.5`,opacity:x*m,filter:`url(#connDotShadow)`})]},`conn-${e}`)}),(0,u.jsx)(`defs`,{children:(0,u.jsx)(`filter`,{id:`connDotShadow`,x:`-50%`,y:`-50%`,width:`200%`,height:`200%`,children:(0,u.jsx)(`feDropShadow`,{dx:`0`,dy:`0.5`,stdDeviation:`1`,floodOpacity:`0.15`})})})]})})(),x&&(()=>{let e=m.find(e=>e.id===x);if(!e)return null;let t=e.currentRect,r=e.isFixed?t.y:t.y-O,i=t.x+t.width/2,a=r-8,o=r+t.height+8,s=a>200,c=o<window.innerHeight-100,l=Math.max(160,Math.min(window.innerWidth-160,i)),d;return d=s?{left:l,bottom:window.innerHeight-a}:c?{left:l,top:o}:{left:l,top:Math.max(80,window.innerHeight/2-80)},(0,u.jsx)(_e,{element:e.label,placeholder:`Add a note about this section`,initialValue:e.note??``,submitLabel:C.current?`Save`:`Set`,onSubmit:T,onCancel:w,onDelete:C.current?()=>{T(``)}:void 0,isExiting:ne,lightMode:!n,style:d})})(),ce&&(0,u.jsx)(`div`,{className:H.sizeIndicator,style:{left:ce.x,top:ce.y},"data-feedback-toolbar":!0,children:ce.text}),D.map((e,t)=>(0,u.jsx)(`div`,{className:H.guideLine,style:e.axis===`x`?{position:`fixed`,left:e.pos,top:0,width:1,height:`100vh`}:{position:`fixed`,left:0,top:e.pos-O,width:`100vw`,height:1}},`${e.axis}-${e.pos}-${t}`))]})}var En=new Set([`script`,`style`,`noscript`,`link`,`meta`,`br`,`hr`]);function Dn(){let e=document.querySelector(`main`)||document.body,t=[],n=Array.from(e.children),r=e!==document.body&&n.length<3?Array.from(document.body.children):n;for(let e of r){if(!(e instanceof HTMLElement)||En.has(e.tagName.toLowerCase())||e.hasAttribute(`data-feedback-toolbar`))continue;let n=window.getComputedStyle(e);if(n.display===`none`||n.visibility===`hidden`)continue;let r=e.getBoundingClientRect();if(!(r.height<10||r.width<10)){t.push({label:mn(e),selector:pn(e),top:r.top,bottom:r.bottom,left:r.left,right:r.right,area:r.width*r.height});for(let n of Array.from(e.children)){if(!(n instanceof HTMLElement)||En.has(n.tagName.toLowerCase())||n.hasAttribute(`data-feedback-toolbar`))continue;let e=window.getComputedStyle(n);if(e.display===`none`||e.visibility===`hidden`)continue;let r=n.getBoundingClientRect();r.height<10||r.width<10||t.push({label:mn(n),selector:pn(n),top:r.top,bottom:r.bottom,left:r.left,right:r.right,area:r.width*r.height})}}}return t}function J(e){let t=window.scrollY;return e.map(({label:e,selector:n,rect:r})=>{let i=r.y-t;return{label:e,selector:n,top:i,bottom:i+r.height,left:r.x,right:r.x+r.width,area:r.width*r.height}})}function On(e){let t=window.scrollY,n=e.y-t,r=e.x;return{top:n,bottom:n+e.height,left:r,right:r+e.width,area:e.width*e.height}}function kn(e,t){let n=t?J(t):Dn(),r=On(e),i=null,a=null,o=null,s=null,c=null;for(let t of n){if(Math.abs(t.left-r.left)<2&&Math.abs(t.top-r.top)<2&&Math.abs(t.right-t.left-e.width)<2&&Math.abs(t.bottom-t.top-e.height)<2)continue;t.left<=r.left+2&&t.right>=r.right-2&&t.top<=r.top+2&&t.bottom>=r.bottom-2&&t.area>r.area*1.5&&(!c||t.area<c._area)&&(c={label:t.label,selector:t.selector,_area:t.area});let n=r.right>t.left+5&&r.left<t.right-5,l=r.bottom>t.top+5&&r.top<t.bottom-5;if(n&&t.bottom<=r.top+5){let e=Math.round(r.top-t.bottom);(!i||e<i._dist)&&(i={label:t.label,selector:t.selector,gap:Math.max(0,e),_dist:e})}if(n&&t.top>=r.bottom-5){let e=Math.round(t.top-r.bottom);(!a||e<a._dist)&&(a={label:t.label,selector:t.selector,gap:Math.max(0,e),_dist:e})}if(l&&t.right<=r.left+5){let e=Math.round(r.left-t.right);(!o||e<o._dist)&&(o={label:t.label,selector:t.selector,gap:Math.max(0,e),_dist:e})}if(l&&t.left>=r.right-5){let e=Math.round(t.left-r.right);(!s||e<s._dist)&&(s={label:t.label,selector:t.selector,gap:Math.max(0,e),_dist:e})}}let l=window.innerWidth,u=window.innerHeight,d=jn(e,l),f=e=>e?{label:e.label,selector:e.selector,gap:e.gap}:null,p=An(r,e,l,u,c?{label:c.label,selector:c.selector,_area:c._area}:null,n);return{above:f(i),below:f(a),left:f(o),right:f(s),alignment:d,containedIn:c?{label:c.label,selector:c.selector}:null,outOfBounds:p}}function An(e,t,n,r,i,a){let o={},s=!1,c=[];if(e.left<-2&&c.push(`left`),e.right>n+2&&c.push(`right`),e.top<-2&&c.push(`top`),e.bottom>r+2&&c.push(`bottom`),c.length>0&&(o.viewport=c,s=!0),i){let t=a.find(e=>e.label===i.label&&e.selector===i.selector&&Math.abs(e.area-i._area)<10);if(t){let n=[];e.left<t.left-2&&n.push(`left`),e.right>t.right+2&&n.push(`right`),e.top<t.top-2&&n.push(`top`),e.bottom>t.bottom+2&&n.push(`bottom`),n.length>0&&(o.container={label:i.label,edges:n},s=!0)}}return s?o:null}function jn(e,t){if(e.width/t>.85)return`full-width`;let n=e.x+e.width/2-t/2,r=t*.08;return Math.abs(n)<r?`center`:n<0?`left`:`right`}function Mn(e){switch(e){case`full-width`:return`full-width`;case`center`:return`centered`;case`left`:return`left-aligned`;case`right`:return`right-aligned`}}function Nn(e,t={}){let n=[];e.above&&n.push(`Below \`${e.above.label}\`${e.above.gap>0?` (${e.above.gap}px gap)`:``}`),e.below&&n.push(`Above \`${e.below.label}\`${e.below.gap>0?` (${e.below.gap}px gap)`:``}`),t.includeLeftRight&&(e.left&&n.push(`Right of \`${e.left.label}\`${e.left.gap>0?` (${e.left.gap}px gap)`:``}`),e.right&&n.push(`Left of \`${e.right.label}\`${e.right.gap>0?` (${e.right.gap}px gap)`:``}`));let r=Mn(e.alignment);return e.containedIn?n.push(`${r.charAt(0).toUpperCase()+r.slice(1)} in \`${e.containedIn.label}\``):n.push(`${r.charAt(0).toUpperCase()+r.slice(1)} in page`),t.includePixelRef&&t.pixelRef&&n.push(`Pixel ref: \`${t.pixelRef}\``),e.outOfBounds&&(e.outOfBounds.viewport&&n.push(`**Outside viewport** (${e.outOfBounds.viewport.join(`, `)} edge${e.outOfBounds.viewport.length>1?`s`:``})`),e.outOfBounds.container&&n.push(`**Outside \`${e.outOfBounds.container.label}\`** (${e.outOfBounds.container.edges.join(`, `)} edge${e.outOfBounds.container.edges.length>1?`s`:``})`)),n}function Pn(e,t,n){let r=[];e.above&&r.push(`below \`${e.above.label}\``),e.below&&r.push(`above \`${e.below.label}\``),e.left&&r.push(`right of \`${e.left.label}\``),e.right&&r.push(`left of \`${e.right.label}\``),e.containedIn&&r.push(`inside \`${e.containedIn.label}\``),r.push(Mn(e.alignment)),e.outOfBounds?.viewport&&r.push(`**outside viewport** (${e.outOfBounds.viewport.join(`, `)})`),e.outOfBounds?.container&&r.push(`**outside \`${e.outOfBounds.container.label}\`** (${e.outOfBounds.container.edges.join(`, `)})`);let i=n?`, ${Math.round(n.width)}\xD7${Math.round(n.height)}px`:``;return`at (${Math.round(t.x)}, ${Math.round(t.y)})${i}: ${r.join(`, `)}`}var Fn=15;function In(e){if(e.length<2)return[];let t=[],n=new Set;for(let r=0;r<e.length;r++){if(n.has(r))continue;let i=[r];for(let t=r+1;t<e.length;t++)n.has(t)||Math.abs(e[r].rect.y-e[t].rect.y)<Fn&&i.push(t);if(i.length>=2){let r=i.map(t=>e[t]);r.sort((e,t)=>e.rect.x-t.rect.x);let a=[];for(let e=0;e<r.length-1;e++)a.push(Math.round(r[e+1].rect.x-(r[e].rect.x+r[e].rect.width)));let o=Math.round(r.reduce((e,t)=>e+t.rect.y,0)/r.length);t.push({labels:r.map(e=>e.label),type:`row`,sharedEdge:o,gaps:a,avgGap:a.length?Math.round(a.reduce((e,t)=>e+t,0)/a.length):0}),i.forEach(e=>n.add(e))}}for(let r=0;r<e.length;r++){if(n.has(r))continue;let i=[r];for(let t=r+1;t<e.length;t++)n.has(t)||Math.abs(e[r].rect.x-e[t].rect.x)<Fn&&i.push(t);if(i.length>=2){let r=i.map(t=>e[t]);r.sort((e,t)=>e.rect.y-t.rect.y);let a=[];for(let e=0;e<r.length-1;e++)a.push(Math.round(r[e+1].rect.y-(r[e].rect.y+r[e].rect.height)));let o=Math.round(r.reduce((e,t)=>e+t.rect.x,0)/r.length);t.push({labels:r.map(e=>e.label),type:`column`,sharedEdge:o,gaps:a,avgGap:a.length?Math.round(a.reduce((e,t)=>e+t,0)/a.length):0}),i.forEach(e=>n.add(e))}}return t}function Ln(e){if(e.length<2)return[];let t=In(e.map(e=>({label:e.label,rect:e.originalRect}))),n=In(e.map(e=>({label:e.label,rect:e.currentRect}))),r=[],i=new Set;for(let e of t){let t=new Set(e.labels),a=null,o=0;for(let e of n){let n=e.labels.filter(e=>t.has(e)).length;n>=2&&n>o&&(a=e,o=n)}if(a){let n=a.labels.filter(e=>t.has(e)),o=n.join(`, `);if(a.type!==e.type){let t=e.type===`row`?`y`:`x`,n=a.type===`row`?`y`:`x`;r.push(`**${o}**: ${e.type} (${t}\u2248${e.sharedEdge}, ${e.avgGap}px gaps) \u2192 ${a.type} (${n}\u2248${a.sharedEdge}, ${a.avgGap}px gaps)`)}else if(Math.abs(e.sharedEdge-a.sharedEdge)>20||Math.abs(e.avgGap-a.avgGap)>5){let t=e.type===`row`?`y`:`x`,n=Math.abs(e.sharedEdge-a.sharedEdge)>20?` ${t}: ${e.sharedEdge} \u2192 ${a.sharedEdge}`:``,i=Math.abs(e.avgGap-a.avgGap)>5?` gaps: ${e.avgGap}px \u2192 ${a.avgGap}px`:``;r.push(`**${o}**: ${e.type} shifted \u2014${n}${i}`)}n.forEach(e=>i.add(e))}else{let t=e.labels.join(`, `),n=e.type===`row`?`y`:`x`;r.push(`**${t}**: ${e.type} (${n}\u2248${e.sharedEdge}) dissolved`),e.labels.forEach(e=>i.add(e))}}for(let e of n)if(!e.labels.every(e=>i.has(e))&&!(e.labels.filter(e=>!i.has(e)).length<2)&&!t.some(t=>t.labels.filter(t=>e.labels.includes(t)).length>=2)){let t=e.type===`row`?`y`:`x`;r.push(`**${e.labels.join(`, `)}**: new ${e.type} (${t}\u2248${e.sharedEdge}, ${e.avgGap}px gaps)`),e.labels.forEach(e=>i.add(e))}let a=e.filter(e=>!i.has(e.label));if(a.length>=2){let e={};for(let t of a){let n=Math.round(t.currentRect.x/5)*5;(e[n]??(e[n]=[])).push(t.label)}for(let[t,n]of Object.entries(e))n.length>=2&&r.push(`**${n.join(`, `)}**: shared left edge at x\u2248${t}`)}return r}function Rn(e){if(typeof document>`u`)return{viewport:e,contentArea:null};let t=[],n=new Set,r=e=>{n.has(e)||e instanceof HTMLElement&&(e.hasAttribute(`data-feedback-toolbar`)||En.has(e.tagName.toLowerCase())||(n.add(e),t.push(e)))},i=document.querySelector(`main`);i&&r(i);let a=document.querySelector(`[role='main']`);a&&r(a);for(let e of Array.from(document.body.children))if(r(e),e.children){for(let t of Array.from(e.children))if(r(t),t.children)for(let e of Array.from(t.children))r(e)}let o=null;for(let n of t){let t=n.getBoundingClientRect();if(t.height<50)continue;let r=getComputedStyle(n);if(r.maxWidth&&r.maxWidth!==`none`&&r.maxWidth!==`0px`){(!o||t.width<o.rect.width)&&(o={el:n,rect:t});continue}!o&&t.width<e.width-20&&t.width>100&&(o={el:n,rect:t})}if(o){let{el:t,rect:n}=o;return{viewport:e,contentArea:{width:Math.round(n.width),left:Math.round(n.left),right:Math.round(n.right),centerX:Math.round(n.left+n.width/2),selector:pn(t)}}}return{viewport:e,contentArea:null}}function zn(e){if(typeof document>`u`)return null;let t=document.querySelector(e);if(!t?.parentElement)return null;let n=getComputedStyle(t.parentElement),r={parentDisplay:n.display,parentSelector:pn(t.parentElement)};return n.display.includes(`flex`)&&(r.flexDirection=n.flexDirection),n.display.includes(`grid`)&&n.gridTemplateColumns!==`none`&&(r.gridCols=n.gridTemplateColumns),n.gap&&n.gap!==`normal`&&n.gap!==`0px`&&(r.gap=n.gap),r}function Bn(e,t){let n=t.contentArea,r=n?n.width:t.viewport.width,i=n?n.left:0,a=n?n.centerX:Math.round(t.viewport.width/2),o=Math.round(e.x-i),s=Math.round(i+r-(e.x+e.width)),c=(e.width/r*100).toFixed(1),l=e.x+e.width/2,u=Math.abs(l-a)<20,d=e.width/r>.95,f=[];return d?f.push("`width: 100%` of container"):f.push(`left \`${o}px\` in container, right \`${s}px\`, width \`${c}%\` (\`${Math.round(e.width)}px\`)`),u&&!d&&f.push("centered — `margin-inline: auto`"),f.join(` — `)}function Vn(e){let{viewport:t,contentArea:n}=e,r=`### Reference Frame
`;if(r+=`- Viewport: \`${t.width}\xD7${t.height}px\`
`,n){let e=n;r+=`- Content area: \`${e.width}px\` wide, left edge at \`x=${e.left}\`, right at \`x=${e.right}\` (\`${e.selector}\`)
`,r+=`- Pixel → CSS translation:
`,r+=`  - **Horizontal position in container**: \`element.x - ${e.left}\` \u2192 use as \`margin-left\` or \`left\`
`,r+=`  - **Width as % of container**: \`element.width / ${e.width} \xD7 100\` \u2192 use as \`width: X%\`
`,r+="  - **Vertical gap between elements**: `nextElement.y - (prevElement.y + prevElement.height)` → use as `margin-top` or `gap`\n",r+=`  - **Centered**: if \`|element.centerX - ${e.centerX}| < 20px\` \u2192 use \`margin-inline: auto\`
`}else r+=`- No distinct content container — elements positioned relative to full viewport
`,r+=`- Pixel → CSS translation:
`,r+=`  - **Width as % of viewport**: \`element.width / ${t.width} \xD7 100\` \u2192 use as \`width: X%\`
`,r+=`  - **Centered**: if \`|(element.x + element.width/2) - ${Math.round(t.width/2)}| < 20px\` \u2192 use \`margin-inline: auto\`
`;return r+=`
`,r}function Hn(e){let t=zn(e);if(!t)return null;let n=`\`${t.parentDisplay}\``;return t.flexDirection&&(n+=`, flex-direction: \`${t.flexDirection}\``),t.gridCols&&(n+=`, grid-template-columns: \`${t.gridCols}\``),t.gap&&(n+=`, gap: \`${t.gap}\``),`Parent: ${n} (\`${t.parentSelector}\`)`}function Un(e,t,n,r=`standard`){if(e.length===0)return``;let i=[...e].sort((e,t)=>Math.abs(e.y-t.y)<20?e.x-t.x:e.y-t.y),a=``;if(n?.blankCanvas?(a+=`## Wireframe: New Page

`,n.wireframePurpose&&(a+=`> **Purpose:** ${n.wireframePurpose}
>
`),a+=`> ${e.length} component${e.length===1?``:`s`} placed \u2014 this is a standalone wireframe, not related to the current page.
>
> This wireframe is a rough sketch for exploring ideas.

`):a+=`## Design Layout

> ${e.length} component${e.length===1?``:`s`} placed

`,r===`compact`)return a+=`### Components
`,i.forEach((e,t)=>{let n=M[e.type]?.label||e.type;a+=`${t+1}. **${n}** \u2014 \`${Math.round(e.width)}\xD7${Math.round(e.height)}px\` at \`(${Math.round(e.x)}, ${Math.round(e.y)})\`
`}),a;let o=Rn(t);a+=Vn(o),a+=`### Components
`,i.forEach((e,t)=>{let n=M[e.type]?.label||e.type,i={x:e.x,y:e.y,width:e.width,height:e.height};a+=`${t+1}. **${n}** \u2014 \`${Math.round(e.width)}\xD7${Math.round(e.height)}px\` at \`(${Math.round(e.x)}, ${Math.round(e.y)})\`
`;let s=Nn(kn(i),{includeLeftRight:r===`detailed`||r===`forensic`});for(let e of s)a+=`   - ${e}
`;let c=Bn(i,o);c&&(a+=`   - CSS: ${c}
`)}),a+=`
### Layout Analysis
`;let s=[];for(let e of i){let t=s.find(t=>Math.abs(t.y-e.y)<30);t?t.items.push(e):s.push({y:e.y,items:[e]})}if(s.sort((e,t)=>e.y-t.y),s.forEach((e,n)=>{e.items.sort((e,t)=>e.x-t.x);let r=e.items.map(e=>M[e.type]?.label||e.type);if(e.items.length===1){let i=e.items[0].width>t.width*.8;a+=`- Row ${n+1} (y\u2248${Math.round(e.y)}): ${r[0]}${i?` — full width`:``}
`}else a+=`- Row ${n+1} (y\u2248${Math.round(e.y)}): ${r.join(` | `)} \u2014 ${e.items.length} items side by side
`}),r===`detailed`||r===`forensic`){a+=`
### Spacing & Gaps
`;for(let e=0;e<i.length-1;e++){let t=i[e],n=i[e+1],r=M[t.type]?.label||t.type,o=M[n.type]?.label||n.type,s=Math.round(n.y-(t.y+t.height)),c=Math.round(n.x-(t.x+t.width));Math.abs(t.y-n.y)<30?a+=`- ${r} \u2192 ${o}: \`${c}px\` horizontal gap
`:a+=`- ${r} \u2192 ${o}: \`${s}px\` vertical gap
`}if(r===`forensic`&&i.length>2){a+=`
### All Pairwise Gaps
`;for(let e=0;e<i.length;e++)for(let t=e+1;t<i.length;t++){let n=i[e],r=i[t],o=M[n.type]?.label||n.type,s=M[r.type]?.label||r.type,c=Math.round(r.y-(n.y+n.height)),l=Math.round(r.x-(n.x+n.width));a+=`- ${o} \u2194 ${s}: h=\`${l}px\` v=\`${c}px\`
`}}r===`forensic`&&(a+=`
### Z-Order (placement order)
`,e.forEach((e,t)=>{let n=M[e.type]?.label||e.type;a+=`${t}. ${n} at \`(${Math.round(e.x)}, ${Math.round(e.y)})\`
`}))}a+=`
### Suggested Implementation
`;let c=i.some(e=>e.type===`navigation`),l=i.some(e=>e.type===`hero`),u=i.some(e=>e.type===`sidebar`),d=i.some(e=>e.type===`footer`),f=i.filter(e=>e.type===`card`),p=i.filter(e=>e.type===`form`),m=i.filter(e=>e.type===`table`),h=i.filter(e=>e.type===`modal`);if(c&&(a+=`- Top navigation bar with logo + nav links + CTA
`),l&&(a+=`- Hero section with heading, subtext, and call-to-action
`),u&&(a+=`- Sidebar layout — use CSS Grid with sidebar + main content area
`),f.length>1?a+=`- ${f.length}-column card grid \u2014 use CSS Grid or Flexbox
`:f.length===1&&(a+=`- Card component with image + content area
`),p.length>0&&(a+=`- ${p.length} form${p.length>1?`s`:``} \u2014 add proper labels, validation, and submit handling
`),m.length>0&&(a+=`- Data table — consider sortable columns and pagination
`),h.length>0&&(a+=`- Modal dialog — add overlay backdrop and focus trapping
`),d&&(a+=`- Multi-column footer with links
`),r===`detailed`||r===`forensic`){if(a+=`
### CSS Suggestions
`,u){let e=i.find(e=>e.type===`sidebar`);a+=`- \`display: grid; grid-template-columns: ${Math.round(e.width)}px 1fr;\`
`}if(f.length>1){let e=Math.round(f[0].width);a+=`- \`display: grid; grid-template-columns: repeat(${f.length}, ${e}px); gap: 16px;\`
`}c&&(a+="- Navigation: `position: sticky; top: 0; z-index: 50;`\n")}return a}function Wn(e,t=`standard`,n){let{sections:r}=e,i=[];for(let e of r){let n=e.originalRect,r=e.currentRect,a=Math.abs(n.x-r.x)>1||Math.abs(n.y-r.y)>1,o=Math.abs(n.width-r.width)>1||Math.abs(n.height-r.height)>1;if(!a&&!o){t===`forensic`&&i.push({section:e,posMoved:!1,sizeChanged:!1});continue}i.push({section:e,posMoved:a,sizeChanged:o})}if(i.length===0||t!==`forensic`&&i.every(e=>!e.posMoved&&!e.sizeChanged))return``;let a=`## Suggested Layout Changes

`,o=Rn({width:n?n.width:typeof window<`u`?window.innerWidth:0,height:n?n.height:typeof window<`u`?window.innerHeight:0});t!==`compact`&&(a+=Vn(o)),t===`forensic`&&(a+=`> Detected at: \`${new Date(e.detectedAt).toISOString()}\`
`,a+=`> Total sections: ${r.length}

`);let s=e=>r.map(t=>({label:t.label,selector:t.selector,rect:e===`original`?t.originalRect:t.currentRect}));a+=`**Changes:**
`;for(let{section:e,posMoved:n,sizeChanged:r}of i){let i=e.originalRect,c=e.currentRect;if(!n&&!r){a+=`- ${e.label} \u2014 unchanged at (${Math.round(c.x)}, ${Math.round(c.y)}) ${Math.round(c.width)}\xD7${Math.round(c.height)}px
`;continue}if(t===`compact`){a+=n&&r?`- Suggested: move **${e.label}** to (${Math.round(c.x)}, ${Math.round(c.y)}) ${Math.round(c.width)}\xD7${Math.round(c.height)}px
`:n?`- Suggested: move **${e.label}** to (${Math.round(c.x)}, ${Math.round(c.y)})
`:`- Suggested: resize **${e.label}** to ${Math.round(c.width)}\xD7${Math.round(c.height)}px
`;continue}if(a+=n&&r?`- Suggested: move and resize **${e.label}**
`:n?`- Suggested: move **${e.label}**
`:`- Suggested: resize **${e.label}** from ${Math.round(i.width)}\xD7${Math.round(i.height)}px to ${Math.round(c.width)}\xD7${Math.round(c.height)}px
`,n){let e=kn(i,s(`original`)),n=kn(c,s(`current`)),l=r?{width:i.width,height:i.height}:void 0;a+=`  - Currently ${Pn(e,{x:i.x,y:i.y},l)}
`;let u=r?{width:c.width,height:c.height}:void 0,d=`at (${Math.round(c.x)}, ${Math.round(c.y)})`,f=u?`, ${Math.round(u.width)}\xD7${Math.round(u.height)}px`:``,p=Nn(n,{includeLeftRight:t===`detailed`||t===`forensic`});if(p.length>0){a+=`  - Suggested position ${d}${f}: ${p[0]}
`;for(let e=1;e<p.length;e++)a+=`    ${p[e]}
`}else a+=`  - Suggested position ${d}${f}
`;let m=Bn(c,o);m&&(a+=`  - CSS: ${m}
`)}let l=Hn(e.selector);if(l&&(a+=`  - ${l}
`),a+=`  - Selector: \`${e.selector}\`
`,t===`detailed`||t===`forensic`){let n=e.className?`${e.tagName}.${e.className.split(` `)[0]}`:e.tagName;n!==e.selector&&(a+=`  - Element: \`${n}\`
`),e.role&&(a+=`  - Role: \`${e.role}\`
`),t===`forensic`&&e.textSnippet&&(a+=`  - Text: "${e.textSnippet}"
`)}t===`forensic`&&(a+=`  - Original rect: \`{ x: ${Math.round(i.x)}, y: ${Math.round(i.y)}, w: ${Math.round(i.width)}, h: ${Math.round(i.height)} }\`
`,a+=`  - Current rect: \`{ x: ${Math.round(c.x)}, y: ${Math.round(c.y)}, w: ${Math.round(c.width)}, h: ${Math.round(c.height)} }\`
`)}if(t!==`compact`){let e=Ln(i.filter(e=>e.posMoved).map(e=>({label:e.section.label,originalRect:e.section.originalRect,currentRect:e.section.currentRect})));if(e.length>0){a+=`
### Layout Summary
`;for(let t of e)a+=`- ${t}
`}}if(t!==`compact`&&r.length>1){a+=`
### All Sections (current positions)
`;let e=[...r].sort((e,t)=>Math.abs(e.currentRect.y-t.currentRect.y)<20?e.currentRect.x-t.currentRect.x:e.currentRect.y-t.currentRect.y);for(let t of e){let e=t.currentRect,n=Math.abs(e.x-t.originalRect.x)>1||Math.abs(e.y-t.originalRect.y)>1||Math.abs(e.width-t.originalRect.width)>1||Math.abs(e.height-t.originalRect.height)>1;a+=`- ${t.label}: \`${Math.round(e.width)}\xD7${Math.round(e.height)}px\` at \`(${Math.round(e.x)}, ${Math.round(e.y)})\`${n?` ← suggested`:``}
`}}return a}var Gn=`feedback-annotations-`,Kn=7;function qn(e){return`${Gn}${e}`}function Jn(e){if(typeof window>`u`)return[];try{let t=localStorage.getItem(qn(e));if(!t)return[];let n=JSON.parse(t),r=Date.now()-Kn*24*60*60*1e3;return n.filter(e=>!e.timestamp||e.timestamp>r)}catch{return[]}}function Yn(e,t){if(!(typeof window>`u`))try{localStorage.setItem(qn(e),JSON.stringify(t))}catch{}}function Xn(){let e=new Map;if(typeof window>`u`)return e;try{let t=Date.now()-Kn*24*60*60*1e3;for(let n=0;n<localStorage.length;n++){let r=localStorage.key(n);if(r?.startsWith(Gn)){let n=r.slice(Gn.length),i=localStorage.getItem(r);if(i){let r=JSON.parse(i).filter(e=>!e.timestamp||e.timestamp>t);r.length>0&&e.set(n,r)}}}}catch{}return e}function Zn(e,t,n){Yn(e,t.map(e=>({...e,_syncedTo:n})))}var Qn=`agentation-design-`;function $n(e){if(typeof window>`u`)return[];try{let t=localStorage.getItem(`${Qn}${e}`);return t?JSON.parse(t):[]}catch{return[]}}function er(e,t){if(!(typeof window>`u`))try{localStorage.setItem(`${Qn}${e}`,JSON.stringify(t))}catch{}}function tr(e){if(!(typeof window>`u`))try{localStorage.removeItem(`${Qn}${e}`)}catch{}}var nr=`agentation-rearrange-`;function rr(e){if(typeof window>`u`)return null;try{let t=localStorage.getItem(`${nr}${e}`);return t?JSON.parse(t):null}catch{return null}}function ir(e,t){if(!(typeof window>`u`))try{localStorage.setItem(`${nr}${e}`,JSON.stringify(t))}catch{}}function ar(e){if(!(typeof window>`u`))try{localStorage.removeItem(`${nr}${e}`)}catch{}}var or=`agentation-wireframe-`;function sr(e){if(typeof window>`u`)return null;try{let t=localStorage.getItem(`${or}${e}`);return t?JSON.parse(t):null}catch{return null}}function cr(e,t){if(!(typeof window>`u`))try{localStorage.setItem(`${or}${e}`,JSON.stringify(t))}catch{}}function lr(e){if(!(typeof window>`u`))try{localStorage.removeItem(`${or}${e}`)}catch{}}var ur=`agentation-session-`;function dr(e){return`${ur}${e}`}function fr(e){if(typeof window>`u`)return null;try{return localStorage.getItem(dr(e))}catch{return null}}function pr(e,t){if(!(typeof window>`u`))try{localStorage.setItem(dr(e),t)}catch{}}function mr(e){if(!(typeof window>`u`))try{localStorage.removeItem(dr(e))}catch{}}var hr=`${ur}toolbar-hidden`;function gr(){if(typeof window>`u`)return!1;try{return sessionStorage.getItem(hr)===`1`}catch{return!1}}function _r(e){if(!(typeof window>`u`))try{e?sessionStorage.setItem(hr,`1`):sessionStorage.removeItem(hr)}catch{}}async function vr(e,t){let n=await fetch(`${e}/sessions`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({url:t})});if(!n.ok)throw Error(`Failed to create session: ${n.status}`);return n.json()}async function yr(e,t){let n=await fetch(`${e}/sessions/${t}`);if(!n.ok)throw Error(`Failed to get session: ${n.status}`);return n.json()}async function br(e,t,n){let r=await fetch(`${e}/sessions/${t}/annotations`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(n)});if(!r.ok)throw Error(`Failed to sync annotation: ${r.status}`);return r.json()}async function xr(e,t,n){let r=await fetch(`${e}/annotations/${t}`,{method:`PATCH`,headers:{"Content-Type":`application/json`},body:JSON.stringify(n)});if(!r.ok)throw Error(`Failed to update annotation: ${r.status}`);return r.json()}async function Sr(e,t){let n=await fetch(`${e}/annotations/${t}`,{method:`DELETE`});if(!n.ok)throw Error(`Failed to delete annotation: ${n.status}`)}var Y={FunctionComponent:0,ClassComponent:1,IndeterminateComponent:2,HostRoot:3,HostPortal:4,HostComponent:5,HostText:6,Fragment:7,Mode:8,ContextConsumer:9,ContextProvider:10,ForwardRef:11,Profiler:12,SuspenseComponent:13,MemoComponent:14,SimpleMemoComponent:15,LazyComponent:16,IncompleteClassComponent:17,DehydratedFragment:18,SuspenseListComponent:19,ScopeComponent:21,OffscreenComponent:22,LegacyHiddenComponent:23,CacheComponent:24,TracingMarkerComponent:25,HostHoistable:26,HostSingleton:27,IncompleteFunctionComponent:28,Throw:29,ViewTransitionComponent:30,ActivityComponent:31},Cr=new Set([`Component`,`PureComponent`,`Fragment`,`Suspense`,`Profiler`,`StrictMode`,`Routes`,`Route`,`Outlet`,`Root`,`ErrorBoundaryHandler`,`HotReload`,`Hot`]),wr=[/Boundary$/,/BoundaryHandler$/,/Provider$/,/Consumer$/,/^(Inner|Outer)/,/Router$/,/^Client(Page|Segment|Root)/,/^Segment(ViewNode|Node)$/,/^LayoutSegment/,/^Server(Root|Component|Render)/,/^RSC/,/Context$/,/^Hot(Reload)?$/,/^(Dev|React)(Overlay|Tools|Root)/,/Overlay$/,/Handler$/,/^With[A-Z]/,/Wrapper$/,/^Root$/],Tr=[/Page$/,/View$/,/Screen$/,/Section$/,/Card$/,/List$/,/Item$/,/Form$/,/Modal$/,/Dialog$/,/Button$/,/Nav$/,/Header$/,/Footer$/,/Layout$/,/Panel$/,/Tab$/,/Menu$/];function X(e){let t=e?.mode??`filtered`,n=Cr;if(e?.skipExact){let t=e.skipExact instanceof Set?e.skipExact:new Set(e.skipExact);n=new Set([...Cr,...t])}return{maxComponents:e?.maxComponents??6,maxDepth:e?.maxDepth??30,mode:t,skipExact:n,skipPatterns:e?.skipPatterns?[...wr,...e.skipPatterns]:wr,userPatterns:e?.userPatterns??Tr,filter:e?.filter}}function Er(e){return e.replace(/([a-z])([A-Z])/g,`$1-$2`).replace(/([A-Z])([A-Z][a-z])/g,`$1-$2`).toLowerCase()}function Dr(e,t=10){let n=new Set,r=e,i=0;for(;r&&i<t;)r.className&&typeof r.className==`string`&&r.className.split(/\s+/).forEach(e=>{if(e.length>1){let t=e.replace(/[_][a-zA-Z0-9]{5,}.*$/,``).toLowerCase();t.length>1&&n.add(t)}}),r=r.parentElement,i++;return n}function Or(e,t){let n=Er(e);for(let e of t){if(e===n)return!0;let t=n.split(`-`).filter(e=>e.length>2),r=e.split(`-`).filter(e=>e.length>2);for(let e of t)for(let t of r)if(e===t||e.includes(t)||t.includes(e))return!0}return!1}function kr(e,t,n,r){if(n.filter)return n.filter(e,t);switch(n.mode){case`all`:return!0;case`filtered`:return!(n.skipExact.has(e)||n.skipPatterns.some(t=>t.test(e)));case`smart`:return n.skipExact.has(e)||n.skipPatterns.some(t=>t.test(e))?!1:!!(r&&Or(e,r)||n.userPatterns.some(t=>t.test(e)));default:return!0}}var Ar=null,jr=new WeakMap;function Mr(e){return Object.keys(e).some(e=>e.startsWith(`__reactFiber$`)||e.startsWith(`__reactInternalInstance$`)||e.startsWith(`__reactProps$`))}function Nr(){if(Ar!==null)return Ar;if(typeof document>`u`)return!1;if(document.body&&Mr(document.body))return Ar=!0,!0;for(let e of[`#root`,`#app`,`#__next`,`[data-reactroot]`]){let t=document.querySelector(e);if(t&&Mr(t))return Ar=!0,!0}if(document.body){for(let e of document.body.children)if(Mr(e))return Ar=!0,!0}return Ar=!1,!1}var Pr={map:jr};function Fr(e){return Object.keys(e).find(e=>e.startsWith(`__reactFiber$`)||e.startsWith(`__reactInternalInstance$`))||null}function Ir(e){let t=Fr(e);return t?e[t]:null}function Lr(e){return e?e.displayName?e.displayName:e.name?e.name:null:null}function Rr(e){let{tag:t,type:n,elementType:r}=e;if(t===Y.HostComponent||t===Y.HostText||t===Y.HostHoistable||t===Y.HostSingleton||t===Y.Fragment||t===Y.Mode||t===Y.Profiler||t===Y.DehydratedFragment||t===Y.HostRoot||t===Y.HostPortal||t===Y.ScopeComponent||t===Y.OffscreenComponent||t===Y.LegacyHiddenComponent||t===Y.CacheComponent||t===Y.TracingMarkerComponent||t===Y.Throw||t===Y.ViewTransitionComponent||t===Y.ActivityComponent)return null;if(t===Y.ForwardRef){let e=r;if(e?.render){let t=Lr(e.render);if(t)return t}return e?.displayName?e.displayName:Lr(n)}if(t===Y.MemoComponent||t===Y.SimpleMemoComponent){let e=r;if(e?.type){let t=Lr(e.type);if(t)return t}return e?.displayName?e.displayName:Lr(n)}if(t===Y.ContextProvider){let e=n;return e?._context?.displayName?`${e._context.displayName}.Provider`:null}if(t===Y.ContextConsumer){let e=n;return e?.displayName?`${e.displayName}.Consumer`:null}if(t===Y.LazyComponent){let e=r;return e?._status===1&&e._result?Lr(e._result):null}return t===Y.SuspenseComponent||t===Y.SuspenseListComponent?null:t===Y.IncompleteClassComponent||t===Y.IncompleteFunctionComponent||t===Y.FunctionComponent||t===Y.ClassComponent||t===Y.IndeterminateComponent?Lr(n):null}function zr(e){return e.length<=2||e.length<=3&&e===e.toLowerCase()}function Br(e,t){let n=X(t),r=n.mode===`all`;if(r){let t=Pr.map.get(e);if(t!==void 0)return t}if(!Nr()){let t={path:null,components:[]};return r&&Pr.map.set(e,t),t}let i=n.mode===`smart`?Dr(e):void 0,a=[];try{let t=Ir(e),r=0;for(;t&&r<n.maxDepth&&a.length<n.maxComponents;){let e=Rr(t);e&&!zr(e)&&kr(e,r,n,i)&&a.push(e),t=t.return,r++}}catch{let t={path:null,components:[]};return r&&Pr.map.set(e,t),t}if(a.length===0){let t={path:null,components:[]};return r&&Pr.map.set(e,t),t}let o={path:a.slice().reverse().map(e=>`<${e}>`).join(` `),components:a};return r&&Pr.map.set(e,o),o}var Vr={FunctionComponent:0,ClassComponent:1,IndeterminateComponent:2,HostRoot:3,HostPortal:4,HostComponent:5,HostText:6,Fragment:7,Mode:8,ContextConsumer:9,ContextProvider:10,ForwardRef:11,Profiler:12,SuspenseComponent:13,MemoComponent:14,SimpleMemoComponent:15,LazyComponent:16};function Hr(e){if(!e||typeof e!=`object`)return null;let t=Object.keys(e),n=t.find(e=>e.startsWith(`__reactFiber$`));if(n)return e[n]||null;let r=t.find(e=>e.startsWith(`__reactInternalInstance$`));if(r)return e[r]||null;let i=t.find(t=>{if(!t.startsWith(`__react`))return!1;let n=e[t];return n&&typeof n==`object`&&`_debugSource`in n});return i&&e[i]||null}function Ur(e){if(!e.type||typeof e.type==`string`)return null;if(typeof e.type==`object`||typeof e.type==`function`){let t=e.type;if(t.displayName)return t.displayName;if(t.name)return t.name}return null}function Wr(e,t=50){let n=e,r=0;for(;n&&r<t;){if(n._debugSource)return{source:n._debugSource,componentName:Ur(n)};if(n._debugOwner?._debugSource)return{source:n._debugOwner._debugSource,componentName:Ur(n._debugOwner)};n=n.return,r++}return null}function Gr(e){let t=e,n=0;for(;t&&n<50;){let e=t;for(let n of[`_debugSource`,`__source`,`_source`,`debugSource`]){let r=e[n];if(r&&typeof r==`object`&&`fileName`in r)return{source:r,componentName:Ur(t)}}if(t.memoizedProps){let e=t.memoizedProps;if(e.__source&&typeof e.__source==`object`){let n=e.__source;if(n.fileName&&n.lineNumber)return{source:{fileName:n.fileName,lineNumber:n.lineNumber,columnNumber:n.columnNumber},componentName:Ur(t)}}}t=t.return,n++}return null}var Kr=new Map;function qr(e){let t=e.tag,n=e.type,r=e.elementType;if(typeof n==`string`||n==null||typeof n==`function`&&n.prototype?.isReactComponent)return null;if((t===Vr.FunctionComponent||t===Vr.IndeterminateComponent)&&typeof n==`function`)return n;if(t===Vr.ForwardRef&&r){let e=r.render;if(typeof e==`function`)return e}if((t===Vr.MemoComponent||t===Vr.SimpleMemoComponent)&&r){let e=r.type;if(typeof e==`function`)return e}return typeof n==`function`?n:null}function Jr(){let e=c.default,t=e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;if(t&&`H`in t)return{get:()=>t.H,set:e=>{t.H=e}};let n=e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;if(n){let e=n.ReactCurrentDispatcher;if(e&&`current`in e)return{get:()=>e.current,set:t=>{e.current=t}}}return null}function Yr(e){let t=e.split(`
`),n=[/source-location/,/\/dist\/index\./,/node_modules\//,/react-dom/,/react\.development/,/react\.production/,/chunk-[A-Z0-9]+/i,/react-stack-bottom-frame/,/react-reconciler/,/scheduler/,/<anonymous>/],r=/^\s*at\s+(?:.*?\s+\()?(.+?):(\d+):(\d+)\)?$/,i=/^[^@]*@(.+?):(\d+):(\d+)$/;for(let e of t){let t=e.trim();if(!t||n.some(e=>e.test(t)))continue;let a=r.exec(t)||i.exec(t);if(a)return{fileName:a[1],line:parseInt(a[2],10),column:parseInt(a[3],10)}}return null}function Xr(e){let t=e;return t=t.replace(/[?#].*$/,``),t=t.replace(/^turbopack:\/\/\/\[project\]\//,``),t=t.replace(/^webpack-internal:\/\/\/\.\//,``),t=t.replace(/^webpack-internal:\/\/\//,``),t=t.replace(/^webpack:\/\/\/\.\//,``),t=t.replace(/^webpack:\/\/\//,``),t=t.replace(/^turbopack:\/\/\//,``),t=t.replace(/^https?:\/\/[^/]+\//,``),t=t.replace(/^file:\/\/\//,`/`),t=t.replace(/^\([^)]+\)\/\.\//,``),t=t.replace(/^\.\//,``),t}function Zr(e){let t=qr(e);if(!t)return null;if(Kr.has(t))return Kr.get(t);let n=Jr();if(!n)return Kr.set(t,null),null;let r=n.get(),i=null;try{let r=new Proxy({},{get(){throw Error(`probe`)}});n.set(r);try{t({})}catch(t){if(t instanceof Error&&t.message===`probe`&&t.stack){let n=Yr(t.stack);n&&(i={fileName:Xr(n.fileName),lineNumber:n.line,columnNumber:n.column,componentName:Ur(e)||void 0})}}}finally{n.set(r)}return Kr.set(t,i),i}function Qr(e,t=15){let n=e,r=0;for(;n&&r<t;){let e=Zr(n);if(e)return e;n=n.return,r++}return null}function $r(e){let t=Hr(e);if(!t)return{found:!1,reason:`no-fiber`,isReactApp:!1,isProduction:!1};let n=Wr(t);if(n||=Gr(t),n?.source)return{found:!0,source:{fileName:n.source.fileName,lineNumber:n.source.lineNumber,columnNumber:n.source.columnNumber,componentName:n.componentName||void 0},isReactApp:!0,isProduction:!1};let r=Qr(t);return r?{found:!0,source:r,isReactApp:!0,isProduction:!1}:{found:!1,reason:`no-debug-source`,isReactApp:!0,isProduction:!1}}function ei(e,t=`path`){let{fileName:n,lineNumber:r,columnNumber:i}=e,a=`${n}:${r}`;return i!==void 0&&(a+=`:${i}`),t===`vscode`?`vscode://file${n.startsWith(`/`)?``:`/`}${a}`:a}function ti(e,t=10){let n=e,r=0;for(;n&&r<t;){let e=$r(n);if(e.found)return e;n=n.parentElement,r++}return $r(e)}var ni=`.styles-module__toolbar___wNsdK svg[fill=none],
.styles-module__markersLayer___-25j1 svg[fill=none],
.styles-module__fixedMarkersLayer___ffyX6 svg[fill=none] {
  fill: none !important;
}
.styles-module__toolbar___wNsdK svg[fill=none] :not([fill]),
.styles-module__markersLayer___-25j1 svg[fill=none] :not([fill]),
.styles-module__fixedMarkersLayer___ffyX6 svg[fill=none] :not([fill]) {
  fill: none !important;
}

.styles-module__controlsContent___9GJWU :where(button, input, select, textarea, label) {
  background: unset;
  border: unset;
  border-radius: unset;
  padding: unset;
  margin: unset;
  color: unset;
  font-family: unset;
  font-weight: unset;
  font-style: unset;
  line-height: unset;
  letter-spacing: unset;
  text-transform: unset;
  text-decoration: unset;
  box-shadow: unset;
  outline: unset;
}

@keyframes styles-module__toolbarEnter___u8RRu {
  from {
    opacity: 0;
    transform: scale(0.5) rotate(90deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}
@keyframes styles-module__toolbarHide___y8kaT {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.8);
  }
}
@keyframes styles-module__badgeEnter___mVQLj {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__scaleIn___c-r1K {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__scaleOut___Wctwz {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.85);
  }
}
@keyframes styles-module__slideUp___kgD36 {
  from {
    opacity: 0;
    transform: scale(0.85) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
@keyframes styles-module__slideDown___zcdje {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.85) translateY(8px);
  }
}
@keyframes styles-module__fadeIn___b9qmf {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes styles-module__fadeOut___6Ut6- {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes styles-module__hoverHighlightIn___6WYHY {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__hoverTooltipIn___FYGQx {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
.styles-module__disableTransitions___EopxO :is(*, *::before, *::after) {
  transition: none !important;
}

.styles-module__toolbar___wNsdK {
  position: fixed;
  bottom: 1.25rem;
  right: 1.25rem;
  width: 337px;
  z-index: 100000;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  pointer-events: none;
  transition: left 0s, top 0s, right 0s, bottom 0s;
}

:where(.styles-module__toolbar___wNsdK) {
  bottom: 1.25rem;
  right: 1.25rem;
}

.styles-module__toolbarContainer___dIhma {
  position: relative;
  user-select: none;
  margin-left: auto;
  align-self: flex-end;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
  color: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
  transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1), transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__toolbarContainer___dIhma.styles-module__entrance___sgHd8 {
  animation: styles-module__toolbarEnter___u8RRu 0.5s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
}
.styles-module__toolbarContainer___dIhma.styles-module__hiding___1td44 {
  animation: styles-module__toolbarHide___y8kaT 0.4s cubic-bezier(0.4, 0, 1, 1) forwards;
  pointer-events: none;
}
.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  padding: 0;
  cursor: pointer;
}
.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn svg {
  margin-top: -1px;
}
.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn:hover {
  background: #2a2a2a;
}
.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn:active {
  transform: scale(0.95);
}
.styles-module__toolbarContainer___dIhma.styles-module__expanded___ofKPx {
  height: 44px;
  border-radius: 1.5rem;
  padding: 0.375rem;
  width: 297px;
}
.styles-module__toolbarContainer___dIhma.styles-module__expanded___ofKPx.styles-module__serverConnected___Gfbou {
  width: 337px;
}

.styles-module__toggleContent___0yfyP {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.1s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__toggleContent___0yfyP.styles-module__visible___KHwEW {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}
.styles-module__toggleContent___0yfyP.styles-module__hidden___Ae8H4 {
  opacity: 0;
  pointer-events: none;
}

.styles-module__controlsContent___9GJWU {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: filter 0.8s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1), transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__controlsContent___9GJWU.styles-module__visible___KHwEW {
  opacity: 1;
  filter: blur(0px);
  transform: scale(1);
  visibility: visible;
  pointer-events: auto;
}
.styles-module__controlsContent___9GJWU.styles-module__hidden___Ae8H4 {
  pointer-events: none;
  opacity: 0;
  filter: blur(10px);
  transform: scale(0.4);
}

.styles-module__badge___2XsgF {
  position: absolute;
  top: -13px;
  right: -13px;
  user-select: none;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background-color: var(--agentation-color-accent);
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.04);
  opacity: 1;
  transition: transform 0.3s ease, opacity 0.2s ease;
  transform: scale(1);
}
.styles-module__badge___2XsgF.styles-module__fadeOut___6Ut6- {
  opacity: 0;
  transform: scale(0);
  pointer-events: none;
}
.styles-module__badge___2XsgF.styles-module__entrance___sgHd8 {
  animation: styles-module__badgeEnter___mVQLj 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) 0.4s both;
}

.styles-module__controlButton___8Q0jc {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease, opacity 0.2s ease;
}
.styles-module__controlButton___8Q0jc:hover:not(:disabled):not([data-active=true]):not([data-failed=true]):not([data-auto-sync=true]):not([data-error=true]):not([data-no-hover=true]) {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}
.styles-module__controlButton___8Q0jc:active:not(:disabled) {
  transform: scale(0.92);
}
.styles-module__controlButton___8Q0jc:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.styles-module__controlButton___8Q0jc[data-active=true] {
  color: var(--agentation-color-blue);
  background-color: color-mix(in srgb, var(--agentation-color-blue) 25%, transparent);
}
.styles-module__controlButton___8Q0jc[data-error=true] {
  color: var(--agentation-color-red);
  background-color: color-mix(in srgb, var(--agentation-color-red) 25%, transparent);
}
.styles-module__controlButton___8Q0jc[data-danger]:hover:not(:disabled):not([data-active=true]):not([data-failed=true]) {
  background-color: color-mix(in srgb, var(--agentation-color-red) 25%, transparent);
  color: var(--agentation-color-red);
}
.styles-module__controlButton___8Q0jc[data-no-hover=true], .styles-module__controlButton___8Q0jc.styles-module__statusShowing___te6iu {
  cursor: default;
  pointer-events: none;
  background: transparent !important;
}
.styles-module__controlButton___8Q0jc[data-auto-sync=true] {
  color: var(--agentation-color-green);
  background: transparent;
  cursor: default;
}
.styles-module__controlButton___8Q0jc[data-failed=true] {
  color: var(--agentation-color-red);
  background-color: color-mix(in srgb, var(--agentation-color-red) 25%, transparent);
}

.styles-module__buttonBadge___NeFWb {
  position: absolute;
  top: 0px;
  right: 0px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background-color: var(--agentation-color-accent);
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 2px #1a1a1a, 0 1px 3px rgba(0, 0, 0, 0.2);
  pointer-events: none;
}
[data-agentation-theme=light] .styles-module__buttonBadge___NeFWb {
  box-shadow: 0 0 0 2px #fff, 0 1px 3px rgba(0, 0, 0, 0.2);
}

@keyframes styles-module__mcpIndicatorPulseConnected___EDodZ {
  0%, 100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-green) 50%, transparent);
  }
  50% {
    box-shadow: 0 0 0 5px color-mix(in srgb, var(--agentation-color-green) 0%, transparent);
  }
}
@keyframes styles-module__mcpIndicatorPulseConnecting___cCYte {
  0%, 100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-yellow) 50%, transparent);
  }
  50% {
    box-shadow: 0 0 0 5px color-mix(in srgb, var(--agentation-color-yellow) 0%, transparent);
  }
}
.styles-module__mcpIndicator___zGJeL {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  pointer-events: none;
  transition: background-color 0.3s ease, opacity 0.15s ease, transform 0.15s ease;
  opacity: 1;
  transform: scale(1);
}
.styles-module__mcpIndicator___zGJeL.styles-module__connected___7c28g {
  background-color: var(--agentation-color-green);
  animation: styles-module__mcpIndicatorPulseConnected___EDodZ 2.5s ease-in-out infinite;
}
.styles-module__mcpIndicator___zGJeL.styles-module__connecting___uo-CW {
  background-color: var(--agentation-color-yellow);
  animation: styles-module__mcpIndicatorPulseConnecting___cCYte 1.5s ease-in-out infinite;
}
.styles-module__mcpIndicator___zGJeL.styles-module__hidden___Ae8H4 {
  opacity: 0;
  transform: scale(0);
  animation: none;
}

@keyframes styles-module__connectionPulse___-Zycw {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(0.9);
  }
}
.styles-module__connectionIndicatorWrapper___L-e-3 {
  width: 8px;
  height: 34px;
  margin-left: 6px;
  margin-right: 6px;
}

.styles-module__connectionIndicator___afk9p {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease, background-color 0.3s ease;
  cursor: default;
}

.styles-module__connectionIndicatorVisible___C-i5B {
  opacity: 1;
}

.styles-module__connectionIndicatorConnected___IY8pR {
  background-color: var(--agentation-color-green);
  animation: styles-module__connectionPulse___-Zycw 2.5s ease-in-out infinite;
}

.styles-module__connectionIndicatorDisconnected___kmpaZ {
  background-color: var(--agentation-color-red);
  animation: none;
}

.styles-module__connectionIndicatorConnecting___QmSLH {
  background-color: var(--agentation-color-yellow);
  animation: styles-module__connectionPulse___-Zycw 1s ease-in-out infinite;
}

.styles-module__buttonWrapper___rBcdv {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.styles-module__buttonWrapper___rBcdv:hover .styles-module__buttonTooltip___Burd9 {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) scale(1);
  transition-delay: 0.85s;
}
.styles-module__buttonWrapper___rBcdv:has(.styles-module__controlButton___8Q0jc:disabled):hover .styles-module__buttonTooltip___Burd9 {
  opacity: 0;
  visibility: hidden;
}

.styles-module__tooltipsInSession___-0lHH .styles-module__buttonWrapper___rBcdv:hover .styles-module__buttonTooltip___Burd9 {
  transition-delay: 0s;
}

.styles-module__sendButtonWrapper___UUxG6 {
  width: 0;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
  margin-left: -0.375rem;
  transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.3s cubic-bezier(0.19, 1, 0.22, 1), margin 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__sendButtonWrapper___UUxG6 .styles-module__controlButton___8Q0jc {
  transform: scale(0.8);
  transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__sendButtonWrapper___UUxG6.styles-module__sendButtonVisible___WPSQU {
  width: 34px;
  opacity: 1;
  overflow: visible;
  pointer-events: auto;
  margin-left: 0;
}
.styles-module__sendButtonWrapper___UUxG6.styles-module__sendButtonVisible___WPSQU .styles-module__controlButton___8Q0jc {
  transform: scale(1);
}

.styles-module__buttonTooltip___Burd9 {
  position: absolute;
  bottom: calc(100% + 14px);
  left: 50%;
  transform: translateX(-50%) scale(0.95);
  padding: 6px 10px;
  background: #1a1a1a;
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  z-index: 100001;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: opacity 0.135s ease, transform 0.135s ease, visibility 0.135s ease;
}
.styles-module__buttonTooltip___Burd9::after {
  content: "";
  position: absolute;
  top: calc(100% - 4px);
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 8px;
  height: 8px;
  background: #1a1a1a;
  border-radius: 0 0 2px 0;
}

.styles-module__shortcut___lEAQk {
  margin-left: 4px;
  opacity: 0.5;
}

.styles-module__tooltipBelow___m6ats .styles-module__buttonTooltip___Burd9 {
  bottom: auto;
  top: calc(100% + 14px);
  transform: translateX(-50%) scale(0.95);
}
.styles-module__tooltipBelow___m6ats .styles-module__buttonTooltip___Burd9::after {
  top: -4px;
  bottom: auto;
  border-radius: 2px 0 0 0;
}

.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapper___rBcdv:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(-50%) scale(1);
}

.styles-module__tooltipsHidden___VtLJG .styles-module__buttonTooltip___Burd9 {
  opacity: 0 !important;
  visibility: hidden !important;
  transition: none !important;
}

.styles-module__tooltipVisible___0jcCv,
.styles-module__tooltipsHidden___VtLJG .styles-module__tooltipVisible___0jcCv {
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateX(-50%) scale(1) !important;
  transition-delay: 0s !important;
}

.styles-module__buttonWrapperAlignLeft___myzIp .styles-module__buttonTooltip___Burd9 {
  left: 50%;
  transform: translateX(-12px) scale(0.95);
}
.styles-module__buttonWrapperAlignLeft___myzIp .styles-module__buttonTooltip___Burd9::after {
  left: 16px;
}
.styles-module__buttonWrapperAlignLeft___myzIp:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(-12px) scale(1);
}

.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignLeft___myzIp .styles-module__buttonTooltip___Burd9 {
  transform: translateX(-12px) scale(0.95);
}
.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignLeft___myzIp:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(-12px) scale(1);
}

.styles-module__buttonWrapperAlignRight___HCQFR .styles-module__buttonTooltip___Burd9 {
  left: 50%;
  transform: translateX(calc(-100% + 12px)) scale(0.95);
}
.styles-module__buttonWrapperAlignRight___HCQFR .styles-module__buttonTooltip___Burd9::after {
  left: auto;
  right: 8px;
}
.styles-module__buttonWrapperAlignRight___HCQFR:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(calc(-100% + 12px)) scale(1);
}

.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignRight___HCQFR .styles-module__buttonTooltip___Burd9 {
  transform: translateX(calc(-100% + 12px)) scale(0.95);
}
.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignRight___HCQFR:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(calc(-100% + 12px)) scale(1);
}

.styles-module__divider___c--s1 {
  width: 1px;
  height: 12px;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 0.125rem;
}

.styles-module__overlay___Q1O9y {
  position: fixed;
  inset: 0;
  z-index: 99997;
  pointer-events: none;
}
.styles-module__overlay___Q1O9y > * {
  pointer-events: auto;
}

.styles-module__hoverHighlight___ogakW {
  position: fixed;
  border: 2px solid color-mix(in srgb, var(--agentation-color-accent) 50%, transparent);
  border-radius: 4px;
  background-color: color-mix(in srgb, var(--agentation-color-accent) 4%, transparent);
  pointer-events: none !important;
  box-sizing: border-box;
  will-change: opacity;
  contain: layout style;
}
.styles-module__hoverHighlight___ogakW.styles-module__enter___WFIki {
  animation: styles-module__hoverHighlightIn___6WYHY 0.12s ease-out forwards;
}

.styles-module__multiSelectOutline___cSJ-m {
  position: fixed;
  border: 2px dashed color-mix(in srgb, var(--agentation-color-green) 60%, transparent);
  border-radius: 4px;
  pointer-events: none !important;
  background-color: color-mix(in srgb, var(--agentation-color-green) 5%, transparent);
  box-sizing: border-box;
  will-change: opacity;
}
.styles-module__multiSelectOutline___cSJ-m.styles-module__enter___WFIki {
  animation: styles-module__fadeIn___b9qmf 0.15s ease-out forwards;
}
.styles-module__multiSelectOutline___cSJ-m.styles-module__exit___fyOJ0 {
  animation: styles-module__fadeOut___6Ut6- 0.15s ease-out forwards;
}

.styles-module__singleSelectOutline___QhX-O {
  position: fixed;
  border: 2px solid color-mix(in srgb, var(--agentation-color-blue) 60%, transparent);
  border-radius: 4px;
  pointer-events: none !important;
  background-color: color-mix(in srgb, var(--agentation-color-blue) 5%, transparent);
  box-sizing: border-box;
  will-change: opacity;
}
.styles-module__singleSelectOutline___QhX-O.styles-module__enter___WFIki {
  animation: styles-module__fadeIn___b9qmf 0.15s ease-out forwards;
}
.styles-module__singleSelectOutline___QhX-O.styles-module__exit___fyOJ0 {
  animation: styles-module__fadeOut___6Ut6- 0.15s ease-out forwards;
}

.styles-module__hoverTooltip___bvLk7 {
  position: fixed;
  font-size: 0.6875rem;
  font-weight: 500;
  color: #fff;
  background: rgba(0, 0, 0, 0.85);
  padding: 0.35rem 0.6rem;
  border-radius: 0.375rem;
  pointer-events: none !important;
  white-space: nowrap;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.styles-module__hoverTooltip___bvLk7.styles-module__enter___WFIki {
  animation: styles-module__hoverTooltipIn___FYGQx 0.1s ease-out forwards;
}

.styles-module__hoverReactPath___gx1IJ {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.15rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.styles-module__hoverElementName___QMLMl {
  overflow: hidden;
  text-overflow: ellipsis;
}

.styles-module__markersLayer___-25j1 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0;
  z-index: 99998;
  pointer-events: none;
}
.styles-module__markersLayer___-25j1 > * {
  pointer-events: auto;
}

.styles-module__fixedMarkersLayer___ffyX6 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99998;
  pointer-events: none;
}
.styles-module__fixedMarkersLayer___ffyX6 > * {
  pointer-events: auto;
}

.styles-module__marker___6sQrs {
  position: absolute;
  width: 22px;
  height: 22px;
  background: var(--agentation-color-blue);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 600;
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(0, 0, 0, 0.04);
  user-select: none;
  will-change: transform, opacity;
  contain: layout style;
  z-index: 1;
}
.styles-module__marker___6sQrs:hover {
  z-index: 2;
}
.styles-module__marker___6sQrs:not(.styles-module__enter___WFIki):not(.styles-module__exit___fyOJ0):not(.styles-module__clearing___FQ--7) {
  transition: background-color 0.15s ease, transform 0.1s ease;
}
.styles-module__marker___6sQrs.styles-module__enter___WFIki {
  animation: styles-module__markerIn___5FaAP 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.styles-module__marker___6sQrs.styles-module__exit___fyOJ0 {
  animation: styles-module__markerOut___GU5jX 0.2s ease-out both;
  pointer-events: none;
}
.styles-module__marker___6sQrs.styles-module__clearing___FQ--7 {
  animation: styles-module__markerOut___GU5jX 0.15s ease-out both;
  pointer-events: none;
}
.styles-module__marker___6sQrs:not(.styles-module__enter___WFIki):not(.styles-module__exit___fyOJ0):not(.styles-module__clearing___FQ--7):hover {
  transform: translate(-50%, -50%) scale(1.1);
}
.styles-module__marker___6sQrs.styles-module__pending___2IHLC {
  position: fixed;
  background-color: var(--agentation-color-blue);
  cursor: default;
}
.styles-module__marker___6sQrs.styles-module__fixed___dBMHC {
  position: fixed;
}
.styles-module__marker___6sQrs.styles-module__multiSelect___YWiuz {
  background-color: var(--agentation-color-green);
  width: 26px;
  height: 26px;
  border-radius: 6px;
  font-size: 0.75rem;
}
.styles-module__marker___6sQrs.styles-module__multiSelect___YWiuz.styles-module__pending___2IHLC {
  background-color: var(--agentation-color-green);
}
.styles-module__marker___6sQrs.styles-module__hovered___ZgXIy {
  background-color: var(--agentation-color-red);
}

.styles-module__renumber___nCTxD {
  display: block;
  animation: styles-module__renumberRoll___Wgbq3 0.2s ease-out;
}

@keyframes styles-module__renumberRoll___Wgbq3 {
  0% {
    transform: translateX(-40%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
.styles-module__markerTooltip___aLJID {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) scale(0.909);
  z-index: 100002;
  background: #1a1a1a;
  padding: 8px 0.75rem;
  border-radius: 0.75rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-weight: 400;
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
  min-width: 120px;
  max-width: 200px;
  pointer-events: none;
  cursor: default;
}
.styles-module__markerTooltip___aLJID.styles-module__enter___WFIki {
  animation: styles-module__tooltipIn___0N31w 0.1s ease-out forwards;
}

.styles-module__markerQuote___FHmrz {
  display: block;
  font-size: 12px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.3125rem;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.styles-module__markerNote___QkrrS {
  display: block;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.4;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-bottom: 2px;
}

.styles-module__markerHint___2iF-6 {
  display: block;
  font-size: 0.625rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.375rem;
  white-space: nowrap;
}

.styles-module__settingsPanel___OxX3Y {
  position: absolute;
  right: 5px;
  bottom: calc(100% + 0.5rem);
  z-index: 1;
  overflow: hidden;
  background: #1c1c1c;
  border-radius: 1rem;
  padding: 13px 0 16px;
  min-width: 205px;
  cursor: default;
  opacity: 1;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.04);
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
}
.styles-module__settingsPanel___OxX3Y::before, .styles-module__settingsPanel___OxX3Y::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 16px;
  z-index: 2;
  pointer-events: none;
}
.styles-module__settingsPanel___OxX3Y::before {
  left: 0;
  background: linear-gradient(to right, #1c1c1c 0%, transparent 100%);
}
.styles-module__settingsPanel___OxX3Y::after {
  right: 0;
  background: linear-gradient(to left, #1c1c1c 0%, transparent 100%);
}
.styles-module__settingsPanel___OxX3Y .styles-module__settingsHeader___pwDY9,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsBrand___0gJeM,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsBrandSlash___uTG18,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsVersion___TUcFq,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsSection___m-YM2,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsLabel___8UjfX,
.styles-module__settingsPanel___OxX3Y .styles-module__cycleButton___FMKfw,
.styles-module__settingsPanel___OxX3Y .styles-module__cycleDot___nPgLY,
.styles-module__settingsPanel___OxX3Y .styles-module__dropdownButton___16NPz,
.styles-module__settingsPanel___OxX3Y .styles-module__toggleLabel___Xm8Aa,
.styles-module__settingsPanel___OxX3Y .styles-module__customCheckbox___U39ax,
.styles-module__settingsPanel___OxX3Y .styles-module__sliderLabel___U8sPr,
.styles-module__settingsPanel___OxX3Y .styles-module__slider___GLdxp,
.styles-module__settingsPanel___OxX3Y .styles-module__themeToggle___2rUjA {
  transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}
.styles-module__settingsPanel___OxX3Y.styles-module__enter___WFIki {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0px);
  transition: opacity 0.2s ease, transform 0.2s ease, filter 0.2s ease;
}
.styles-module__settingsPanel___OxX3Y.styles-module__exit___fyOJ0 {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
  filter: blur(5px);
  pointer-events: none;
  transition: opacity 0.1s ease, transform 0.1s ease, filter 0.1s ease;
}
[data-agentation-theme=dark] .styles-module__settingsPanel___OxX3Y {
  background: #1a1a1a;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
}
[data-agentation-theme=dark] .styles-module__settingsPanel___OxX3Y .styles-module__settingsLabel___8UjfX {
  color: rgba(255, 255, 255, 0.6);
}
[data-agentation-theme=dark] .styles-module__settingsPanel___OxX3Y .styles-module__settingsOption___UNa12 {
  color: rgba(255, 255, 255, 0.85);
}
[data-agentation-theme=dark] .styles-module__settingsPanel___OxX3Y .styles-module__settingsOption___UNa12:hover {
  background: rgba(255, 255, 255, 0.1);
}
[data-agentation-theme=dark] .styles-module__settingsPanel___OxX3Y .styles-module__settingsOption___UNa12.styles-module__selected___OwRqP {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}
[data-agentation-theme=dark] .styles-module__settingsPanel___OxX3Y .styles-module__toggleLabel___Xm8Aa {
  color: rgba(255, 255, 255, 0.85);
}

.styles-module__settingsPanelContainer___Xksv8 {
  overflow: visible;
  position: relative;
  display: flex;
  padding: 0 1rem;
}

.styles-module__settingsPage___6YfHH {
  min-width: 100%;
  flex-shrink: 0;
  transition: transform 0.2s ease, opacity 0.2s ease;
  transition-delay: 0s;
  opacity: 1;
}

.styles-module__settingsPage___6YfHH.styles-module__slideLeft___Ps01J {
  transform: translateX(-24px);
  opacity: 0;
  pointer-events: none;
}

.styles-module__automationsPage___uvCq6 {
  position: absolute;
  top: 0;
  left: 24px;
  width: 100%;
  height: 100%;
  padding: 3px 1rem 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, opacity 0.2s ease;
  opacity: 0;
  pointer-events: none;
}

.styles-module__automationsPage___uvCq6.styles-module__slideIn___4-qXe {
  transform: translateX(-24px);
  opacity: 1;
  pointer-events: auto;
}

.styles-module__settingsNavLink___wCzJt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: color 0.15s ease;
}
.styles-module__settingsNavLink___wCzJt:hover {
  color: rgba(255, 255, 255, 0.9);
}
[data-agentation-theme=light] .styles-module__settingsNavLink___wCzJt {
  color: rgba(0, 0, 0, 0.5);
}
[data-agentation-theme=light] .styles-module__settingsNavLink___wCzJt:hover {
  color: rgba(0, 0, 0, 0.8);
}
.styles-module__settingsNavLink___wCzJt svg {
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.15s ease;
}
.styles-module__settingsNavLink___wCzJt:hover svg {
  color: #fff;
}
[data-agentation-theme=light] .styles-module__settingsNavLink___wCzJt svg {
  color: rgba(0, 0, 0, 0.25);
}
[data-agentation-theme=light] .styles-module__settingsNavLink___wCzJt:hover svg {
  color: rgba(0, 0, 0, 0.8);
}

.styles-module__settingsNavLinkRight___ZWwhj {
  display: flex;
  align-items: center;
  gap: 6px;
}

.styles-module__mcpNavIndicator___cl9pO {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.styles-module__mcpNavIndicator___cl9pO.styles-module__connected___7c28g {
  background-color: var(--agentation-color-green);
  animation: styles-module__mcpPulse___uNggr 2.5s ease-in-out infinite;
}
.styles-module__mcpNavIndicator___cl9pO.styles-module__connecting___uo-CW {
  background-color: var(--agentation-color-yellow);
  animation: styles-module__mcpPulse___uNggr 1.5s ease-in-out infinite;
}

.styles-module__settingsBackButton___bIe2j {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 0 12px 0;
  margin: -6px 0 0.5rem 0;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 0;
  background: transparent;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: -0.15px;
  color: #fff;
  cursor: pointer;
  transition: transform 0.12s cubic-bezier(0.32, 0.72, 0, 1);
}
.styles-module__settingsBackButton___bIe2j svg {
  opacity: 0.4;
  flex-shrink: 0;
  transition: opacity 0.15s ease, transform 0.18s cubic-bezier(0.32, 0.72, 0, 1);
}
.styles-module__settingsBackButton___bIe2j:hover {
  border-bottom-color: rgba(255, 255, 255, 0.07);
}
.styles-module__settingsBackButton___bIe2j:hover svg {
  opacity: 1;
}
[data-agentation-theme=light] .styles-module__settingsBackButton___bIe2j {
  color: rgba(0, 0, 0, 0.85);
  border-bottom-color: rgba(0, 0, 0, 0.08);
}
[data-agentation-theme=light] .styles-module__settingsBackButton___bIe2j:hover {
  border-bottom-color: rgba(0, 0, 0, 0.08);
}

.styles-module__automationHeader___InP0r {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.8125rem;
  font-weight: 400;
  color: #fff;
}
[data-agentation-theme=light] .styles-module__automationHeader___InP0r {
  color: rgba(0, 0, 0, 0.85);
}

.styles-module__automationDescription___NKlmo {
  font-size: 0.6875rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2px;
  line-height: 14px;
}
[data-agentation-theme=light] .styles-module__automationDescription___NKlmo {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__learnMoreLink___8xv-x {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: underline dotted;
  text-decoration-color: rgba(255, 255, 255, 0.2);
  text-underline-offset: 2px;
  transition: color 0.15s ease;
}
.styles-module__learnMoreLink___8xv-x:hover {
  color: #fff;
}
[data-agentation-theme=light] .styles-module__learnMoreLink___8xv-x {
  color: rgba(0, 0, 0, 0.6);
  text-decoration-color: rgba(0, 0, 0, 0.2);
}
[data-agentation-theme=light] .styles-module__learnMoreLink___8xv-x:hover {
  color: rgba(0, 0, 0, 0.85);
}

.styles-module__autoSendRow___UblX5 {
  display: flex;
  align-items: center;
  gap: 8px;
}

.styles-module__autoSendLabel___icDc2 {
  font-size: 0.6875rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.15s ease;
}
.styles-module__autoSendLabel___icDc2.styles-module__active___-zoN6 {
  color: #66b8ff;
  color: color(display-p3 0.4 0.72 1);
}
[data-agentation-theme=light] .styles-module__autoSendLabel___icDc2 {
  color: rgba(0, 0, 0, 0.4);
}
[data-agentation-theme=light] .styles-module__autoSendLabel___icDc2.styles-module__active___-zoN6 {
  color: var(--agentation-color-blue);
}

.styles-module__webhookUrlInput___2375C {
  display: block;
  width: 100%;
  flex: 1;
  min-height: 60px;
  box-sizing: border-box;
  margin-top: 11px;
  padding: 8px 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.03);
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 400;
  color: #fff;
  outline: none;
  resize: none;
  user-select: text;
  transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
}
.styles-module__webhookUrlInput___2375C::placeholder {
  color: rgba(255, 255, 255, 0.3);
}
.styles-module__webhookUrlInput___2375C:focus {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.08);
}
[data-agentation-theme=light] .styles-module__webhookUrlInput___2375C {
  border-color: rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.03);
  color: rgba(0, 0, 0, 0.85);
}
[data-agentation-theme=light] .styles-module__webhookUrlInput___2375C::placeholder {
  color: rgba(0, 0, 0, 0.3);
}
[data-agentation-theme=light] .styles-module__webhookUrlInput___2375C:focus {
  border-color: rgba(0, 0, 0, 0.25);
  background: rgba(0, 0, 0, 0.05);
}

.styles-module__settingsHeader___pwDY9 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
  margin-bottom: 0.5rem;
  padding-bottom: 9px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.styles-module__settingsBrand___0gJeM {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: -0.0094em;
  color: #fff;
  text-decoration: none;
}

.styles-module__settingsBrandSlash___uTG18 {
  color: var(--agentation-color-accent);
  transition: color 0.2s ease;
}

.styles-module__settingsVersion___TUcFq {
  font-size: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
  margin-left: auto;
  letter-spacing: -0.0094em;
}

.styles-module__settingsSection___m-YM2 + .styles-module__settingsSection___m-YM2 {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}
.styles-module__settingsSection___m-YM2.styles-module__settingsSectionExtraPadding___jdhFV {
  padding-top: calc(0.5rem + 4px);
}

.styles-module__settingsSectionGrow___h-5HZ {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.styles-module__settingsRow___3sdhc {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
}
.styles-module__settingsRow___3sdhc.styles-module__settingsRowMarginTop___zA0Sp {
  margin-top: 8px;
}

.styles-module__dropdownContainer___BVnxe {
  position: relative;
}

.styles-module__dropdownButton___16NPz {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
  letter-spacing: -0.0094em;
}
.styles-module__dropdownButton___16NPz:hover {
  background: rgba(255, 255, 255, 0.08);
}
.styles-module__dropdownButton___16NPz svg {
  opacity: 0.6;
}

.styles-module__cycleButton___FMKfw {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  letter-spacing: -0.0094em;
}
[data-agentation-theme=light] .styles-module__cycleButton___FMKfw {
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__cycleButton___FMKfw:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.styles-module__settingsRowDisabled___EgS0V .styles-module__settingsLabel___8UjfX {
  color: rgba(255, 255, 255, 0.2);
}
[data-agentation-theme=light] .styles-module__settingsRowDisabled___EgS0V .styles-module__settingsLabel___8UjfX {
  color: rgba(0, 0, 0, 0.2);
}
.styles-module__settingsRowDisabled___EgS0V .styles-module__toggleSwitch___l4Ygm {
  opacity: 0.4;
  cursor: not-allowed;
}

@keyframes styles-module__cycleTextIn___Q6zJf {
  0% {
    opacity: 0;
    transform: translateY(-6px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.styles-module__cycleButtonText___fD1LR {
  display: inline-block;
  animation: styles-module__cycleTextIn___Q6zJf 0.2s ease-out;
}

.styles-module__cycleDots___LWuoQ {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.styles-module__cycleDot___nPgLY {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.667);
  transition: background-color 0.25s ease-out, transform 0.25s ease-out;
}
.styles-module__cycleDot___nPgLY.styles-module__active___-zoN6 {
  background: #fff;
  transform: scale(1);
}
[data-agentation-theme=light] .styles-module__cycleDot___nPgLY {
  background: rgba(0, 0, 0, 0.2);
}
[data-agentation-theme=light] .styles-module__cycleDot___nPgLY.styles-module__active___-zoN6 {
  background: rgba(0, 0, 0, 0.7);
}

.styles-module__dropdownMenu___k73ER {
  position: absolute;
  right: 0;
  top: calc(100% + 0.25rem);
  background: #1a1a1a;
  border-radius: 0.5rem;
  padding: 0.25rem;
  min-width: 120px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
  z-index: 10;
  animation: styles-module__scaleIn___c-r1K 0.15s ease-out;
}

.styles-module__dropdownItem___ylsLj {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.5rem 0.625rem;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease, color 0.15s ease;
  letter-spacing: -0.0094em;
}
.styles-module__dropdownItem___ylsLj:hover {
  background: rgba(255, 255, 255, 0.08);
}
.styles-module__dropdownItem___ylsLj.styles-module__selected___OwRqP {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-weight: 600;
}

.styles-module__settingsLabel___8UjfX {
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: -0.0094em;
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  gap: 0.125rem;
}
[data-agentation-theme=light] .styles-module__settingsLabel___8UjfX {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__settingsLabelMarker___ewdtV {
  padding-top: 3px;
  margin-bottom: 10px;
}

.styles-module__settingsOptions___LyrBA {
  display: flex;
  gap: 0.25rem;
}

.styles-module__settingsOption___UNa12 {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.375rem 0.5rem;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  font-size: 0.6875rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.styles-module__settingsOption___UNa12:hover {
  background: rgba(0, 0, 0, 0.05);
}
.styles-module__settingsOption___UNa12.styles-module__selected___OwRqP {
  background: color-mix(in srgb, var(--agentation-color-blue) 15%, transparent);
  color: var(--agentation-color-blue);
}

.styles-module__sliderContainer___ducXj {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.styles-module__slider___GLdxp {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}
.styles-module__slider___GLdxp::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
.styles-module__slider___GLdxp::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
.styles-module__slider___GLdxp:hover::-webkit-slider-thumb {
  transform: scale(1.15);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}
.styles-module__slider___GLdxp:hover::-moz-range-thumb {
  transform: scale(1.15);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

.styles-module__sliderLabels___FhLDB {
  display: flex;
  justify-content: space-between;
}

.styles-module__sliderLabel___U8sPr {
  font-size: 0.625rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: color 0.15s ease;
}
.styles-module__sliderLabel___U8sPr:hover {
  color: rgba(255, 255, 255, 0.7);
}
.styles-module__sliderLabel___U8sPr.styles-module__active___-zoN6 {
  color: rgba(255, 255, 255, 0.9);
}

.styles-module__colorOptions___iHCNX {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.375rem;
  margin-bottom: 1px;
}

.styles-module__colorOption___IodiY {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid transparent;
  background-color: var(--swatch);
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
}
@supports (color: color(display-p3 0 0 0)) {
  .styles-module__colorOption___IodiY {
    background-color: var(--swatch-p3);
  }
}
.styles-module__colorOption___IodiY:hover {
  transform: scale(1.15);
}
.styles-module__colorOption___IodiY.styles-module__selected___OwRqP {
  transform: scale(0.83);
}

.styles-module__colorOptionRing___U2xpo {
  display: flex;
  width: 24px;
  height: 24px;
  border: 2px solid transparent;
  border-radius: 50%;
  transition: border-color 0.3s ease;
}
.styles-module__colorOptionRing___U2xpo.styles-module__selected___OwRqP {
  border-color: var(--swatch);
}
@supports (color: color(display-p3 0 0 0)) {
  .styles-module__colorOptionRing___U2xpo.styles-module__selected___OwRqP {
    border-color: var(--swatch-p3);
  }
}

.styles-module__settingsToggle___fBrFn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
.styles-module__settingsToggle___fBrFn + .styles-module__settingsToggle___fBrFn {
  margin-top: calc(0.5rem + 6px);
}
.styles-module__settingsToggle___fBrFn input[type=checkbox] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.styles-module__settingsToggle___fBrFn.styles-module__settingsToggleMarginBottom___MZUyF {
  margin-bottom: calc(0.5rem + 6px);
}

.styles-module__customCheckbox___U39ax {
  position: relative;
  width: 14px;
  height: 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background-color 0.25s ease, border-color 0.25s ease;
}
.styles-module__customCheckbox___U39ax svg {
  color: #1a1a1a;
  opacity: 1;
  transition: opacity 0.15s ease;
}
input[type=checkbox]:checked + .styles-module__customCheckbox___U39ax {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgb(255, 255, 255);
}
[data-agentation-theme=light] .styles-module__customCheckbox___U39ax {
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: #fff;
}
[data-agentation-theme=light] .styles-module__customCheckbox___U39ax.styles-module__checked___mnZLo {
  border-color: #1a1a1a;
  background: #1a1a1a;
}
[data-agentation-theme=light] .styles-module__customCheckbox___U39ax.styles-module__checked___mnZLo svg {
  color: #fff;
}

.styles-module__toggleLabel___Xm8Aa {
  font-size: 0.8125rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: -0.0094em;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
[data-agentation-theme=light] .styles-module__toggleLabel___Xm8Aa {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__toggleSwitch___l4Ygm {
  position: relative;
  display: inline-block;
  width: 24px;
  height: 16px;
  flex-shrink: 0;
  cursor: pointer;
  transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.styles-module__toggleSwitch___l4Ygm input {
  opacity: 0;
  width: 0;
  height: 0;
}
.styles-module__toggleSwitch___l4Ygm input:checked + .styles-module__toggleSlider___wprIn {
  background-color: var(--agentation-color-blue);
}
.styles-module__toggleSwitch___l4Ygm input:checked + .styles-module__toggleSlider___wprIn::before {
  transform: translateX(8px);
}
.styles-module__toggleSwitch___l4Ygm.styles-module__disabled___332Jw {
  opacity: 0.4;
}
.styles-module__toggleSwitch___l4Ygm.styles-module__disabled___332Jw .styles-module__toggleSlider___wprIn {
  cursor: not-allowed;
}

.styles-module__toggleSlider___wprIn {
  position: absolute;
  cursor: pointer;
  inset: 0;
  border-radius: 16px;
  background: #484848;
}
[data-agentation-theme=light] .styles-module__toggleSlider___wprIn {
  background: #dddddd;
}
.styles-module__toggleSlider___wprIn::before {
  content: "";
  position: absolute;
  height: 12px;
  width: 12px;
  left: 2px;
  bottom: 2px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes styles-module__mcpPulse___uNggr {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-green) 50%, transparent);
  }
  70% {
    box-shadow: 0 0 0 6px color-mix(in srgb, var(--agentation-color-green) 0%, transparent);
  }
  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-green) 0%, transparent);
  }
}
@keyframes styles-module__mcpPulseError___fov9B {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-red) 50%, transparent);
  }
  70% {
    box-shadow: 0 0 0 6px color-mix(in srgb, var(--agentation-color-red) 0%, transparent);
  }
  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-red) 0%, transparent);
  }
}
.styles-module__mcpStatusDot___ibgkc {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.styles-module__mcpStatusDot___ibgkc.styles-module__connecting___uo-CW {
  background-color: var(--agentation-color-yellow);
  animation: styles-module__mcpPulse___uNggr 1.5s infinite;
}
.styles-module__mcpStatusDot___ibgkc.styles-module__connected___7c28g {
  background-color: var(--agentation-color-green);
  animation: styles-module__mcpPulse___uNggr 2.5s ease-in-out infinite;
}
.styles-module__mcpStatusDot___ibgkc.styles-module__disconnected___cHPxR {
  background-color: var(--agentation-color-red);
  animation: styles-module__mcpPulseError___fov9B 2s infinite;
}

.styles-module__drawCanvas___7cG9U {
  position: fixed;
  inset: 0;
  z-index: 99996;
  pointer-events: none !important;
}
.styles-module__drawCanvas___7cG9U.styles-module__active___-zoN6 {
  pointer-events: auto !important;
  cursor: crosshair !important;
}
.styles-module__drawCanvas___7cG9U.styles-module__active___-zoN6[data-stroke-hover] {
  cursor: pointer !important;
}

.styles-module__dragSelection___kZLq2 {
  position: fixed;
  top: 0;
  left: 0;
  border: 2px solid color-mix(in srgb, var(--agentation-color-green) 60%, transparent);
  border-radius: 4px;
  background-color: color-mix(in srgb, var(--agentation-color-green) 8%, transparent);
  pointer-events: none;
  z-index: 99997;
  will-change: transform, width, height;
  contain: layout style;
}

.styles-module__dragCount___KM90j {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--agentation-color-green);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  min-width: 1.5rem;
  text-align: center;
}

.styles-module__highlightsContainer___-0xzG {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 99996;
}

.styles-module__selectedElementHighlight___fyVlI {
  position: fixed;
  top: 0;
  left: 0;
  border: 2px solid color-mix(in srgb, var(--agentation-color-green) 50%, transparent);
  border-radius: 4px;
  background: color-mix(in srgb, var(--agentation-color-green) 6%, transparent);
  pointer-events: none;
  will-change: transform, width, height;
  contain: layout style;
}

[data-agentation-theme=light] .styles-module__toolbarContainer___dIhma {
  background: #fff;
  color: rgba(0, 0, 0, 0.85);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
}
[data-agentation-theme=light] .styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn:hover {
  background: #f5f5f5;
}
[data-agentation-theme=light] .styles-module__controlButton___8Q0jc {
  color: rgba(0, 0, 0, 0.5);
}
[data-agentation-theme=light] .styles-module__controlButton___8Q0jc:hover:not(:disabled):not([data-active=true]):not([data-failed=true]):not([data-auto-sync=true]):not([data-error=true]):not([data-no-hover=true]) {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.85);
}
[data-agentation-theme=light] .styles-module__controlButton___8Q0jc[data-active=true] {
  color: var(--agentation-color-blue);
  background: color-mix(in srgb, var(--agentation-color-blue) 15%, transparent);
}
[data-agentation-theme=light] .styles-module__controlButton___8Q0jc[data-error=true] {
  color: var(--agentation-color-red);
  background: color-mix(in srgb, var(--agentation-color-red) 15%, transparent);
}
[data-agentation-theme=light] .styles-module__controlButton___8Q0jc[data-danger]:hover:not(:disabled):not([data-active=true]):not([data-failed=true]) {
  color: var(--agentation-color-red);
  background: color-mix(in srgb, var(--agentation-color-red) 15%, transparent);
}
[data-agentation-theme=light] .styles-module__controlButton___8Q0jc[data-auto-sync=true] {
  color: var(--agentation-color-green);
  background: transparent;
}
[data-agentation-theme=light] .styles-module__controlButton___8Q0jc[data-failed=true] {
  color: var(--agentation-color-red);
  background: color-mix(in srgb, var(--agentation-color-red) 15%, transparent);
}
[data-agentation-theme=light] .styles-module__buttonTooltip___Burd9 {
  background: #fff;
  color: rgba(0, 0, 0, 0.85);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
}
[data-agentation-theme=light] .styles-module__buttonTooltip___Burd9::after {
  background: #fff;
}
[data-agentation-theme=light] .styles-module__divider___c--s1 {
  background: rgba(0, 0, 0, 0.1);
}`,ri={toolbar:`styles-module__toolbar___wNsdK`,markersLayer:`styles-module__markersLayer___-25j1`,fixedMarkersLayer:`styles-module__fixedMarkersLayer___ffyX6`,controlsContent:`styles-module__controlsContent___9GJWU`,disableTransitions:`styles-module__disableTransitions___EopxO`,toolbarContainer:`styles-module__toolbarContainer___dIhma`,entrance:`styles-module__entrance___sgHd8`,toolbarEnter:`styles-module__toolbarEnter___u8RRu`,hiding:`styles-module__hiding___1td44`,toolbarHide:`styles-module__toolbarHide___y8kaT`,collapsed:`styles-module__collapsed___Rydsn`,expanded:`styles-module__expanded___ofKPx`,serverConnected:`styles-module__serverConnected___Gfbou`,toggleContent:`styles-module__toggleContent___0yfyP`,visible:`styles-module__visible___KHwEW`,hidden:`styles-module__hidden___Ae8H4`,badge:`styles-module__badge___2XsgF`,fadeOut:`styles-module__fadeOut___6Ut6-`,badgeEnter:`styles-module__badgeEnter___mVQLj`,controlButton:`styles-module__controlButton___8Q0jc`,statusShowing:`styles-module__statusShowing___te6iu`,buttonBadge:`styles-module__buttonBadge___NeFWb`,mcpIndicator:`styles-module__mcpIndicator___zGJeL`,connected:`styles-module__connected___7c28g`,mcpIndicatorPulseConnected:`styles-module__mcpIndicatorPulseConnected___EDodZ`,connecting:`styles-module__connecting___uo-CW`,mcpIndicatorPulseConnecting:`styles-module__mcpIndicatorPulseConnecting___cCYte`,connectionIndicatorWrapper:`styles-module__connectionIndicatorWrapper___L-e-3`,connectionIndicator:`styles-module__connectionIndicator___afk9p`,connectionIndicatorVisible:`styles-module__connectionIndicatorVisible___C-i5B`,connectionIndicatorConnected:`styles-module__connectionIndicatorConnected___IY8pR`,connectionPulse:`styles-module__connectionPulse___-Zycw`,connectionIndicatorDisconnected:`styles-module__connectionIndicatorDisconnected___kmpaZ`,connectionIndicatorConnecting:`styles-module__connectionIndicatorConnecting___QmSLH`,buttonWrapper:`styles-module__buttonWrapper___rBcdv`,buttonTooltip:`styles-module__buttonTooltip___Burd9`,tooltipsInSession:`styles-module__tooltipsInSession___-0lHH`,sendButtonWrapper:`styles-module__sendButtonWrapper___UUxG6`,sendButtonVisible:`styles-module__sendButtonVisible___WPSQU`,shortcut:`styles-module__shortcut___lEAQk`,tooltipBelow:`styles-module__tooltipBelow___m6ats`,tooltipsHidden:`styles-module__tooltipsHidden___VtLJG`,tooltipVisible:`styles-module__tooltipVisible___0jcCv`,buttonWrapperAlignLeft:`styles-module__buttonWrapperAlignLeft___myzIp`,buttonWrapperAlignRight:`styles-module__buttonWrapperAlignRight___HCQFR`,divider:`styles-module__divider___c--s1`,overlay:`styles-module__overlay___Q1O9y`,hoverHighlight:`styles-module__hoverHighlight___ogakW`,enter:`styles-module__enter___WFIki`,hoverHighlightIn:`styles-module__hoverHighlightIn___6WYHY`,multiSelectOutline:`styles-module__multiSelectOutline___cSJ-m`,fadeIn:`styles-module__fadeIn___b9qmf`,exit:`styles-module__exit___fyOJ0`,singleSelectOutline:`styles-module__singleSelectOutline___QhX-O`,hoverTooltip:`styles-module__hoverTooltip___bvLk7`,hoverTooltipIn:`styles-module__hoverTooltipIn___FYGQx`,hoverReactPath:`styles-module__hoverReactPath___gx1IJ`,hoverElementName:`styles-module__hoverElementName___QMLMl`,marker:`styles-module__marker___6sQrs`,clearing:`styles-module__clearing___FQ--7`,markerIn:`styles-module__markerIn___5FaAP`,markerOut:`styles-module__markerOut___GU5jX`,pending:`styles-module__pending___2IHLC`,fixed:`styles-module__fixed___dBMHC`,multiSelect:`styles-module__multiSelect___YWiuz`,hovered:`styles-module__hovered___ZgXIy`,renumber:`styles-module__renumber___nCTxD`,renumberRoll:`styles-module__renumberRoll___Wgbq3`,markerTooltip:`styles-module__markerTooltip___aLJID`,tooltipIn:`styles-module__tooltipIn___0N31w`,markerQuote:`styles-module__markerQuote___FHmrz`,markerNote:`styles-module__markerNote___QkrrS`,markerHint:`styles-module__markerHint___2iF-6`,settingsPanel:`styles-module__settingsPanel___OxX3Y`,settingsHeader:`styles-module__settingsHeader___pwDY9`,settingsBrand:`styles-module__settingsBrand___0gJeM`,settingsBrandSlash:`styles-module__settingsBrandSlash___uTG18`,settingsVersion:`styles-module__settingsVersion___TUcFq`,settingsSection:`styles-module__settingsSection___m-YM2`,settingsLabel:`styles-module__settingsLabel___8UjfX`,cycleButton:`styles-module__cycleButton___FMKfw`,cycleDot:`styles-module__cycleDot___nPgLY`,dropdownButton:`styles-module__dropdownButton___16NPz`,toggleLabel:`styles-module__toggleLabel___Xm8Aa`,customCheckbox:`styles-module__customCheckbox___U39ax`,sliderLabel:`styles-module__sliderLabel___U8sPr`,slider:`styles-module__slider___GLdxp`,themeToggle:`styles-module__themeToggle___2rUjA`,settingsOption:`styles-module__settingsOption___UNa12`,selected:`styles-module__selected___OwRqP`,settingsPanelContainer:`styles-module__settingsPanelContainer___Xksv8`,settingsPage:`styles-module__settingsPage___6YfHH`,slideLeft:`styles-module__slideLeft___Ps01J`,automationsPage:`styles-module__automationsPage___uvCq6`,slideIn:`styles-module__slideIn___4-qXe`,settingsNavLink:`styles-module__settingsNavLink___wCzJt`,settingsNavLinkRight:`styles-module__settingsNavLinkRight___ZWwhj`,mcpNavIndicator:`styles-module__mcpNavIndicator___cl9pO`,mcpPulse:`styles-module__mcpPulse___uNggr`,settingsBackButton:`styles-module__settingsBackButton___bIe2j`,automationHeader:`styles-module__automationHeader___InP0r`,automationDescription:`styles-module__automationDescription___NKlmo`,learnMoreLink:`styles-module__learnMoreLink___8xv-x`,autoSendRow:`styles-module__autoSendRow___UblX5`,autoSendLabel:`styles-module__autoSendLabel___icDc2`,active:`styles-module__active___-zoN6`,webhookUrlInput:`styles-module__webhookUrlInput___2375C`,settingsSectionExtraPadding:`styles-module__settingsSectionExtraPadding___jdhFV`,settingsSectionGrow:`styles-module__settingsSectionGrow___h-5HZ`,settingsRow:`styles-module__settingsRow___3sdhc`,settingsRowMarginTop:`styles-module__settingsRowMarginTop___zA0Sp`,dropdownContainer:`styles-module__dropdownContainer___BVnxe`,settingsRowDisabled:`styles-module__settingsRowDisabled___EgS0V`,toggleSwitch:`styles-module__toggleSwitch___l4Ygm`,cycleButtonText:`styles-module__cycleButtonText___fD1LR`,cycleTextIn:`styles-module__cycleTextIn___Q6zJf`,cycleDots:`styles-module__cycleDots___LWuoQ`,dropdownMenu:`styles-module__dropdownMenu___k73ER`,scaleIn:`styles-module__scaleIn___c-r1K`,dropdownItem:`styles-module__dropdownItem___ylsLj`,settingsLabelMarker:`styles-module__settingsLabelMarker___ewdtV`,settingsOptions:`styles-module__settingsOptions___LyrBA`,sliderContainer:`styles-module__sliderContainer___ducXj`,sliderLabels:`styles-module__sliderLabels___FhLDB`,colorOptions:`styles-module__colorOptions___iHCNX`,colorOption:`styles-module__colorOption___IodiY`,colorOptionRing:`styles-module__colorOptionRing___U2xpo`,settingsToggle:`styles-module__settingsToggle___fBrFn`,settingsToggleMarginBottom:`styles-module__settingsToggleMarginBottom___MZUyF`,checked:`styles-module__checked___mnZLo`,toggleSlider:`styles-module__toggleSlider___wprIn`,disabled:`styles-module__disabled___332Jw`,mcpStatusDot:`styles-module__mcpStatusDot___ibgkc`,disconnected:`styles-module__disconnected___cHPxR`,mcpPulseError:`styles-module__mcpPulseError___fov9B`,drawCanvas:`styles-module__drawCanvas___7cG9U`,dragSelection:`styles-module__dragSelection___kZLq2`,dragCount:`styles-module__dragCount___KM90j`,highlightsContainer:`styles-module__highlightsContainer___-0xzG`,selectedElementHighlight:`styles-module__selectedElementHighlight___fyVlI`,scaleOut:`styles-module__scaleOut___Wctwz`,slideUp:`styles-module__slideUp___kgD36`,slideDown:`styles-module__slideDown___zcdje`};if(typeof document<`u`){let e=document.getElementById(`feedback-tool-styles-page-toolbar-css-styles`);e||(e=document.createElement(`style`),e.id=`feedback-tool-styles-page-toolbar-css-styles`,document.head.appendChild(e)),e.textContent=ni}var Z=ri,ii=[{value:`compact`,label:`Compact`},{value:`standard`,label:`Standard`},{value:`detailed`,label:`Detailed`},{value:`forensic`,label:`Forensic`}];function ai(e,t,n=`standard`){if(e.length===0)return``;let r=typeof window<`u`?`${window.innerWidth}\xD7${window.innerHeight}`:`unknown`,i=`## Page Feedback: ${t}
`;return n===`forensic`?(i+=`
**Environment:**
`,i+=`- Viewport: ${r}
`,typeof window<`u`&&(i+=`- URL: ${window.location.href}
`,i+=`- User Agent: ${navigator.userAgent}
`,i+=`- Timestamp: ${new Date().toISOString()}
`,i+=`- Device Pixel Ratio: ${window.devicePixelRatio}
`),i+=`
---
`):n!==`compact`&&(i+=`**Viewport:** ${r}
`),i+=`
`,e.forEach((e,t)=>{n===`compact`?(i+=`${t+1}. **${e.element}**${e.sourceFile?` (${e.sourceFile})`:``}: ${e.comment}`,e.selectedText&&(i+=` (re: "${e.selectedText.slice(0,30)}${e.selectedText.length>30?`...`:``}")`),i+=`
`):n===`forensic`?(i+=`### ${t+1}. ${e.element}
`,e.isMultiSelect&&e.fullPath&&(i+=`*Forensic data shown for first element of selection*
`),e.fullPath&&(i+=`**Full DOM Path:** ${e.fullPath}
`),e.cssClasses&&(i+=`**CSS Classes:** ${e.cssClasses}
`),e.boundingBox&&(i+=`**Position:** x:${Math.round(e.boundingBox.x)}, y:${Math.round(e.boundingBox.y)} (${Math.round(e.boundingBox.width)}\xD7${Math.round(e.boundingBox.height)}px)
`),i+=`**Annotation at:** ${e.x.toFixed(1)}% from left, ${Math.round(e.y)}px from top
`,e.selectedText&&(i+=`**Selected text:** "${e.selectedText}"
`),e.nearbyText&&!e.selectedText&&(i+=`**Context:** ${e.nearbyText.slice(0,100)}
`),e.computedStyles&&(i+=`**Computed Styles:** ${e.computedStyles}
`),e.accessibility&&(i+=`**Accessibility:** ${e.accessibility}
`),e.nearbyElements&&(i+=`**Nearby Elements:** ${e.nearbyElements}
`),e.sourceFile&&(i+=`**Source:** ${e.sourceFile}
`),e.reactComponents&&(i+=`**React:** ${e.reactComponents}
`),i+=`**Feedback:** ${e.comment}

`):(i+=`### ${t+1}. ${e.element}
`,i+=`**Location:** ${e.elementPath}
`,e.sourceFile&&(i+=`**Source:** ${e.sourceFile}
`),e.reactComponents&&(i+=`**React:** ${e.reactComponents}
`),n===`detailed`&&(e.cssClasses&&(i+=`**Classes:** ${e.cssClasses}
`),e.boundingBox&&(i+=`**Position:** ${Math.round(e.boundingBox.x)}px, ${Math.round(e.boundingBox.y)}px (${Math.round(e.boundingBox.width)}\xD7${Math.round(e.boundingBox.height)}px)
`)),e.selectedText&&(i+=`**Selected text:** "${e.selectedText}"
`),n===`detailed`&&e.nearbyText&&!e.selectedText&&(i+=`**Context:** ${e.nearbyText.slice(0,100)}
`),i+=`**Feedback:** ${e.comment}

`)}),i.trim()}var oi=`@keyframes styles-module__markerIn___x4G8D {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.3);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
@keyframes styles-module__markerOut___6VhQN {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.3);
  }
}
@keyframes styles-module__tooltipIn___aJslQ {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(2px) scale(0.891);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(0.909);
  }
}
@keyframes styles-module__renumberRoll___akV9B {
  0% {
    transform: translateX(-40%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
.styles-module__marker___9CKF7 {
  position: absolute;
  width: 22px;
  height: 22px;
  background: var(--agentation-color-blue);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 600;
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(0, 0, 0, 0.04);
  user-select: none;
  will-change: transform, opacity;
  contain: layout style;
  z-index: 1;
}
.styles-module__marker___9CKF7:hover {
  z-index: 2;
}
.styles-module__marker___9CKF7:not(.styles-module__enter___8kI3q):not(.styles-module__exit___KBdR3):not(.styles-module__clearing___8rM7K) {
  transition: background-color 0.15s ease, transform 0.1s ease;
}
.styles-module__marker___9CKF7.styles-module__enter___8kI3q {
  animation: styles-module__markerIn___x4G8D 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.styles-module__marker___9CKF7.styles-module__exit___KBdR3 {
  animation: styles-module__markerOut___6VhQN 0.2s ease-out both;
  pointer-events: none;
}
.styles-module__marker___9CKF7.styles-module__clearing___8rM7K {
  animation: styles-module__markerOut___6VhQN 0.15s ease-out both;
  pointer-events: none;
}
.styles-module__marker___9CKF7:not(.styles-module__enter___8kI3q):not(.styles-module__exit___KBdR3):not(.styles-module__clearing___8rM7K):hover {
  transform: translate(-50%, -50%) scale(1.1);
}
.styles-module__marker___9CKF7.styles-module__pending___BiY-U {
  position: fixed;
  background-color: var(--agentation-color-blue);
  cursor: default;
}
.styles-module__marker___9CKF7.styles-module__fixed___aKrQO {
  position: fixed;
}
.styles-module__marker___9CKF7.styles-module__multiSelect___CPfTC {
  background-color: var(--agentation-color-green);
  width: 26px;
  height: 26px;
  border-radius: 6px;
  font-size: 0.75rem;
}
.styles-module__marker___9CKF7.styles-module__multiSelect___CPfTC.styles-module__pending___BiY-U {
  background-color: var(--agentation-color-green);
}
.styles-module__marker___9CKF7.styles-module__hovered___-mg2N {
  background-color: var(--agentation-color-red);
}

.styles-module__renumber___16lvD {
  display: block;
  animation: styles-module__renumberRoll___akV9B 0.2s ease-out;
}

.styles-module__markerTooltip___-VUm- {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) scale(0.909);
  z-index: 100002;
  background: #1a1a1a;
  padding: 8px 0.75rem;
  border-radius: 0.75rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-weight: 400;
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
  min-width: 120px;
  max-width: 200px;
  pointer-events: none;
  cursor: default;
}
.styles-module__markerTooltip___-VUm-.styles-module__enter___8kI3q {
  animation: styles-module__tooltipIn___aJslQ 0.1s ease-out forwards;
}

.styles-module__markerQuote___tQake {
  display: block;
  font-size: 12px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.3125rem;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.styles-module__markerNote___Rh4eI {
  display: block;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.4;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-bottom: 2px;
}

[data-agentation-theme=light] .styles-module__markerTooltip___-VUm- {
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06);
}
[data-agentation-theme=light] .styles-module__markerTooltip___-VUm- .styles-module__markerQuote___tQake {
  color: rgba(0, 0, 0, 0.5);
}
[data-agentation-theme=light] .styles-module__markerTooltip___-VUm- .styles-module__markerNote___Rh4eI {
  color: rgba(0, 0, 0, 0.85);
}`,si={marker:`styles-module__marker___9CKF7`,enter:`styles-module__enter___8kI3q`,exit:`styles-module__exit___KBdR3`,clearing:`styles-module__clearing___8rM7K`,markerIn:`styles-module__markerIn___x4G8D`,markerOut:`styles-module__markerOut___6VhQN`,pending:`styles-module__pending___BiY-U`,fixed:`styles-module__fixed___aKrQO`,multiSelect:`styles-module__multiSelect___CPfTC`,hovered:`styles-module__hovered___-mg2N`,renumber:`styles-module__renumber___16lvD`,renumberRoll:`styles-module__renumberRoll___akV9B`,markerTooltip:`styles-module__markerTooltip___-VUm-`,tooltipIn:`styles-module__tooltipIn___aJslQ`,markerQuote:`styles-module__markerQuote___tQake`,markerNote:`styles-module__markerNote___Rh4eI`};if(typeof document<`u`){let e=document.getElementById(`feedback-tool-styles-annotation-marker-styles`);e||(e=document.createElement(`style`),e.id=`feedback-tool-styles-annotation-marker-styles`,document.head.appendChild(e)),e.textContent=oi}var Q=si;function ci({annotation:e,globalIndex:t,layerIndex:n,layerSize:r,isExiting:i,isClearing:a,isAnimated:o,isHovered:s,isDeleting:c,isEditingAny:l,renumberFrom:d,markerClickBehavior:f,tooltipStyle:p,onHoverEnter:m,onHoverLeave:h,onClick:g,onContextMenu:_}){let v=(s||c)&&!l,y=v&&f===`delete`,b=e.isMultiSelect,ee=b?`var(--agentation-color-green)`:`var(--agentation-color-accent)`,x=i?Q.exit:a?Q.clearing:o?``:Q.enter,te=i?`${(r-1-n)*20}ms`:`${n*20}ms`;return(0,u.jsxs)(`div`,{className:`${Q.marker} ${b?Q.multiSelect:``} ${x} ${y?Q.hovered:``}`,"data-annotation-marker":!0,style:{left:`${e.x}%`,top:e.y,backgroundColor:y?void 0:ee,animationDelay:te},onMouseEnter:()=>m(e),onMouseLeave:h,onClick:t=>{t.stopPropagation(),i||g(e)},onContextMenu:_?t=>{f===`delete`&&(t.preventDefault(),t.stopPropagation(),i||_(e))}:void 0,children:[v?y?(0,u.jsx)(C,{size:b?18:16}):(0,u.jsx)(ie,{size:16}):(0,u.jsx)(`span`,{className:d!==null&&t>=d?Q.renumber:void 0,children:t+1}),s&&!l&&(0,u.jsxs)(`div`,{className:`${Q.markerTooltip} ${Q.enter}`,style:p,children:[(0,u.jsxs)(`span`,{className:Q.markerQuote,children:[e.element,e.selectedText&&` "${e.selectedText.slice(0,30)}${e.selectedText.length>30?`...`:``}"`]}),(0,u.jsx)(`span`,{className:Q.markerNote,children:e.comment})]})]})}function li({x:e,y:t,isMultiSelect:n,isExiting:r}){return(0,u.jsx)(`div`,{className:`${Q.marker} ${Q.pending} ${n?Q.multiSelect:``} ${r?Q.exit:Q.enter}`,style:{left:`${e}%`,top:t,backgroundColor:n?`var(--agentation-color-green)`:`var(--agentation-color-accent)`},children:(0,u.jsx)(_,{size:12})})}function ui({annotation:e,fixed:t}){let n=e.isMultiSelect;return(0,u.jsx)(`div`,{className:`${Q.marker} ${t?Q.fixed:``} ${Q.hovered} ${n?Q.multiSelect:``} ${Q.exit}`,"data-annotation-marker":!0,style:{left:`${e.x}%`,top:e.y},children:(0,u.jsx)(C,{size:n?12:10})})}var di=`.styles-module__switchContainer___Ka-AB {
  display: flex;
  align-items: center;
  position: relative;
  padding: 2px;
  width: 24px;
  height: 16px;
  border-radius: 8px;
  background-color: #cdcdcd;
  transition: background-color 0.15s, opacity 0.15s;
}
[data-agentation-theme=dark] .styles-module__switchContainer___Ka-AB {
  background-color: #484848;
}
.styles-module__switchContainer___Ka-AB:has(.styles-module__switchInput___kYDSD:checked) {
  background-color: var(--agentation-color-blue);
}
.styles-module__switchContainer___Ka-AB:has(.styles-module__switchInput___kYDSD:disabled) {
  opacity: 0.3;
}

.styles-module__switchInput___kYDSD {
  position: absolute;
  z-index: 1;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  cursor: pointer;
}
.styles-module__switchInput___kYDSD:disabled {
  cursor: not-allowed;
}

.styles-module__switchThumb___4sCPH {
  border-radius: 50%;
  width: 12px;
  height: 12px;
  background-color: #fff;
  transition: transform 0.15s;
}
.styles-module__switchContainer___Ka-AB:has(.styles-module__switchInput___kYDSD:checked) .styles-module__switchThumb___4sCPH {
  transform: translateX(8px);
}`,fi={switchContainer:`styles-module__switchContainer___Ka-AB`,switchInput:`styles-module__switchInput___kYDSD`,switchThumb:`styles-module__switchThumb___4sCPH`};if(typeof document<`u`){let e=document.getElementById(`feedback-tool-styles-switch-styles`);e||(e=document.createElement(`style`),e.id=`feedback-tool-styles-switch-styles`,document.head.appendChild(e)),e.textContent=di}var pi=fi,mi=({className:e=``,...t})=>(0,u.jsxs)(`div`,{className:`${pi.switchContainer} ${e}`,children:[(0,u.jsx)(`input`,{className:pi.switchInput,type:`checkbox`,...t}),(0,u.jsx)(`div`,{className:pi.switchThumb})]}),hi=`.styles-module__checkboxContainer___joqZk {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: 1px solid rgba(26, 26, 26, 0.2);
  border-radius: 4px;
  width: 14px;
  height: 14px;
  background-color: #fff;
  transition: background-color 0.2s ease;
}
[data-agentation-theme=dark] .styles-module__checkboxContainer___joqZk {
  border-color: rgba(255, 255, 255, 0.2);
  background-color: #252525;
}
.styles-module__checkboxContainer___joqZk:has(.styles-module__checkboxInput___ECzzO:checked) {
  background-color: #1a1a1a;
}
[data-agentation-theme=dark] .styles-module__checkboxContainer___joqZk:has(.styles-module__checkboxInput___ECzzO:checked) {
  background-color: #fff;
}

.styles-module__checkboxInput___ECzzO {
  position: absolute;
  z-index: 1;
  inset: -1px;
  border-radius: inherit;
  opacity: 0;
  cursor: pointer;
}

.styles-module__checkboxCheck___fUXpr {
  color: #fafafa;
}
[data-agentation-theme=dark] .styles-module__checkboxCheck___fUXpr {
  color: #1a1a1a;
}

.styles-module__checkboxCheckPath___cDyh8 {
  stroke-dasharray: 9.29px;
  stroke-dashoffset: 9.29px;
  color: #fafafa;
  transition: stroke-dashoffset 0.1s ease;
}
[data-agentation-theme=dark] .styles-module__checkboxCheckPath___cDyh8 {
  color: #1a1a1a;
}
.styles-module__checkboxContainer___joqZk:has(.styles-module__checkboxInput___ECzzO:checked) .styles-module__checkboxCheckPath___cDyh8 {
  transition-duration: 0.2s;
  stroke-dashoffset: 0;
}`,gi={checkboxContainer:`styles-module__checkboxContainer___joqZk`,checkboxInput:`styles-module__checkboxInput___ECzzO`,checkboxCheck:`styles-module__checkboxCheck___fUXpr`,checkboxCheckPath:`styles-module__checkboxCheckPath___cDyh8`};if(typeof document<`u`){let e=document.getElementById(`feedback-tool-styles-checkbox-styles`);e||(e=document.createElement(`style`),e.id=`feedback-tool-styles-checkbox-styles`,document.head.appendChild(e)),e.textContent=hi}var _i=gi,vi=({className:e=``,...t})=>(0,u.jsxs)(`div`,{className:`${_i.checkboxContainer} ${e}`,children:[(0,u.jsx)(`input`,{className:_i.checkboxInput,type:`checkbox`,...t}),(0,u.jsx)(`svg`,{className:_i.checkboxCheck,width:`14`,height:`14`,viewBox:`0 0 14 14`,fill:`none`,children:(0,u.jsx)(`path`,{className:_i.checkboxCheckPath,d:`M3.94 7L6.13 9.19L10.5 4.81`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`})})]}),yi=`.styles-module__container___w8eAF {
  display: flex;
  align-items: center;
  height: 24px;
}

.styles-module__label___J5mxE {
  padding-inline: 8px 2px;
  line-height: 20px;
  font-size: 13px;
  letter-spacing: -0.15px;
  color: rgba(26, 26, 26, 0.5);
  cursor: pointer;
}
[data-agentation-theme=dark] .styles-module__label___J5mxE {
  color: rgba(255, 255, 255, 0.5);
}`,bi={container:`styles-module__container___w8eAF`,label:`styles-module__label___J5mxE`};if(typeof document<`u`){let e=document.getElementById(`feedback-tool-styles-checkbox-field-styles`);e||(e=document.createElement(`style`),e.id=`feedback-tool-styles-checkbox-field-styles`,document.head.appendChild(e)),e.textContent=yi}var xi=bi,Si=({className:e=``,label:t,tooltip:n,checked:r,onChange:i,...a})=>{let o=(0,c.useId)();return(0,u.jsxs)(`div`,{className:`${xi.container} ${e}`,...a,children:[(0,u.jsx)(vi,{id:o,onChange:i,checked:r}),(0,u.jsx)(`label`,{className:xi.label,htmlFor:o,children:t}),n&&(0,u.jsx)(Se,{content:n})]})},Ci=`@keyframes styles-module__cycleTextIn___VBNTi {
  0% {
    opacity: 0;
    transform: translateY(-6px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes styles-module__scaleIn___QpQ8E {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__mcpPulse___5Q3Jj {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-green) 50%, transparent);
  }
  70% {
    box-shadow: 0 0 0 6px color-mix(in srgb, var(--agentation-color-green) 0%, transparent);
  }
  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-green) 0%, transparent);
  }
}
@keyframes styles-module__mcpPulseError___VHxhx {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-red) 50%, transparent);
  }
  70% {
    box-shadow: 0 0 0 6px color-mix(in srgb, var(--agentation-color-red) 0%, transparent);
  }
  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-red) 0%, transparent);
  }
}
@keyframes styles-module__themeIconIn___qUWMV {
  0% {
    opacity: 0;
    transform: scale(0.8) rotate(-30deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}
.styles-module__settingsPanel___qNkn- {
  position: absolute;
  right: 5px;
  bottom: calc(100% + 0.5rem);
  z-index: 1;
  overflow: hidden;
  background: #1c1c1c;
  border-radius: 16px;
  padding: 12px 0;
  width: 100%;
  max-width: 253px;
  min-width: 205px;
  cursor: default;
  opacity: 1;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.04);
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
}
.styles-module__settingsPanel___qNkn-::before, .styles-module__settingsPanel___qNkn-::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 16px;
  z-index: 2;
  pointer-events: none;
}
.styles-module__settingsPanel___qNkn-::before {
  left: 0;
  background: linear-gradient(to right, #1c1c1c 0%, transparent 100%);
}
.styles-module__settingsPanel___qNkn-::after {
  right: 0;
  background: linear-gradient(to left, #1c1c1c 0%, transparent 100%);
}
.styles-module__settingsPanel___qNkn- .styles-module__settingsHeader___Fn1DP,
.styles-module__settingsPanel___qNkn- .styles-module__settingsBrand___OoKlM,
.styles-module__settingsPanel___qNkn- .styles-module__settingsBrandSlash___Q-AU9,
.styles-module__settingsPanel___qNkn- .styles-module__settingsVersion___rXmL9,
.styles-module__settingsPanel___qNkn- .styles-module__settingsSection___n5V-4,
.styles-module__settingsPanel___qNkn- .styles-module__settingsLabel___VCVOQ,
.styles-module__settingsPanel___qNkn- .styles-module__cycleButton___XMBx3,
.styles-module__settingsPanel___qNkn- .styles-module__cycleDot___zgSXY,
.styles-module__settingsPanel___qNkn- .styles-module__dropdownButton___mKHe8,
.styles-module__settingsPanel___qNkn- .styles-module__sliderLabel___6K5v1,
.styles-module__settingsPanel___qNkn- .styles-module__slider___v5z-c,
.styles-module__settingsPanel___qNkn- .styles-module__themeToggle___3imlT {
  transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}
.styles-module__settingsPanel___qNkn-.styles-module__enter___wginS {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0px);
  transition: opacity 0.2s ease, transform 0.2s ease, filter 0.2s ease;
}
.styles-module__settingsPanel___qNkn-.styles-module__exit___A4iJc {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
  filter: blur(5px);
  pointer-events: none;
  transition: opacity 0.1s ease, transform 0.1s ease, filter 0.1s ease;
}
[data-agentation-theme=dark] .styles-module__settingsPanel___qNkn- {
  background: #1a1a1a;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
}
[data-agentation-theme=dark] .styles-module__settingsPanel___qNkn- .styles-module__settingsLabel___VCVOQ {
  color: rgba(255, 255, 255, 0.6);
}
[data-agentation-theme=dark] .styles-module__settingsPanel___qNkn- .styles-module__settingsOption___JoyH- {
  color: rgba(255, 255, 255, 0.85);
}
[data-agentation-theme=dark] .styles-module__settingsPanel___qNkn- .styles-module__settingsOption___JoyH-:hover {
  background: rgba(255, 255, 255, 0.1);
}
[data-agentation-theme=dark] .styles-module__settingsPanel___qNkn- .styles-module__settingsOption___JoyH-.styles-module__selected___k1-Vq {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.styles-module__settingsPanelContainer___5it-H {
  overflow: visible;
  position: relative;
  display: flex;
  padding: 0 16px;
}

.styles-module__settingsPage___BMn-3 {
  min-width: 100%;
  flex-basis: 0;
  flex-shrink: 0;
  transition: transform 0.2s ease, opacity 0.2s ease;
  transition-delay: 0s;
  opacity: 1;
}

.styles-module__settingsPage___BMn-3.styles-module__slideLeft___qUvW4 {
  transform: translateX(-24px);
  opacity: 0;
  pointer-events: none;
}

.styles-module__automationsPage___N7By0 {
  position: absolute;
  top: 0;
  left: 24px;
  width: 100%;
  height: 100%;
  padding: 0 16px 4px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, opacity 0.2s ease;
  opacity: 0;
  pointer-events: none;
}

.styles-module__automationsPage___N7By0.styles-module__slideIn___uXDSu {
  transform: translateX(-24px);
  opacity: 1;
  pointer-events: auto;
}

.styles-module__settingsHeader___Fn1DP {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 24px;
}

.styles-module__settingsBrand___OoKlM {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: -0.0094em;
  color: #fff;
  text-decoration: none;
}

.styles-module__settingsBrandSlash___Q-AU9 {
  color: var(--agentation-color-accent);
  transition: color 0.2s ease;
}

.styles-module__settingsVersion___rXmL9 {
  font-size: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
  margin-left: auto;
  letter-spacing: -0.0094em;
}

.styles-module__themeToggle___3imlT {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-left: 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: rgba(255, 255, 255, 0.4);
  transition: background-color 0.15s ease, color 0.15s ease;
  cursor: pointer;
}
.styles-module__themeToggle___3imlT:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}
[data-agentation-theme=light] .styles-module__themeToggle___3imlT {
  color: rgba(0, 0, 0, 0.4);
}
[data-agentation-theme=light] .styles-module__themeToggle___3imlT:hover {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.7);
}

.styles-module__themeIconWrapper___pyaYa {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 20px;
  height: 20px;
}

.styles-module__themeIcon___w7lAm {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: styles-module__themeIconIn___qUWMV 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.styles-module__settingsSectionGrow___eZTRw {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.styles-module__settingsRow___y-tDE {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
}
.styles-module__settingsRow___y-tDE.styles-module__settingsRowMarginTop___uLpGb {
  margin-top: 8px;
}

.styles-module__settingsRowDisabled___ydl3Q .styles-module__settingsLabel___VCVOQ {
  color: rgba(255, 255, 255, 0.2);
}
[data-agentation-theme=light] .styles-module__settingsRowDisabled___ydl3Q .styles-module__settingsLabel___VCVOQ {
  color: rgba(0, 0, 0, 0.2);
}

.styles-module__settingsLabel___VCVOQ {
  display: flex;
  align-items: center;
  column-gap: 2px;
  line-height: 20px;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: -0.15px;
  color: rgba(255, 255, 255, 0.5);
}
[data-agentation-theme=light] .styles-module__settingsLabel___VCVOQ {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__cycleButton___XMBx3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  letter-spacing: -0.0094em;
}
[data-agentation-theme=light] .styles-module__cycleButton___XMBx3 {
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__cycleButton___XMBx3:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.styles-module__cycleButtonText___mbbnD {
  display: inline-block;
  animation: styles-module__cycleTextIn___VBNTi 0.2s ease-out;
}

.styles-module__cycleDots___ehp6i {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.styles-module__cycleDot___zgSXY {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.667);
  transition: background-color 0.25s ease-out, transform 0.25s ease-out;
}
.styles-module__cycleDot___zgSXY.styles-module__active___dpAhM {
  background: #fff;
  transform: scale(1);
}
[data-agentation-theme=light] .styles-module__cycleDot___zgSXY {
  background: rgba(0, 0, 0, 0.2);
}
[data-agentation-theme=light] .styles-module__cycleDot___zgSXY.styles-module__active___dpAhM {
  background: rgba(0, 0, 0, 0.7);
}

.styles-module__colorOptions___pbxZx {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  height: 26px;
}

.styles-module__colorOption___Co955 {
  padding: 0;
  position: relative;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background-color: #fff;
  cursor: pointer;
}
[data-agentation-theme=dark] .styles-module__colorOption___Co955 {
  background-color: #1a1a1a;
}
.styles-module__colorOption___Co955::before, .styles-module__colorOption___Co955::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-color: var(--swatch);
  transition: opacity 0.2s, transform 0.2s;
}
@supports (color: color(display-p3 0 0 0)) {
  .styles-module__colorOption___Co955::before, .styles-module__colorOption___Co955::after {
    --color: var(--swatch-p3);
  }
}
.styles-module__colorOption___Co955::after {
  z-index: -1;
  transform: scale(1.2);
  opacity: 0;
}
.styles-module__colorOption___Co955.styles-module__selected___k1-Vq::before {
  transform: scale(0.8);
}
.styles-module__colorOption___Co955.styles-module__selected___k1-Vq::after {
  opacity: 1;
}

.styles-module__settingsNavLink___uYIwM {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  font-family: inherit;
  line-height: 20px;
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.15s ease;
  cursor: pointer;
}
.styles-module__settingsNavLink___uYIwM:hover {
  color: rgba(255, 255, 255, 0.9);
}
.styles-module__settingsNavLink___uYIwM svg {
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.15s ease;
}
.styles-module__settingsNavLink___uYIwM:hover svg {
  color: #fff;
}
[data-agentation-theme=light] .styles-module__settingsNavLink___uYIwM {
  color: rgba(0, 0, 0, 0.5);
}
[data-agentation-theme=light] .styles-module__settingsNavLink___uYIwM:hover {
  color: rgba(0, 0, 0, 0.8);
}
[data-agentation-theme=light] .styles-module__settingsNavLink___uYIwM svg {
  color: rgba(0, 0, 0, 0.25);
}
[data-agentation-theme=light] .styles-module__settingsNavLink___uYIwM:hover svg {
  color: rgba(0, 0, 0, 0.8);
}

.styles-module__settingsNavLinkRight___XBUzC {
  display: flex;
  align-items: center;
  gap: 6px;
}

.styles-module__settingsBackButton___fflll {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  background: transparent;
  font-family: inherit;
  line-height: 20px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.15px;
  color: #fff;
  cursor: pointer;
  transition: transform 0.12s cubic-bezier(0.32, 0.72, 0, 1);
}
.styles-module__settingsBackButton___fflll svg {
  opacity: 0.4;
  flex-shrink: 0;
  transition: opacity 0.15s ease, transform 0.18s cubic-bezier(0.32, 0.72, 0, 1);
}
.styles-module__settingsBackButton___fflll:hover svg {
  opacity: 1;
}
[data-agentation-theme=light] .styles-module__settingsBackButton___fflll {
  color: rgba(0, 0, 0, 0.85);
  border-bottom-color: rgba(0, 0, 0, 0.08);
}

.styles-module__automationHeader___Avra9 {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.8125rem;
  font-weight: 400;
  color: #fff;
}
[data-agentation-theme=light] .styles-module__automationHeader___Avra9 {
  color: rgba(0, 0, 0, 0.85);
}

.styles-module__automationDescription___vFTmJ {
  font-size: 0.6875rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2px;
  line-height: 14px;
}
[data-agentation-theme=light] .styles-module__automationDescription___vFTmJ {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__learnMoreLink___cG7OI {
  color: rgba(255, 255, 255, 0.8);
  text-decoration-line: underline;
  text-decoration-style: dotted;
  text-decoration-color: rgba(255, 255, 255, 0.2);
  text-underline-offset: 2px;
  transition: color 0.15s ease;
}
.styles-module__learnMoreLink___cG7OI:hover {
  color: #fff;
}
[data-agentation-theme=light] .styles-module__learnMoreLink___cG7OI {
  color: rgba(0, 0, 0, 0.6);
  text-decoration-color: rgba(0, 0, 0, 0.2);
}
[data-agentation-theme=light] .styles-module__learnMoreLink___cG7OI:hover {
  color: rgba(0, 0, 0, 0.85);
}

.styles-module__autoSendContainer___VpkXk {
  display: flex;
  align-items: center;
}

.styles-module__autoSendLabel___ngNdC {
  padding-inline-end: 8px;
  font-size: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.15s, opacity 0.15s;
  cursor: pointer;
}
.styles-module__autoSendLabel___ngNdC.styles-module__active___dpAhM {
  color: #66b8ff;
  color: color(display-p3 0.4 0.72 1);
}
[data-agentation-theme=light] .styles-module__autoSendLabel___ngNdC {
  color: rgba(0, 0, 0, 0.4);
}
[data-agentation-theme=light] .styles-module__autoSendLabel___ngNdC.styles-module__active___dpAhM {
  color: var(--agentation-color-blue);
}
.styles-module__autoSendLabel___ngNdC.styles-module__disabled___9AZYS {
  opacity: 0.3;
  cursor: not-allowed;
}

.styles-module__mcpStatusDot___8AMxP {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.styles-module__mcpStatusDot___8AMxP.styles-module__connecting___QEO1r {
  background-color: var(--agentation-color-yellow);
  animation: styles-module__mcpPulse___5Q3Jj 1.5s infinite;
}
.styles-module__mcpStatusDot___8AMxP.styles-module__connected___WyFkx {
  background-color: var(--agentation-color-green);
  animation: styles-module__mcpPulse___5Q3Jj 2.5s ease-in-out infinite;
}
.styles-module__mcpStatusDot___8AMxP.styles-module__disconnected___mvmvQ {
  background-color: var(--agentation-color-red);
  animation: styles-module__mcpPulseError___VHxhx 2s infinite;
}

.styles-module__mcpNavIndicator___auBHI {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.styles-module__mcpNavIndicator___auBHI.styles-module__connected___WyFkx {
  background-color: var(--agentation-color-green);
  animation: styles-module__mcpPulse___5Q3Jj 2.5s ease-in-out infinite;
}
.styles-module__mcpNavIndicator___auBHI.styles-module__connecting___QEO1r {
  background-color: var(--agentation-color-yellow);
  animation: styles-module__mcpPulse___5Q3Jj 1.5s ease-in-out infinite;
}

.styles-module__webhookUrlInput___WDDDC {
  display: block;
  width: 100%;
  flex: 1;
  min-height: 60px;
  box-sizing: border-box;
  margin-top: 11px;
  padding: 8px 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.03);
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 400;
  color: #fff;
  outline: none;
  resize: none;
  user-select: text;
  transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
}
.styles-module__webhookUrlInput___WDDDC::placeholder {
  color: rgba(255, 255, 255, 0.3);
}
.styles-module__webhookUrlInput___WDDDC:focus {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.08);
}
[data-agentation-theme=light] .styles-module__webhookUrlInput___WDDDC {
  border-color: rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.03);
  color: rgba(0, 0, 0, 0.85);
}
[data-agentation-theme=light] .styles-module__webhookUrlInput___WDDDC::placeholder {
  color: rgba(0, 0, 0, 0.3);
}
[data-agentation-theme=light] .styles-module__webhookUrlInput___WDDDC:focus {
  border-color: rgba(0, 0, 0, 0.25);
  background: rgba(0, 0, 0, 0.05);
}

[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn-::before {
  background: linear-gradient(to right, #fff 0%, transparent 100%);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn-::after {
  background: linear-gradient(to left, #fff 0%, transparent 100%);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__settingsHeader___Fn1DP {
  border-bottom-color: rgba(0, 0, 0, 0.08);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__settingsBrand___OoKlM {
  color: #E5484D;
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__settingsVersion___rXmL9 {
  color: rgba(0, 0, 0, 0.4);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__settingsSection___n5V-4 {
  border-top-color: rgba(0, 0, 0, 0.08);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__settingsLabel___VCVOQ {
  color: rgba(0, 0, 0, 0.5);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__cycleButton___XMBx3 {
  color: rgba(0, 0, 0, 0.85);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__cycleDot___zgSXY {
  background: rgba(0, 0, 0, 0.2);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__cycleDot___zgSXY.styles-module__active___dpAhM {
  background: rgba(0, 0, 0, 0.7);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__dropdownButton___mKHe8 {
  color: rgba(0, 0, 0, 0.85);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__dropdownButton___mKHe8:hover {
  background: rgba(0, 0, 0, 0.05);
}

.styles-module__checkboxField___ZrSqv:not(:first-child) {
  margin-top: 8px;
}

.styles-module__divider___h6Yux {
  margin-block: 8px;
  width: 100%;
  height: 1px;
  background-color: rgba(26, 26, 26, 0.07);
}
[data-agentation-theme=dark] .styles-module__divider___h6Yux {
  background-color: rgba(255, 255, 255, 0.07);
}`,wi={settingsPanel:`styles-module__settingsPanel___qNkn-`,settingsHeader:`styles-module__settingsHeader___Fn1DP`,settingsBrand:`styles-module__settingsBrand___OoKlM`,settingsBrandSlash:`styles-module__settingsBrandSlash___Q-AU9`,settingsVersion:`styles-module__settingsVersion___rXmL9`,settingsSection:`styles-module__settingsSection___n5V-4`,settingsLabel:`styles-module__settingsLabel___VCVOQ`,cycleButton:`styles-module__cycleButton___XMBx3`,cycleDot:`styles-module__cycleDot___zgSXY`,dropdownButton:`styles-module__dropdownButton___mKHe8`,sliderLabel:`styles-module__sliderLabel___6K5v1`,slider:`styles-module__slider___v5z-c`,themeToggle:`styles-module__themeToggle___3imlT`,enter:`styles-module__enter___wginS`,exit:`styles-module__exit___A4iJc`,settingsOption:`styles-module__settingsOption___JoyH-`,selected:`styles-module__selected___k1-Vq`,settingsPanelContainer:`styles-module__settingsPanelContainer___5it-H`,settingsPage:`styles-module__settingsPage___BMn-3`,slideLeft:`styles-module__slideLeft___qUvW4`,automationsPage:`styles-module__automationsPage___N7By0`,slideIn:`styles-module__slideIn___uXDSu`,themeIconWrapper:`styles-module__themeIconWrapper___pyaYa`,themeIcon:`styles-module__themeIcon___w7lAm`,themeIconIn:`styles-module__themeIconIn___qUWMV`,settingsSectionGrow:`styles-module__settingsSectionGrow___eZTRw`,settingsRow:`styles-module__settingsRow___y-tDE`,settingsRowMarginTop:`styles-module__settingsRowMarginTop___uLpGb`,settingsRowDisabled:`styles-module__settingsRowDisabled___ydl3Q`,cycleButtonText:`styles-module__cycleButtonText___mbbnD`,cycleTextIn:`styles-module__cycleTextIn___VBNTi`,cycleDots:`styles-module__cycleDots___ehp6i`,active:`styles-module__active___dpAhM`,colorOptions:`styles-module__colorOptions___pbxZx`,colorOption:`styles-module__colorOption___Co955`,settingsNavLink:`styles-module__settingsNavLink___uYIwM`,settingsNavLinkRight:`styles-module__settingsNavLinkRight___XBUzC`,settingsBackButton:`styles-module__settingsBackButton___fflll`,automationHeader:`styles-module__automationHeader___Avra9`,automationDescription:`styles-module__automationDescription___vFTmJ`,learnMoreLink:`styles-module__learnMoreLink___cG7OI`,autoSendContainer:`styles-module__autoSendContainer___VpkXk`,autoSendLabel:`styles-module__autoSendLabel___ngNdC`,disabled:`styles-module__disabled___9AZYS`,mcpStatusDot:`styles-module__mcpStatusDot___8AMxP`,connecting:`styles-module__connecting___QEO1r`,mcpPulse:`styles-module__mcpPulse___5Q3Jj`,connected:`styles-module__connected___WyFkx`,disconnected:`styles-module__disconnected___mvmvQ`,mcpPulseError:`styles-module__mcpPulseError___VHxhx`,mcpNavIndicator:`styles-module__mcpNavIndicator___auBHI`,webhookUrlInput:`styles-module__webhookUrlInput___WDDDC`,checkboxField:`styles-module__checkboxField___ZrSqv`,divider:`styles-module__divider___h6Yux`,scaleIn:`styles-module__scaleIn___QpQ8E`};if(typeof document<`u`){let e=document.getElementById(`feedback-tool-styles-settings-panel-styles`);e||(e=document.createElement(`style`),e.id=`feedback-tool-styles-settings-panel-styles`,document.head.appendChild(e)),e.textContent=Ci}var $=wi;function Ti({settings:e,onSettingsChange:t,isDarkMode:n,onToggleTheme:r,isDevMode:i,connectionStatus:a,endpoint:o,isVisible:s,toolbarNearBottom:c,settingsPage:l,onSettingsPageChange:d,onHideToolbar:f}){return(0,u.jsx)(`div`,{className:`${$.settingsPanel} ${s?$.enter:$.exit}`,style:c?{bottom:`auto`,top:`calc(100% + 0.5rem)`}:void 0,"data-agentation-settings-panel":!0,children:(0,u.jsxs)(`div`,{className:$.settingsPanelContainer,children:[(0,u.jsxs)(`div`,{className:`${$.settingsPage} ${l===`automations`?$.slideLeft:``}`,children:[(0,u.jsxs)(`div`,{className:$.settingsHeader,children:[(0,u.jsx)(`a`,{className:$.settingsBrand,href:`https://agentation.com`,target:`_blank`,rel:`noopener noreferrer`,children:(0,u.jsx)(`svg`,{width:`72`,height:`16`,viewBox:`0 0 676 151`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`,children:(0,u.jsx)(`path`,{d:`M79.6666 100.561L104.863 15.5213C107.828 4.03448 99.1201 -3.00582 88.7449 1.25541L3.52015 39.6065C1.48217 40.5329 0 42.7562 0 45.1647C0 48.6848 2.77907 51.4639 6.29922 51.4639C7.22558 51.4639 8.15193 51.2786 9.07829 50.9081L93.7472 12.7422C97.2674 11.0748 93.7472 8.29572 92.6356 12.1864L67.624 97.2259C66.5123 100.931 69.4767 105.193 73.7379 105.193C76.517 105.193 79.1108 103.155 79.6666 100.561ZM663.641 100.005C665.679 107.231 677.537 104.081 675.499 96.8553L666.05 66.2856C663.456 57.7631 655.489 55.7251 648.82 61.098L618.991 86.6654C617.324 87.9623 621.029 89.815 621.214 88.1476L625.846 61.6538C626.958 55.3546 624.179 50.5375 615.841 50.5375L579.158 51.0934C576.008 51.0934 578.417 53.8724 578.417 57.022C578.417 60.1716 580.825 61.6538 583.975 61.6538L616.212 60.9127C616.397 60.9127 614.544 59.6158 614.544 59.8011L609.727 88.7034C607.875 99.6344 617.694 102.784 626.031 95.7437L655.86 70.1763L654.192 69.6205L663.641 100.005ZM571.191 89.0739C555.443 88.7034 562.298 61.4685 578.787 61.8391C594.72 62.0243 587.124 89.2592 571.191 89.0739ZM571.006 100.375C601.575 100.931 611.024 51.6492 579.158 51.0934C547.847 50.5375 540.065 99.8197 571.006 100.375ZM521.909 46.4616C525.985 46.4616 529.505 42.9414 529.505 38.6802C529.505 34.4189 525.985 31.0841 521.909 31.0841C517.833 31.0841 514.127 34.6042 514.127 38.6802C514.127 42.7562 517.648 46.4616 521.909 46.4616ZM472.256 103.525C493.192 103.71 515.98 73.3259 519.13 62.3949L509.866 60.9127C505.234 73.3259 497.638 101.672 519.871 102.043C536.545 102.228 552.479 85.3685 563.595 70.1763C564.151 69.2499 564.706 68.1383 564.706 66.8414C564.706 63.6918 563.965 61.098 560.816 61.098C558.963 61.098 557.296 62.0243 556.184 63.5065C546.365 77.0313 530.802 90.9266 522.094 90.7414C511.904 90.5561 517.462 71.4732 519.871 64.9887C523.391 55.7251 512.831 53.5019 509.681 60.9127C506.531 68.6941 488.19 92.4088 475.035 92.2235C467.439 92.0383 464.29 83.8863 472.441 59.9864L486.707 17.7445C487.634 14.4097 485.41 10.519 481.334 10.519C478.741 10.519 476.517 12.1864 475.962 14.4097L461.696 56.4662C451.506 86.4801 455.211 103.155 472.256 103.525ZM447.43 42.5709L496.527 41.4593C499.306 41.4593 501.529 39.0507 501.529 36.2717C501.529 33.3073 499.306 31.0841 496.341 31.0841L447.245 32.1957C444.466 32.1957 442.242 34.4189 442.242 37.3833C442.242 40.1624 444.466 42.5709 447.43 42.5709ZM422.974 106.304C435.387 106.489 457.249 94.8173 472.441 53.8724C473.553 50.7228 472.071 48.3143 468.365 48.3143C466.142 48.3143 464.29 49.6112 463.548 51.6492C450.394 87.2212 431.682 96.1142 424.456 95.929C419.454 95.929 417.972 93.3352 418.713 85.5538C419.454 78.1429 410.376 74.9933 406.114 81.1073C401.297 87.777 394.442 94.2615 385.549 94.0763C370.172 93.891 376.471 67.0267 399.815 67.3972C408.338 67.5825 414.452 71.4732 417.045 76.6608C417.786 78.3282 419.454 79.6251 421.492 79.6251C424.271 79.6251 426.679 77.2166 426.679 74.4375C426.679 73.6964 426.494 72.9553 426.124 72.2143C421.862 63.6918 412.414 57.3926 400 57.2073C363.502 56.6515 353.497 104.451 383.326 104.822C397.036 105.193 410.005 94.0763 413.34 85.9243C412.599 86.8507 408.338 86.6654 408.523 84.4422C407.411 97.4111 410.931 106.119 422.974 106.304ZM335.897 104.266C335.897 115.012 347.569 117.606 347.569 103.34C347.569 89.0739 358.5 54.4282 361.464 45.1647L396.666 43.6825C405.929 43.1267 404.262 33.1221 397.036 33.3073L364.984 34.4189L368.875 22.7469C369.801 20.1531 370.542 17.9298 370.542 16.2624C370.542 13.4833 368.504 11.8159 365.911 11.8159C362.946 11.8159 360.352 12.7422 357.573 21.0794L352.942 35.16L330.153 36.0864C326.263 36.4569 323.483 38.1244 323.483 41.6445C323.483 45.5352 326.448 47.0174 330.709 46.8321L349.421 45.9058C345.901 56.6515 335.897 90.7414 335.897 104.266ZM186.939 78.6988C193.979 56.4662 212.877 54.984 212.877 62.9507C212.877 68.3236 203.984 77.0313 186.939 78.6988ZM113.942 150.955C142.844 152.437 159.704 111.492 160.63 80.5515C161.556 73.3259 153.96 70.3616 148.773 75.7344C141.918 83.1453 129.505 93.1499 119.685 93.1499C103.011 93.1499 116.165 59.8011 143.956 59.8011C149.514 59.8011 153.59 61.6538 156.184 64.0623C160.815 68.3236 170.82 62.0243 165.818 56.0957C161.927 51.4639 155.072 48.129 144.882 48.129C102.455 48.129 83.7426 105.007 116.721 105.007C134.692 105.007 151.367 88.3329 155.257 82.7747C154.516 83.5158 149.329 81.2925 149.699 79.4398L149.143 83.5158C148.958 107.045 134.322 141.506 116.536 139.838C113.386 139.468 112.089 137.43 112.089 134.836C112.089 128.907 122.094 119.273 145.067 113.53C159.518 109.824 152.293 101.487 143.4 104.081C111.163 113.53 99.6759 127.425 99.6759 137.8C99.6759 145.026 105.605 150.584 113.942 150.955ZM194.72 109.454C214.359 109.454 239 95.3732 251.228 77.9577C250.301 82.96 246.596 96.8553 246.596 101.487C246.596 110.01 254.748 109.454 261.232 102.784L288.097 75.5491L290.32 85.7391C293.284 99.4491 299.213 104.822 308.847 104.822C326.263 104.822 342.196 85.7391 349.421 74.8081L344.049 63.6918C339.787 74.8081 321.631 92.5941 311.626 92.5941C306.994 92.5941 304.771 89.815 303.289 83.7011L300.325 71.2879C297.916 60.7275 289.023 58.3189 279.018 68.1383L261.788 84.8127L264.382 69.991C266.235 59.2453 255.674 58.1337 250.116 65.915C241.779 77.0313 216.767 97.7817 196.387 97.7817C187.865 97.7817 185.456 93.7057 185.456 88.3329C230.848 84.998 239.185 47.2027 208.986 47.2027C172.858 47.2027 157.11 109.454 194.72 109.454Z`,fill:`currentColor`})})}),(0,u.jsxs)(`p`,{className:$.settingsVersion,children:[`v`,`3.0.2`]}),(0,u.jsx)(`button`,{className:$.themeToggle,onClick:r,title:n?`Switch to light mode`:`Switch to dark mode`,children:(0,u.jsx)(`span`,{className:$.themeIconWrapper,children:(0,u.jsx)(`span`,{className:$.themeIcon,children:n?(0,u.jsx)(w,{size:20}):(0,u.jsx)(T,{size:20})},n?`sun`:`moon`)})})]}),(0,u.jsx)(`div`,{className:$.divider}),(0,u.jsxs)(`div`,{className:$.settingsSection,children:[(0,u.jsxs)(`div`,{className:$.settingsRow,children:[(0,u.jsxs)(`div`,{className:$.settingsLabel,children:[`Output Detail`,(0,u.jsx)(Se,{content:`Controls how much detail is included in the copied output`})]}),(0,u.jsxs)(`button`,{className:$.cycleButton,onClick:()=>{t({outputDetail:ii[(ii.findIndex(t=>t.value===e.outputDetail)+1)%ii.length].value})},children:[(0,u.jsx)(`span`,{className:$.cycleButtonText,children:ii.find(t=>t.value===e.outputDetail)?.label},e.outputDetail),(0,u.jsx)(`span`,{className:$.cycleDots,children:ii.map(t=>(0,u.jsx)(`span`,{className:`${$.cycleDot} ${e.outputDetail===t.value?$.active:``}`},t.value))})]})]}),(0,u.jsxs)(`div`,{className:`${$.settingsRow} ${$.settingsRowMarginTop} ${i?``:$.settingsRowDisabled}`,children:[(0,u.jsxs)(`div`,{className:$.settingsLabel,children:[`React Components`,(0,u.jsx)(Se,{content:i?`Include React component names in annotations`:`Disabled — production builds minify component names, making detection unreliable. Use in development mode.`})]}),(0,u.jsx)(mi,{checked:i&&e.reactEnabled,onChange:e=>t({reactEnabled:e.target.checked}),disabled:!i})]}),(0,u.jsxs)(`div`,{className:`${$.settingsRow} ${$.settingsRowMarginTop}`,children:[(0,u.jsxs)(`div`,{className:$.settingsLabel,children:[`Hide Until Restart`,(0,u.jsx)(Se,{content:`Hides the toolbar until you open a new tab`})]}),(0,u.jsx)(mi,{checked:!1,onChange:e=>{e.target.checked&&f()}})]})]}),(0,u.jsx)(`div`,{className:$.divider}),(0,u.jsxs)(`div`,{className:$.settingsSection,children:[(0,u.jsx)(`div`,{className:`${$.settingsLabel} ${$.settingsLabelMarker}`,children:`Marker Color`}),(0,u.jsx)(`div`,{className:$.colorOptions,children:Ai.map(n=>(0,u.jsx)(`button`,{className:`${$.colorOption} ${e.annotationColorId===n.id?$.selected:``}`,style:{"--swatch":n.srgb,"--swatch-p3":n.p3},onClick:()=>t({annotationColorId:n.id}),title:n.label,type:`button`},n.id))})]}),(0,u.jsx)(`div`,{className:$.divider}),(0,u.jsxs)(`div`,{className:$.settingsSection,children:[(0,u.jsx)(Si,{className:`checkbox-field`,label:`Clear on copy/send`,checked:e.autoClearAfterCopy,onChange:e=>t({autoClearAfterCopy:e.target.checked}),tooltip:`Automatically clear annotations after copying`}),(0,u.jsx)(Si,{className:$.checkboxField,label:`Block page interactions`,checked:e.blockInteractions,onChange:e=>t({blockInteractions:e.target.checked})})]}),(0,u.jsx)(`div`,{className:$.divider}),(0,u.jsxs)(`button`,{className:$.settingsNavLink,onClick:()=>d(`automations`),children:[(0,u.jsx)(`span`,{children:`Manage MCP & Webhooks`}),(0,u.jsxs)(`span`,{className:$.settingsNavLinkRight,children:[o&&a!==`disconnected`&&(0,u.jsx)(`span`,{className:`${$.mcpNavIndicator} ${$[a]}`}),(0,u.jsx)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 16 16`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`,children:(0,u.jsx)(`path`,{d:`M7.5 12.5L12 8L7.5 3.5`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`})})]})]})]}),(0,u.jsxs)(`div`,{className:`${$.settingsPage} ${$.automationsPage} ${l===`automations`?$.slideIn:``}`,children:[(0,u.jsxs)(`button`,{className:$.settingsBackButton,onClick:()=>d(`main`),children:[(0,u.jsx)(oe,{size:16}),(0,u.jsx)(`span`,{children:`Manage MCP & Webhooks`})]}),(0,u.jsx)(`div`,{className:$.divider}),(0,u.jsxs)(`div`,{className:$.settingsSection,children:[(0,u.jsxs)(`div`,{className:$.settingsRow,children:[(0,u.jsxs)(`span`,{className:$.automationHeader,children:[`MCP Connection`,(0,u.jsx)(Se,{content:`Connect via Model Context Protocol to let AI agents like Claude Code receive annotations in real-time.`})]}),o&&(0,u.jsx)(`div`,{className:`${$.mcpStatusDot} ${$[a]}`,title:a===`connected`?`Connected`:a===`connecting`?`Connecting...`:`Disconnected`})]}),(0,u.jsxs)(`p`,{className:$.automationDescription,style:{paddingBottom:6},children:[`MCP connection allows agents to receive and act on annotations.`,` `,(0,u.jsx)(`a`,{href:`https://agentation.dev/mcp`,target:`_blank`,rel:`noopener noreferrer`,className:$.learnMoreLink,children:`Learn more`})]})]}),(0,u.jsx)(`div`,{className:$.divider}),(0,u.jsxs)(`div`,{className:`${$.settingsSection} ${$.settingsSectionGrow}`,children:[(0,u.jsxs)(`div`,{className:$.settingsRow,children:[(0,u.jsxs)(`span`,{className:$.automationHeader,children:[`Webhooks`,(0,u.jsx)(Se,{content:`Send annotation data to any URL endpoint when annotations change. Useful for custom integrations.`})]}),(0,u.jsxs)(`div`,{className:$.autoSendContainer,children:[(0,u.jsx)(`label`,{htmlFor:`agentation-auto-send`,className:`${$.autoSendLabel} ${e.webhooksEnabled?$.active:``} ${e.webhookUrl?``:$.disabled}`,children:`Auto-Send`}),(0,u.jsx)(mi,{id:`agentation-auto-send`,checked:e.webhooksEnabled,onChange:e=>t({webhooksEnabled:e.target.checked}),disabled:!e.webhookUrl})]})]}),(0,u.jsx)(`p`,{className:$.automationDescription,children:`The webhook URL will receive live annotation changes and annotation data.`}),(0,u.jsx)(`textarea`,{className:$.webhookUrlInput,placeholder:`Webhook URL`,value:e.webhookUrl,onKeyDown:e=>e.stopPropagation(),onChange:e=>t({webhookUrl:e.target.value})})]})]})]})})}function Ei(e,t=`filtered`){let{name:n,path:r}=Kt(e);if(t===`off`)return{name:n,elementName:n,path:r,reactComponents:null};let i=Br(e,{mode:t});return{name:i.path?`${i.path} ${n}`:n,elementName:n,path:r,reactComponents:i.path}}var Di=!1,Oi={outputDetail:`standard`,autoClearAfterCopy:!1,annotationColorId:`blue`,blockInteractions:!0,reactEnabled:!0,markerClickBehavior:`edit`,webhookUrl:``,webhooksEnabled:!0},ki=e=>{if(!e||!e.trim())return!1;try{let t=new URL(e.trim());return t.protocol===`http:`||t.protocol===`https:`}catch{return!1}},Ai=[{id:`indigo`,label:`Indigo`,srgb:`#6155F5`,p3:`color(display-p3 0.38 0.33 0.96)`},{id:`blue`,label:`Blue`,srgb:`#0088FF`,p3:`color(display-p3 0.00 0.53 1.00)`},{id:`cyan`,label:`Cyan`,srgb:`#00C3D0`,p3:`color(display-p3 0.00 0.76 0.82)`},{id:`green`,label:`Green`,srgb:`#34C759`,p3:`color(display-p3 0.20 0.78 0.35)`},{id:`yellow`,label:`Yellow`,srgb:`#FFCC00`,p3:`color(display-p3 1.00 0.80 0.00)`},{id:`orange`,label:`Orange`,srgb:`#FF8D28`,p3:`color(display-p3 1.00 0.55 0.16)`},{id:`red`,label:`Red`,srgb:`#FF383C`,p3:`color(display-p3 1.00 0.22 0.24)`}];(()=>{if(typeof document>`u`||document.getElementById(`agentation-color-tokens`))return;let e=document.createElement(`style`);e.id=`agentation-color-tokens`,e.textContent=[...Ai.map(e=>`
      [data-agentation-accent="${e.id}"] {
        --agentation-color-accent: ${e.srgb};
      }

      @supports (color: color(display-p3 0 0 0)) {
        [data-agentation-accent="${e.id}"] {
          --agentation-color-accent: ${e.p3};
        }
      }
    `),`:root {
      ${Ai.map(e=>`--agentation-color-${e.id}: ${e.srgb};`).join(`
`)}
    }`,`@supports (color: color(display-p3 0 0 0)) {
      :root {
        ${Ai.map(e=>`--agentation-color-${e.id}: ${e.p3};`).join(`
`)}
      }
    }`].join(``),document.head.appendChild(e)})();function ji(e,t){let n=document.elementFromPoint(e,t);if(!n)return null;for(;n?.shadowRoot;){let r=n.shadowRoot.elementFromPoint(e,t);if(!r||r===n)break;n=r}return n}function Mi(e){let t=e;for(;t&&t!==document.body;){let e=window.getComputedStyle(t).position;if(e===`fixed`||e===`sticky`)return!0;t=t.parentElement}return!1}function Ni(e){return e.status!==`resolved`&&e.status!==`dismissed`}function Pi(e){let t=$r(e),n=t.found?t:ti(e);if(n.found&&n.source)return ei(n.source,`path`)}function Fi({demoAnnotations:e,demoDelay:t=1e3,enableDemoMode:n=!1,onAnnotationAdd:r,onAnnotationDelete:i,onAnnotationUpdate:a,onAnnotationsClear:o,onCopy:s,onSubmit:d,copyToClipboard:f=!0,endpoint:p,sessionId:m,onSessionCreated:h,webhookUrl:g,className:_}={}){let[y,C]=(0,c.useState)(!1),[w,T]=(0,c.useState)([]),[ie,ae]=(0,c.useState)(!0),[oe,E]=(0,c.useState)(()=>gr()),[ce,le]=(0,c.useState)(!1),D=(0,c.useRef)(null);(0,c.useEffect)(()=>{let e=e=>{let t=D.current;t&&t.contains(e.target)&&e.stopPropagation()},t=[`mousedown`,`click`,`pointerdown`];return t.forEach(t=>document.body.addEventListener(t,e)),()=>{t.forEach(t=>document.body.removeEventListener(t,e))}},[]);let[ue,O]=(0,c.useState)(!1),[pe,ge]=(0,c.useState)(!1),[ve,ye]=(0,c.useState)(null),[be,xe]=(0,c.useState)({x:0,y:0}),[j,M]=(0,c.useState)(null),[N,P]=(0,c.useState)(!1),[F,Ce]=(0,c.useState)(`idle`),[we,Te]=(0,c.useState)(!1),[Ee,De]=(0,c.useState)(!1),[Oe,ke]=(0,c.useState)(null),[Ae,je]=(0,c.useState)(null),[Me,Ne]=(0,c.useState)([]),[Pe,Fe]=(0,c.useState)(null),[Ie,Le]=(0,c.useState)(null),[I,Re]=(0,c.useState)(null),[ze,Be]=(0,c.useState)(null),[Ve,He]=(0,c.useState)([]),[Ue,We]=(0,c.useState)(0),[Ge,Ke]=(0,c.useState)(!1),[L,qe]=(0,c.useState)(!1),[Je,Ye]=(0,c.useState)(!1),[Xe,Ze]=(0,c.useState)(!1),[Qe,$e]=(0,c.useState)(!1),[et,tt]=(0,c.useState)(`main`),[nt,rt]=(0,c.useState)(!1),[R,it]=(0,c.useState)(!1),[at,ot]=(0,c.useState)(!1),[z,st]=(0,c.useState)([]),[ct,lt]=(0,c.useState)(null),ut=(0,c.useRef)(!1),[B,dt]=(0,c.useState)(!1),[ft,pt]=(0,c.useState)(!1),[mt,ht]=(0,c.useState)(1),[gt,_t]=(0,c.useState)(`new-page`),[vt,yt]=(0,c.useState)(``),[bt,xt]=(0,c.useState)(!1),[V,St]=(0,c.useState)(null),Ct=(0,c.useRef)(!1),wt=(0,c.useRef)({rearrange:null,placements:[]}),Tt=(0,c.useRef)({rearrange:null,placements:[]}),[Et,Dt]=(0,c.useState)(0),[Ot,kt]=(0,c.useState)(0),[At,jt]=(0,c.useState)(0),[Mt,Nt]=(0,c.useState)(0),Pt=(0,c.useRef)(new Set),Ft=(0,c.useRef)(new Set),It=(0,c.useRef)(null),Rt=(0,c.useRef)(),U=R&&y&&!at&&B;(0,c.useEffect)(()=>{if(U){pt(!1);let e=fe(()=>{pt(!0)});return()=>cancelAnimationFrame(e)}pt(!1)},[U]);let W=(0,c.useRef)(new Map),zt=(0,c.useRef)(new Map),Bt=(0,c.useRef)(),[Vt,Ut]=(0,c.useState)(!1),[Gt,Xt]=(0,c.useState)([]),Zt=(0,c.useRef)(Gt);Zt.current=Gt;let[Qt,$t]=(0,c.useState)(null),en=(0,c.useRef)(null);(0,c.useRef)(!1),(0,c.useRef)([]),(0,c.useRef)(0),(0,c.useRef)(null),(0,c.useRef)(null),(0,c.useRef)(1);let[nn,cn]=(0,c.useState)(!1),ln=(0,c.useRef)(null),[G,un]=(0,c.useState)([]),dn=(0,c.useRef)({cmd:!1,shift:!1}),fn=()=>{rt(!0)},pn=()=>{rt(!1)},mn=()=>{nn||(ln.current=k(()=>cn(!0),850))},hn=()=>{ln.current&&=(clearTimeout(ln.current),null),cn(!1),pn()};(0,c.useEffect)(()=>()=>{ln.current&&clearTimeout(ln.current)},[]);let[K,_n]=(0,c.useState)(()=>{try{let e=JSON.parse(localStorage.getItem(`feedback-toolbar-settings`)??``);return{...Oi,...e,annotationColorId:Ai.find(t=>t.id===e.annotationColorId)?e.annotationColorId:Oi.annotationColorId}}catch{return Oi}}),[vn,yn]=(0,c.useState)(!0),[bn,xn]=(0,c.useState)(!1),Sn=()=>{D.current?.classList.add(Z.disableTransitions),yn(e=>!e),fe(()=>{D.current?.classList.remove(Z.disableTransitions)})},[q,Cn]=(0,c.useState)(m??null),wn=(0,c.useRef)(!1),[En,Dn]=(0,c.useState)(p?`connecting`:`disconnected`),[J,On]=(0,c.useState)(null),[kn,An]=(0,c.useState)(!1),[jn,Mn]=(0,c.useState)(null),Nn=(0,c.useRef)(!1),[Pn,Fn]=(0,c.useState)(new Set),[In,Ln]=(0,c.useState)(new Set),[Rn,zn]=(0,c.useState)(!1),[Bn,Vn]=(0,c.useState)(!1),[Hn,Gn]=(0,c.useState)(!1),Kn=(0,c.useRef)(null),Qn=(0,c.useRef)(null),nr=(0,c.useRef)(null),or=(0,c.useRef)(null),ur=(0,c.useRef)(!1),dr=(0,c.useRef)(0),hr=(0,c.useRef)(null),Y=(0,c.useRef)(null),Cr=(0,c.useRef)(null),wr=(0,c.useRef)(null),Tr=(0,c.useRef)(null),X=typeof window<`u`?window.location.pathname:`/`;(0,c.useEffect)(()=>{if(Xe)$e(!0);else{rt(!1),tt(`main`);let e=k(()=>$e(!1),0);return()=>clearTimeout(e)}},[Xe]);let Er=y&&ie&&!R;(0,c.useEffect)(()=>{if(Er){ge(!1),O(!0),Fn(new Set);let e=k(()=>{Fn(e=>{let t=new Set(e);return w.forEach(e=>t.add(e.id)),t})},350);return()=>clearTimeout(e)}if(ue){ge(!0);let e=k(()=>{O(!1),ge(!1)},250);return()=>clearTimeout(e)}},[Er]),(0,c.useEffect)(()=>{qe(!0),We(window.scrollY);let e=Jn(X);T(e.filter(Ni)),Di||(xn(!0),Di=!0,k(()=>xn(!1),750));try{let e=localStorage.getItem(`feedback-toolbar-theme`);e!==null&&yn(e===`dark`)}catch{}try{let e=localStorage.getItem(`feedback-toolbar-position`);if(e){let t=JSON.parse(e);typeof t.x==`number`&&typeof t.y==`number`&&On(t)}}catch{}},[X]),(0,c.useEffect)(()=>{L&&localStorage.setItem(`feedback-toolbar-settings`,JSON.stringify(K))},[K,L]),(0,c.useEffect)(()=>{L&&localStorage.setItem(`feedback-toolbar-theme`,vn?`dark`:`light`)},[vn,L]);let Dr=(0,c.useRef)(!1);(0,c.useEffect)(()=>{let e=Dr.current;Dr.current=kn,e&&!kn&&J&&L&&localStorage.setItem(`feedback-toolbar-position`,JSON.stringify(J))},[kn,J,L]),(0,c.useEffect)(()=>{p&&L&&!wn.current&&(wn.current=!0,Dn(`connecting`),(async()=>{try{let e=fr(X),t=m||e,n=!1;if(t)try{let e=await yr(p,t);Cn(e.id),Dn(`connected`),pr(X,e.id),n=!0;let r=Jn(X),i=new Set(e.annotations.map(e=>e.id)),a=r.filter(e=>!i.has(e.id));if(a.length>0){let t=`${typeof window<`u`?window.location.origin:``}${X}`,n=(await Promise.allSettled(a.map(n=>br(p,e.id,{...n,sessionId:e.id,url:t})))).map((e,t)=>e.status===`fulfilled`?e.value:(console.warn(`[Agentation] Failed to sync annotation:`,e.reason),a[t])),r=[...e.annotations,...n];T(r.filter(Ni)),Zn(X,r.filter(Ni),e.id)}else T(e.annotations.filter(Ni)),Zn(X,e.annotations.filter(Ni),e.id)}catch(e){console.warn(`[Agentation] Could not join session, creating new:`,e),mr(X)}if(!n){let e=await vr(p,typeof window<`u`?window.location.href:`/`);Cn(e.id),Dn(`connected`),pr(X,e.id),h?.(e.id);let t=Xn(),n=typeof window<`u`?window.location.origin:``,r=[];for(let[i,a]of t){let t=a.filter(e=>!e._syncedTo);if(t.length===0)continue;let o=`${n}${i}`,s=i===X;r.push((async()=>{try{let n=s?e:await vr(p,o),r=(await Promise.allSettled(t.map(e=>br(p,n.id,{...e,sessionId:n.id,url:o})))).map((e,n)=>e.status===`fulfilled`?e.value:(console.warn(`[Agentation] Failed to sync annotation:`,e.reason),t[n])).filter(Ni);if(Zn(i,r,n.id),s){let e=new Set(t.map(e=>e.id));T(t=>{let n=t.filter(t=>!e.has(t.id));return[...r,...n]})}}catch(e){console.warn(`[Agentation] Failed to sync annotations for ${i}:`,e)}})())}await Promise.allSettled(r)}}catch(e){Dn(`disconnected`),console.warn(`[Agentation] Failed to initialize session, using local storage:`,e)}})())},[p,m,L,h,X]),(0,c.useEffect)(()=>{if(!p||!L)return;let e=async()=>{try{(await fetch(`${p}/health`)).ok?Dn(`connected`):Dn(`disconnected`)}catch{Dn(`disconnected`)}};e();let t=de(e,1e4);return()=>clearInterval(t)},[p,L]),(0,c.useEffect)(()=>{if(!p||!L||!q)return;let e=new EventSource(`${p}/sessions/${q}/events`),t=[`resolved`,`dismissed`],n=e=>{try{let n=JSON.parse(e.data);if(t.includes(n.payload?.status)){let e=n.payload.id,t=n.payload.kind;if(t===`placement`){for(let[t,n]of W.current)if(n===e){W.current.delete(t),st(e=>e.filter(e=>e.id!==t));break}}else if(t===`rearrange`){for(let[t,n]of zt.current)if(n===e){zt.current.delete(t),St(e=>{if(!e)return null;let n=e.sections.filter(e=>e.id!==t);return n.length===0?null:{...e,sections:n}});break}}else Ln(t=>new Set(t).add(e)),k(()=>{T(t=>t.filter(t=>t.id!==e)),Ln(t=>{let n=new Set(t);return n.delete(e),n})},150)}}catch{}};return e.addEventListener(`annotation.updated`,n),()=>{e.removeEventListener(`annotation.updated`,n),e.close()}},[p,L,q]),(0,c.useEffect)(()=>{if(!p||!L)return;let e=Y.current===`disconnected`,t=En===`connected`;Y.current=En,e&&t&&(async()=>{try{let e=Jn(X);if(e.length===0)return;let t=`${typeof window<`u`?window.location.origin:``}${X}`,n=q,r=[];if(n)try{r=(await yr(p,n)).annotations}catch{n=null}n||(n=(await vr(p,t)).id,Cn(n),pr(X,n));let i=new Set(r.map(e=>e.id)),a=e.filter(e=>!i.has(e.id));if(a.length>0){let e=(await Promise.allSettled(a.map(e=>br(p,n,{...e,sessionId:n,url:t})))).map((e,t)=>e.status===`fulfilled`?e.value:(console.warn(`[Agentation] Failed to sync annotation on reconnect:`,e.reason),a[t])),i=[...r,...e].filter(Ni);T(i),Zn(X,i,n)}}catch(e){console.warn(`[Agentation] Failed to sync on reconnect:`,e)}})()},[En,p,L,q,X]);let Or=(0,c.useCallback)(()=>{ce||(le(!0),Ze(!1),C(!1),k(()=>{_r(!0),E(!0),le(!1)},400))},[ce]);(0,c.useEffect)(()=>{if(!n||!L||!e||e.length===0||w.length>0)return;let r=[];return r.push(k(()=>{C(!0)},t-200)),e.forEach((e,n)=>{let i=t+n*300;r.push(k(()=>{let t=document.querySelector(e.selector);if(!t)return;let r=t.getBoundingClientRect(),{name:i,path:a}=Kt(t),o={id:`demo-${Date.now()}-${n}`,x:(r.left+r.width/2)/window.innerWidth*100,y:r.top+r.height/2+window.scrollY,comment:e.comment,element:i,elementPath:a,timestamp:Date.now(),selectedText:e.selectedText,boundingBox:{x:r.left,y:r.top+window.scrollY,width:r.width,height:r.height},nearbyText:qt(t),cssClasses:Yt(t)};T(e=>[...e,o])},i))}),()=>{r.forEach(clearTimeout)}},[n,L,e,t]),(0,c.useEffect)(()=>{let e=()=>{We(window.scrollY),Ke(!0),Tr.current&&clearTimeout(Tr.current),Tr.current=k(()=>{Ke(!1)},150)};return window.addEventListener(`scroll`,e,{passive:!0}),()=>{window.removeEventListener(`scroll`,e),Tr.current&&clearTimeout(Tr.current)}},[]),(0,c.useEffect)(()=>{L&&w.length>0?q?Zn(X,w,q):Yn(X,w):L&&w.length===0&&localStorage.removeItem(qn(X))},[w,X,L,q]),(0,c.useEffect)(()=>{if(L&&!ut.current){ut.current=!0;let e=$n(X);e.length>0&&st(e)}},[L,X]),(0,c.useEffect)(()=>{L&&ut.current&&!B&&(z.length>0?er(X,z):tr(X))},[z,X,L,B]),(0,c.useEffect)(()=>{if(L&&!Ct.current){Ct.current=!0;let e=rr(X);if(e){let t={...e,sections:e.sections.map(e=>({...e,currentRect:e.currentRect??{...e.originalRect}}))};St(t)}}},[L,X]),(0,c.useEffect)(()=>{L&&Ct.current&&!B&&(V?ir(X,V):ar(X))},[V,X,L,B]);let kr=(0,c.useRef)(!1);(0,c.useEffect)(()=>{if(L&&!kr.current){kr.current=!0;let e=sr(X);e&&(Tt.current={rearrange:e.rearrange,placements:e.placements||[]},e.purpose&&yt(e.purpose))}},[L,X]),(0,c.useEffect)(()=>{if(!L||!kr.current)return;let e=Tt.current;B?(V?.sections?.length??0)>0||z.length>0||vt?cr(X,{rearrange:V,placements:z,purpose:vt}):lr(X):(e.rearrange?.sections?.length??0)>0||e.placements.length>0||vt?cr(X,{rearrange:e.rearrange,placements:e.placements,purpose:vt}):lr(X)},[V,z,vt,B,X,L]),(0,c.useEffect)(()=>{R&&!V&&St({sections:[],originalOrder:[],detectedAt:Date.now()})},[R,V]),(0,c.useEffect)(()=>{if(!p||!q)return;let e=W.current,t=new Set(z.map(e=>e.id));for(let t of z){if(e.has(t.id))continue;e.set(t.id,``);let n=typeof window<`u`?window.location.pathname+window.location.search+window.location.hash:X;br(p,q,{id:t.id,x:t.x/window.innerWidth*100,y:t.y,comment:`Place ${t.type} at (${Math.round(t.x)}, ${Math.round(t.y)}), ${t.width}\xD7${t.height}px${t.text?` \u2014 "${t.text}"`:``}`,element:`[design:${t.type}]`,elementPath:`[placement]`,timestamp:t.timestamp,url:n,intent:`change`,severity:`important`,kind:`placement`,placement:{componentType:t.type,width:t.width,height:t.height,scrollY:t.scrollY,text:t.text}}).then(n=>{e.has(t.id)&&e.set(t.id,n.id)}).catch(n=>{console.warn(`[Agentation] Failed to sync placement annotation:`,n),e.delete(t.id)})}for(let[n,r]of e)t.has(n)||(e.delete(n),r&&Sr(p,r).catch(()=>{}))},[z,p,q,X]),(0,c.useEffect)(()=>{if(p&&q)return Bt.current&&clearTimeout(Bt.current),Bt.current=k(()=>{let e=zt.current;if(!V||V.sections.length===0){for(let[,t]of e)t&&Sr(p,t).catch(()=>{});e.clear();return}let t=new Set(V.sections.map(e=>e.id)),n=typeof window<`u`?window.location.pathname+window.location.search+window.location.hash:X;for(let t of V.sections){let r=t.originalRect,i=t.currentRect;if(!(Math.abs(r.x-i.x)>1||Math.abs(r.y-i.y)>1||Math.abs(r.width-i.width)>1||Math.abs(r.height-i.height)>1)){let n=e.get(t.id);n&&(e.delete(t.id),Sr(p,n).catch(()=>{}));continue}let a=e.get(t.id);a?xr(p,a,{comment:`Move ${t.label} section (${t.tagName}) \u2014 from (${Math.round(r.x)},${Math.round(r.y)}) ${Math.round(r.width)}\xD7${Math.round(r.height)} to (${Math.round(i.x)},${Math.round(i.y)}) ${Math.round(i.width)}\xD7${Math.round(i.height)}`}).catch(e=>{console.warn(`[Agentation] Failed to update rearrange annotation:`,e)}):(e.set(t.id,``),br(p,q,{id:t.id,x:i.x/window.innerWidth*100,y:i.y,comment:`Move ${t.label} section (${t.tagName}) \u2014 from (${Math.round(r.x)},${Math.round(r.y)}) ${Math.round(r.width)}\xD7${Math.round(r.height)} to (${Math.round(i.x)},${Math.round(i.y)}) ${Math.round(i.width)}\xD7${Math.round(i.height)}`,element:t.selector,elementPath:`[rearrange]`,timestamp:Date.now(),url:n,intent:`change`,severity:`important`,kind:`rearrange`,rearrange:{selector:t.selector,label:t.label,tagName:t.tagName,originalRect:r,currentRect:i}}).then(n=>{e.has(t.id)&&e.set(t.id,n.id)}).catch(n=>{console.warn(`[Agentation] Failed to sync rearrange annotation:`,n),e.delete(t.id)}))}for(let[n,r]of e)t.has(n)||(e.delete(n),r&&Sr(p,r).catch(()=>{}))},300),()=>{Bt.current&&clearTimeout(Bt.current)}},[V,p,q,X]);let Ar=(0,c.useRef)(new Map);(0,c.useLayoutEffect)(()=>{let e=V?.sections??[],t=new Set;if((R||at)&&y)for(let n of e){t.add(n.id);try{let e=document.querySelector(n.selector);if(!e)continue;if(!Ar.current.has(n.id)){let t={transform:e.style.transform,transformOrigin:e.style.transformOrigin,opacity:e.style.opacity,position:e.style.position,zIndex:e.style.zIndex,display:e.style.display},r=[],i=e.parentElement;for(;i&&i!==document.body;){let e=getComputedStyle(i);(e.overflow!==`visible`||e.overflowX!==`visible`||e.overflowY!==`visible`)&&(r.push({el:i,overflow:i.style.overflow}),i.style.overflow=`visible`),i=i.parentElement}getComputedStyle(e).display===`inline`&&(e.style.display=`inline-block`),Ar.current.set(n.id,{el:e,origStyles:t,ancestors:r}),e.style.transformOrigin=`top left`,e.style.zIndex=`9999`}}catch{}}for(let[e,n]of Ar.current)if(!t.has(e)){let{el:t,origStyles:r,ancestors:i}=n;t.style.transition=`transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1)`,t.style.transform=r.transform,t.style.transformOrigin=r.transformOrigin,t.style.opacity=r.opacity,t.style.position=r.position,t.style.zIndex=r.zIndex,Ar.current.delete(e),k(()=>{t.style.transition=``,t.style.display=r.display;for(let e of i)e.el.style.overflow=e.overflow},450)}},[V,R,at,y]),(0,c.useEffect)(()=>()=>{for(let[,e]of Ar.current){let{el:t,origStyles:n,ancestors:r}=e;t.style.transition=`transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1)`,t.style.transform=n.transform,t.style.transformOrigin=n.transformOrigin,t.style.opacity=n.opacity,t.style.position=n.position,t.style.zIndex=n.zIndex,k(()=>{t.style.transition=``,t.style.display=n.display;for(let e of r)e.el.style.overflow=e.overflow},450)}Ar.current.clear()},[]);let jr=(0,c.useCallback)(()=>{ot(!0),it(!1),lt(null),clearTimeout(Rt.current),Rt.current=k(()=>{ot(!1)},300)},[]),Mr=(0,c.useCallback)(()=>{R&&(ot(!0),it(!1),lt(null),clearTimeout(Rt.current),Rt.current=k(()=>{ot(!1)},300)),C(!1)},[R]),Nr=(0,c.useCallback)(()=>{Je||(me(),Ye(!0))},[Je]),Pr=(0,c.useCallback)(()=>{Je&&(he(),Ye(!1))},[Je]),Fr=(0,c.useCallback)(()=>{Je?Pr():Nr()},[Je,Nr,Pr]),Ir=(0,c.useCallback)(()=>{if(G.length===0)return;let e=G[0],t=e.element,n=G.length>1,r=G.map(e=>e.element.getBoundingClientRect());if(n){let e={left:Math.min(...r.map(e=>e.left)),top:Math.min(...r.map(e=>e.top)),right:Math.max(...r.map(e=>e.right)),bottom:Math.max(...r.map(e=>e.bottom))},n=G.slice(0,5).map(e=>e.name).join(`, `),i=G.length>5?` +${G.length-5} more`:``,a=r.map(e=>({x:e.left,y:e.top+window.scrollY,width:e.width,height:e.height})),o=G[G.length-1].element,s=r[r.length-1],c=s.left+s.width/2,l=s.top+s.height/2,u=Mi(o);M({x:c/window.innerWidth*100,y:u?l:l+window.scrollY,clientY:l,element:`${G.length} elements: ${n}${i}`,elementPath:`multi-select`,boundingBox:{x:e.left,y:e.top+window.scrollY,width:e.right-e.left,height:e.bottom-e.top},isMultiSelect:!0,isFixed:u,elementBoundingBoxes:a,multiSelectElements:G.map(e=>e.element),targetElement:o,fullPath:sn(t),accessibility:on(t),computedStyles:rn(t),computedStylesObj:tn(t),nearbyElements:Jt(t),cssClasses:Yt(t),nearbyText:qt(t),sourceFile:Pi(t)})}else{let n=r[0],i=Mi(t);M({x:n.left/window.innerWidth*100,y:i?n.top:n.top+window.scrollY,clientY:n.top,element:e.name,elementPath:e.path,boundingBox:{x:n.left,y:i?n.top:n.top+window.scrollY,width:n.width,height:n.height},isFixed:i,fullPath:sn(t),accessibility:on(t),computedStyles:rn(t),computedStylesObj:tn(t),nearbyElements:Jt(t),cssClasses:Yt(t),nearbyText:qt(t),reactComponents:e.reactComponents,sourceFile:Pi(t)})}un([]),ye(null)},[G]);(0,c.useEffect)(()=>{y||(M(null),Re(null),Be(null),He([]),ye(null),Ze(!1),un([]),dn.current={cmd:!1,shift:!1},Je&&Pr())},[y,Je,Pr]),(0,c.useEffect)(()=>()=>{he()},[]),(0,c.useEffect)(()=>{if(!y)return;let e=`p.span.h1.h2.h3.h4.h5.h6.li.td.th.label.blockquote.figcaption.caption.legend.dt.dd.pre.code.em.strong.b.i.u.s.a.time.address.cite.q.abbr.dfn.mark.small.sub.sup.[contenteditable]`.split(`.`).join(`, `),t=`:not([data-agentation-root]):not([data-agentation-root] *)`,n=document.createElement(`style`);return n.id=`feedback-cursor-styles`,n.textContent=`
      body ${t} {
        cursor: crosshair !important;
      }

      body :is(${e})${t} {
        cursor: text !important;
      }
    `,document.head.appendChild(n),()=>{let e=document.getElementById(`feedback-cursor-styles`);e&&e.remove()}},[y]),(0,c.useEffect)(()=>{if(Qt!==null&&y)return document.documentElement.setAttribute(`data-drawing-hover`,``),()=>document.documentElement.removeAttribute(`data-drawing-hover`)},[Qt,y]),(0,c.useEffect)(()=>{if(!y||j||Vt||R)return;let e=e=>{if(Wt(e.composedPath()[0]||e.target,`[data-feedback-toolbar]`)){ye(null);return}let t=ji(e.clientX,e.clientY);if(!t||Wt(t,`[data-feedback-toolbar]`)){ye(null);return}let{name:n,elementName:r,path:i,reactComponents:a}=Ei(t,`off`),o=t.getBoundingClientRect();ye({element:n,elementName:r,elementPath:i,rect:o,reactComponents:a}),xe({x:e.clientX,y:e.clientY})};return document.addEventListener(`mousemove`,e),()=>document.removeEventListener(`mousemove`,e)},[y,j,Vt,R,`off`,Gt]);let Lr=(0,c.useCallback)(e=>{if(Re(e),ke(null),je(null),Ne([]),e.elementBoundingBoxes?.length){let t=[];for(let n of e.elementBoundingBoxes){let e=ji(n.x+n.width/2,n.y+n.height/2-window.scrollY);e&&t.push(e)}He(t),Be(null)}else if(e.boundingBox){let t=e.boundingBox,n=ji(t.x+t.width/2,e.isFixed?t.y+t.height/2:t.y+t.height/2-window.scrollY);if(n){let e=n.getBoundingClientRect(),r=e.width/t.width,i=e.height/t.height;Be(r<.5||i<.5?null:n)}else Be(null);He([])}else Be(null),He([])},[]);(0,c.useEffect)(()=>{if(!y||Vt||R)return;let e=e=>{if(ur.current){ur.current=!1;return}let t=e.composedPath()[0]||e.target;if(Wt(t,`[data-feedback-toolbar]`)||Wt(t,`[data-annotation-popup]`)||Wt(t,`[data-annotation-marker]`))return;if(e.metaKey&&e.shiftKey&&!j&&!I){e.preventDefault(),e.stopPropagation();let t=ji(e.clientX,e.clientY);if(!t)return;let n=t.getBoundingClientRect(),{name:r,path:i,reactComponents:a}=Ei(t,`off`),o=G.findIndex(e=>e.element===t);un(o>=0?e=>e.filter((e,t)=>t!==o):e=>[...e,{element:t,rect:n,name:r,path:i,reactComponents:a??void 0}]);return}let n=Wt(t,`button, a, input, select, textarea, [role='button'], [onclick]`);if(K.blockInteractions&&n&&(e.preventDefault(),e.stopPropagation()),j){if(n&&!K.blockInteractions)return;e.preventDefault(),Cr.current?.shake();return}if(I){if(n&&!K.blockInteractions)return;e.preventDefault(),wr.current?.shake();return}e.preventDefault();let r=ji(e.clientX,e.clientY);if(!r)return;let{name:i,path:a,reactComponents:o}=Ei(r,`off`),s=r.getBoundingClientRect(),c=e.clientX/window.innerWidth*100,l=Mi(r),u=l?e.clientY:e.clientY+window.scrollY,d=window.getSelection(),f;d&&d.toString().trim().length>0&&(f=d.toString().trim().slice(0,500));let p=tn(r),m=rn(r);M({x:c,y:u,clientY:e.clientY,element:i,elementPath:a,selectedText:f,boundingBox:{x:s.left,y:l?s.top:s.top+window.scrollY,width:s.width,height:s.height},nearbyText:qt(r),cssClasses:Yt(r),isFixed:l,fullPath:sn(r),accessibility:on(r),computedStyles:m,computedStylesObj:p,nearbyElements:Jt(r),reactComponents:o??void 0,sourceFile:Pi(r),targetElement:r}),ye(null)};return document.addEventListener(`click`,e,!0),()=>document.removeEventListener(`click`,e,!0)},[y,Vt,R,j,I,K.blockInteractions,`off`,G]),(0,c.useEffect)(()=>{if(!y)return;let e=e=>{e.key===`Meta`&&(dn.current.cmd=!0),e.key===`Shift`&&(dn.current.shift=!0)},t=e=>{let t=dn.current.cmd&&dn.current.shift;e.key===`Meta`&&(dn.current.cmd=!1),e.key===`Shift`&&(dn.current.shift=!1);let n=dn.current.cmd&&dn.current.shift;t&&!n&&G.length>0&&Ir()},n=()=>{dn.current={cmd:!1,shift:!1},un([])};return document.addEventListener(`keydown`,e),document.addEventListener(`keyup`,t),window.addEventListener(`blur`,n),()=>{document.removeEventListener(`keydown`,e),document.removeEventListener(`keyup`,t),window.removeEventListener(`blur`,n)}},[y,G,Ir]),(0,c.useEffect)(()=>{if(!y||j||Vt||R)return;let e=e=>{let t=e.composedPath()[0]||e.target;Wt(t,`[data-feedback-toolbar]`)||Wt(t,`[data-annotation-marker]`)||Wt(t,`[data-annotation-popup]`)||new Set(`P.SPAN.H1.H2.H3.H4.H5.H6.LI.TD.TH.LABEL.BLOCKQUOTE.FIGCAPTION.CAPTION.LEGEND.DT.DD.PRE.CODE.EM.STRONG.B.I.U.S.A.TIME.ADDRESS.CITE.Q.ABBR.DFN.MARK.SMALL.SUB.SUP`.split(`.`)).has(t.tagName)||t.isContentEditable||(e.preventDefault(),Kn.current={x:e.clientX,y:e.clientY})};return document.addEventListener(`mousedown`,e),()=>document.removeEventListener(`mousedown`,e)},[y,j,Vt,R]),(0,c.useEffect)(()=>{if(!y||j)return;let e=e=>{if(!Kn.current)return;let t=e.clientX-Kn.current.x,n=e.clientY-Kn.current.y,r=t*t+n*n;if(!Hn&&r>=64&&(Qn.current=Kn.current,Gn(!0),e.preventDefault()),(Hn||r>=64)&&Qn.current){if(nr.current){let t=Math.min(Qn.current.x,e.clientX),n=Math.min(Qn.current.y,e.clientY),r=Math.abs(e.clientX-Qn.current.x),i=Math.abs(e.clientY-Qn.current.y);nr.current.style.transform=`translate(${t}px, ${n}px)`,nr.current.style.width=`${r}px`,nr.current.style.height=`${i}px`}let t=Date.now();if(t-dr.current<50)return;dr.current=t;let n=Qn.current.x,r=Qn.current.y,i=Math.min(n,e.clientX),a=Math.min(r,e.clientY),o=Math.max(n,e.clientX),s=Math.max(r,e.clientY),c=(i+o)/2,l=(a+s)/2,u=new Set,d=[[i,a],[o,a],[i,s],[o,s],[c,l],[c,a],[c,s],[i,l],[o,l]];for(let[e,t]of d){let n=document.elementsFromPoint(e,t);for(let e of n)e instanceof HTMLElement&&u.add(e)}let f=document.querySelectorAll(`button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th, div, span, section, article, aside, nav`);for(let e of f)if(e instanceof HTMLElement){let t=e.getBoundingClientRect(),n=t.left+t.width/2,r=t.top+t.height/2,c=n>=i&&n<=o&&r>=a&&r<=s,l=Math.min(t.right,o)-Math.max(t.left,i),d=Math.min(t.bottom,s)-Math.max(t.top,a),f=l>0&&d>0?l*d:0,p=t.width*t.height,m=p>0?f/p:0;(c||m>.5)&&u.add(e)}let p=[],m=new Set([`BUTTON`,`A`,`INPUT`,`IMG`,`P`,`H1`,`H2`,`H3`,`H4`,`H5`,`H6`,`LI`,`LABEL`,`TD`,`TH`,`SECTION`,`ARTICLE`,`ASIDE`,`NAV`]);for(let e of u){if(Wt(e,`[data-feedback-toolbar]`)||Wt(e,`[data-annotation-marker]`))continue;let t=e.getBoundingClientRect();if(!(t.width>window.innerWidth*.8&&t.height>window.innerHeight*.5)&&!(t.width<10||t.height<10)&&t.left<o&&t.right>i&&t.top<s&&t.bottom>a){let n=e.tagName,r=m.has(n);if(!r&&(n===`DIV`||n===`SPAN`)){let t=e.textContent&&e.textContent.trim().length>0,n=e.onclick!==null||e.getAttribute(`role`)===`button`||e.getAttribute(`role`)===`link`||e.classList.contains(`clickable`)||e.hasAttribute(`data-clickable`);(t||n)&&!e.querySelector(`p, h1, h2, h3, h4, h5, h6, button, a`)&&(r=!0)}if(r){let e=!1;for(let n of p)if(n.left<=t.left&&n.right>=t.right&&n.top<=t.top&&n.bottom>=t.bottom){e=!0;break}e||p.push(t)}}}if(or.current){let e=or.current;for(;e.children.length>p.length;)e.removeChild(e.lastChild);p.forEach((t,n)=>{let r=e.children[n];r||(r=document.createElement(`div`),r.className=Z.selectedElementHighlight,e.appendChild(r)),r.style.transform=`translate(${t.left}px, ${t.top}px)`,r.style.width=`${t.width}px`,r.style.height=`${t.height}px`})}}};return document.addEventListener(`mousemove`,e,{passive:!0}),()=>document.removeEventListener(`mousemove`,e)},[y,j,Hn,8]),(0,c.useEffect)(()=>{if(!y)return;let e=e=>{let t=Hn,n=Qn.current;if(Hn&&n){ur.current=!0;let t=Math.min(n.x,e.clientX),r=Math.min(n.y,e.clientY),i=Math.max(n.x,e.clientX),a=Math.max(n.y,e.clientY),o=[];document.querySelectorAll(`button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th`).forEach(e=>{if(!(e instanceof HTMLElement)||Wt(e,`[data-feedback-toolbar]`)||Wt(e,`[data-annotation-marker]`))return;let n=e.getBoundingClientRect();n.width>window.innerWidth*.8&&n.height>window.innerHeight*.5||n.width<10||n.height<10||n.left<i&&n.right>t&&n.top<a&&n.bottom>r&&o.push({element:e,rect:n})});let s=o.filter(({element:e})=>!o.some(({element:t})=>t!==e&&e.contains(t))),c=e.clientX/window.innerWidth*100,l=e.clientY+window.scrollY;if(s.length>0){let t=s.reduce((e,{rect:t})=>({left:Math.min(e.left,t.left),top:Math.min(e.top,t.top),right:Math.max(e.right,t.right),bottom:Math.max(e.bottom,t.bottom)}),{left:1/0,top:1/0,right:-1/0,bottom:-1/0}),n=s.slice(0,5).map(({element:e})=>Kt(e).name).join(`, `),r=s.length>5?` +${s.length-5} more`:``,i=s[0].element,a=tn(i),o=rn(i);M({x:c,y:l,clientY:e.clientY,element:`${s.length} elements: ${n}${r}`,elementPath:`multi-select`,boundingBox:{x:t.left,y:t.top+window.scrollY,width:t.right-t.left,height:t.bottom-t.top},isMultiSelect:!0,fullPath:sn(i),accessibility:on(i),computedStyles:o,computedStylesObj:a,nearbyElements:Jt(i),cssClasses:Yt(i),nearbyText:qt(i),sourceFile:Pi(i)})}else{let n=Math.abs(i-t),o=Math.abs(a-r);n>20&&o>20&&M({x:c,y:l,clientY:e.clientY,element:`Area selection`,elementPath:`region at (${Math.round(t)}, ${Math.round(r)})`,boundingBox:{x:t,y:r+window.scrollY,width:n,height:o},isMultiSelect:!0})}ye(null)}else t&&(ur.current=!0);Kn.current=null,Qn.current=null,Gn(!1),or.current&&(or.current.innerHTML=``)};return document.addEventListener(`mouseup`,e),()=>document.removeEventListener(`mouseup`,e)},[y,Hn]);let Rr=(0,c.useCallback)(async(e,t,n)=>{let r=K.webhookUrl||g;if(!r||!K.webhooksEnabled&&!n)return!1;try{return(await fetch(r,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({event:e,timestamp:Date.now(),url:typeof window<`u`?window.location.href:void 0,...t})})).ok}catch(e){return console.warn(`[Agentation] Webhook failed:`,e),!1}},[g,K.webhookUrl,K.webhooksEnabled]),zr=(0,c.useCallback)(e=>{if(!j)return;let t={id:Date.now().toString(),x:j.x,y:j.y,comment:e,element:j.element,elementPath:j.elementPath,timestamp:Date.now(),selectedText:j.selectedText,boundingBox:j.boundingBox,nearbyText:j.nearbyText,cssClasses:j.cssClasses,isMultiSelect:j.isMultiSelect,isFixed:j.isFixed,fullPath:j.fullPath,accessibility:j.accessibility,computedStyles:j.computedStyles,nearbyElements:j.nearbyElements,reactComponents:j.reactComponents,sourceFile:j.sourceFile,elementBoundingBoxes:j.elementBoundingBoxes,...p&&q?{sessionId:q,url:typeof window<`u`?window.location.href:void 0,status:`pending`}:{}};T(e=>[...e,t]),hr.current=t.id,k(()=>{hr.current=null},300),k(()=>{Fn(e=>new Set(e).add(t.id))},250),r?.(t),Rr(`annotation.add`,{annotation:t}),zn(!0),k(()=>{M(null),zn(!1)},150),window.getSelection()?.removeAllRanges(),p&&q&&br(p,q,t).then(e=>{e.id!==t.id&&(T(n=>n.map(n=>n.id===t.id?{...n,id:e.id}:n)),Fn(n=>{let r=new Set(n);return r.delete(t.id),r.add(e.id),r}))}).catch(e=>{console.warn(`[Agentation] Failed to sync annotation:`,e)})},[j,r,Rr,p,q]),Br=(0,c.useCallback)(()=>{zn(!0),k(()=>{M(null),zn(!1)},150)},[]),Vr=(0,c.useCallback)(e=>{let t=w.findIndex(t=>t.id===e),n=w[t];I?.id===e&&(Vn(!0),k(()=>{Re(null),Be(null),He([]),Vn(!1)},150)),Fe(e),Ln(t=>new Set(t).add(e)),n&&(i?.(n),Rr(`annotation.delete`,{annotation:n})),p&&Sr(p,e).catch(e=>{console.warn(`[Agentation] Failed to delete annotation from server:`,e)}),k(()=>{T(t=>t.filter(t=>t.id!==e)),Ln(t=>{let n=new Set(t);return n.delete(e),n}),Fe(null),t<w.length-1&&(Le(t),k(()=>Le(null),200))},150)},[w,I,i,Rr,p]),Hr=(0,c.useCallback)(e=>{if(!e){ke(null),je(null),Ne([]);return}if(ke(e.id),e.elementBoundingBoxes?.length){let t=[];for(let n of e.elementBoundingBoxes){let e=n.x+n.width/2,r=n.y+n.height/2-window.scrollY,i=document.elementsFromPoint(e,r).find(e=>!e.closest(`[data-annotation-marker]`)&&!e.closest(`[data-agentation-root]`));i&&t.push(i)}Ne(t),je(null)}else if(e.boundingBox){let t=e.boundingBox,n=ji(t.x+t.width/2,e.isFixed?t.y+t.height/2:t.y+t.height/2-window.scrollY);if(n){let e=n.getBoundingClientRect(),r=e.width/t.width,i=e.height/t.height;je(r<.5||i<.5?null:n)}else je(null);Ne([])}else je(null),Ne([])},[]),Ur=(0,c.useCallback)(e=>{if(!I)return;let t={...I,comment:e};T(e=>e.map(e=>e.id===I.id?t:e)),a?.(t),Rr(`annotation.update`,{annotation:t}),p&&xr(p,I.id,{comment:e}).catch(e=>{console.warn(`[Agentation] Failed to update annotation on server:`,e)}),Vn(!0),k(()=>{Re(null),Be(null),He([]),Vn(!1)},150)},[I,a,Rr,p]),Wr=(0,c.useCallback)(()=>{Vn(!0),k(()=>{Re(null),Be(null),He([]),Vn(!1)},150)},[]),Gr=(0,c.useCallback)(()=>{let e=w.length,t=z.length>0||!!V;if(e===0&&Gt.length===0&&!t)return;if(o?.(w),Rr(`annotations.clear`,{annotations:w}),p){Promise.all(w.map(e=>Sr(p,e.id).catch(e=>{console.warn(`[Agentation] Failed to delete annotation from server:`,e)})));for(let[,e]of W.current)e&&Sr(p,e).catch(()=>{});W.current.clear();for(let[,e]of zt.current)e&&Sr(p,e).catch(()=>{});zt.current.clear()}De(!0),Te(!0),Xt([]);let n=en.current;if(n){let e=n.getContext(`2d`);e&&e.clearRect(0,0,n.width,n.height)}(z.length>0||V)&&(jt(e=>e+1),Nt(e=>e+1),k(()=>{st([]),St(null)},200)),B&&dt(!1),vt&&yt(``),Tt.current={rearrange:null,placements:[]},lr(X),k(()=>{T([]),Fn(new Set),localStorage.removeItem(qn(X)),De(!1)},e*30+200),k(()=>Te(!1),1500)},[X,w,Gt,z,V,B,vt,o,Rr,p]),Kr=(0,c.useCallback)(async()=>{let e=typeof window<`u`?window.location.pathname+window.location.search+window.location.hash:X,t=R&&B,n;if(t){if(z.length===0&&!V&&!vt)return;n=``}else{if(n=ai(w,e,K.outputDetail),!n&&Gt.length===0&&z.length===0&&!V)return;n||=`## Page Feedback: ${e}
`}if(!t&&Gt.length>0){let e=new Set;for(let t of w)t.drawingIndex!=null&&e.add(t.drawingIndex);let t=en.current;t&&(t.style.visibility=`hidden`);let r=[],i=window.scrollY;for(let t=0;t<Gt.length;t++){if(e.has(t))continue;let n=Gt[t];if(n.points.length<2)continue;let a=n.fixed?n.points:n.points.map(e=>({x:e.x,y:e.y-i})),o=1/0,s=1/0,c=-1/0,l=-1/0;for(let e of a)o=Math.min(o,e.x),s=Math.min(s,e.y),c=Math.max(c,e.x),l=Math.max(l,e.y);let u=c-o,d=l-s,f=Math.hypot(u,d),p=a[0],m=a[a.length-1],h=Math.hypot(m.x-p.x,m.y-p.y),g,_=h<f*.35,v=u/Math.max(d,1);if(_&&f>20){let e=Math.max(u,d)*.15,t=0;for(let n of a){let r=n.x-o<e,i=c-n.x<e,a=n.y-s<e,u=l-n.y<e;(r||i)&&(a||u)&&t++}g=t>a.length*.15?`box`:`circle`}else g=v>3&&d<40?`underline`:h>f*.5?`arrow`:`drawing`;let y=Math.min(10,a.length),b=Math.max(1,Math.floor(a.length/y)),ee=new Set,x=[],te=[p];for(let e=b;e<a.length-1;e+=b)te.push(a[e]);te.push(m);for(let e of te){let t=ji(e.x,e.y);if(!t||ee.has(t)||Wt(t,`[data-feedback-toolbar]`))continue;ee.add(t);let{name:n}=Kt(t);x.includes(n)||x.push(n)}let ne=`${Math.round(o)},${Math.round(s)} \u2192 ${Math.round(c)},${Math.round(l)}`,S;S=(g===`circle`||g===`box`)&&x.length>0?`${g===`box`?`Boxed`:`Circled`} **${x[0]}**${x.length>1?` (and ${x.slice(1).join(`, `)})`:``} (region: ${ne})`:g===`underline`&&x.length>0?`Underlined **${x[0]}** (${ne})`:g===`arrow`&&x.length>=2?`Arrow from **${x[0]}** to **${x[x.length-1]}** (${Math.round(p.x)},${Math.round(p.y)} \u2192 ${Math.round(m.x)},${Math.round(m.y)})`:x.length>0?`${g===`arrow`?`Arrow`:`Drawing`} near **${x.join(`**, **`)}** (region: ${ne})`:`Drawing at ${ne}`,r.push(S)}t&&(t.style.visibility=``),r.length>0&&(n+=`
**Drawings:**
`,r.forEach((e,t)=>{n+=`${t+1}. ${e}
`}))}if((z.length>0||t&&vt)&&(n+=`
`+Un(z,{width:window.innerWidth,height:window.innerHeight},{blankCanvas:B,wireframePurpose:vt||void 0},K.outputDetail)),V){let e=Wn(V,K.outputDetail,{width:window.innerWidth,height:window.innerHeight});e&&(n+=`
`+e)}if(f)try{await navigator.clipboard.writeText(n)}catch{}s?.(n),P(!0),k(()=>P(!1),2e3),K.autoClearAfterCopy&&k(()=>Gr(),500)},[w,Gt,z,V,B,R,gt,vt,X,K.outputDetail,`off`,K.autoClearAfterCopy,Gr,f,s]),qr=(0,c.useCallback)(async()=>{let e=typeof window<`u`?window.location.pathname+window.location.search+window.location.hash:X,t=ai(w,e,K.outputDetail);if(!t&&z.length===0&&!V)return;if(t||=`## Page Feedback: ${e}
`,z.length>0&&(t+=`
`+Un(z,{width:window.innerWidth,height:window.innerHeight},{blankCanvas:B,wireframePurpose:vt||void 0},K.outputDetail)),V){let e=Wn(V,K.outputDetail,{width:window.innerWidth,height:window.innerHeight});e&&(t+=`
`+e)}d&&d(t,w),Ce(`sending`),await new Promise(e=>k(e,150));let n=await Rr(`submit`,{output:t,annotations:w},!0);Ce(n?`sent`:`failed`),k(()=>Ce(`idle`),2500),n&&K.autoClearAfterCopy&&k(()=>Gr(),500)},[d,Rr,w,z,V,B,gt,X,K.outputDetail,`off`,K.autoClearAfterCopy,Gr]);(0,c.useEffect)(()=>{if(!jn)return;let e=e=>{let t=e.clientX-jn.x,n=e.clientY-jn.y,r=Math.sqrt(t*t+n*n);if(!kn&&r>10&&An(!0),kn||r>10){let e=jn.toolbarX+t,r=jn.toolbarY+n,i=20-(337-(y?En===`connected`?297:257:44)),a=window.innerWidth-20-337;e=Math.max(i,Math.min(a,e)),r=Math.max(20,Math.min(window.innerHeight-44-20,r)),On({x:e,y:r})}},t=()=>{kn&&(Nn.current=!0),An(!1),Mn(null)};return document.addEventListener(`mousemove`,e),document.addEventListener(`mouseup`,t),()=>{document.removeEventListener(`mousemove`,e),document.removeEventListener(`mouseup`,t)}},[jn,kn,y,En]);let Jr=(0,c.useCallback)(e=>{if(e.target.closest(`button`)||e.target.closest(`[data-agentation-settings-panel]`))return;let t=e.currentTarget.parentElement;if(!t)return;let n=t.getBoundingClientRect(),r=J?.x??n.left,i=J?.y??n.top;Mn({x:e.clientX,y:e.clientY,toolbarX:r,toolbarY:i})},[J]);if((0,c.useEffect)(()=>{if(!J)return;let e=()=>{let e=J.x,t=J.y,n=20-(337-(y?En===`connected`?297:257:44)),r=window.innerWidth-20-337;e=Math.max(n,Math.min(r,e)),t=Math.max(20,Math.min(window.innerHeight-44-20,t)),(e!==J.x||t!==J.y)&&On({x:e,y:t})};return e(),window.addEventListener(`resize`,e),()=>window.removeEventListener(`resize`,e)},[J,y,En]),(0,c.useEffect)(()=>{let e=e=>{let t=e.target,n=t.tagName===`INPUT`||t.tagName===`TEXTAREA`||t.isContentEditable;if(e.key===`Escape`){if(R){ct?lt(null):jr();return}if(Vt){Ut(!1);return}if(G.length>0){un([]);return}j||y&&(fn(),C(!1))}if((e.metaKey||e.ctrlKey)&&e.shiftKey&&(e.key===`f`||e.key===`F`)){e.preventDefault(),fn(),y?Mr():C(!0);return}if(!(n||e.metaKey||e.ctrlKey)&&((e.key===`p`||e.key===`P`)&&(e.preventDefault(),fn(),Fr()),(e.key===`l`||e.key===`L`)&&(e.preventDefault(),fn(),Vt&&Ut(!1),Xe&&Ze(!1),j&&Br(),R?jr():it(!0)),(e.key===`h`||e.key===`H`)&&w.length>0&&(e.preventDefault(),fn(),ae(e=>!e)),(e.key===`c`||e.key===`C`)&&(w.length>0||z.length>0||V)&&(e.preventDefault(),fn(),Kr()),(e.key===`x`||e.key===`X`)&&(w.length>0||z.length>0||V)&&(e.preventDefault(),fn(),Gr(),z.length>0&&st([]),V&&St(null)),e.key===`s`||e.key===`S`)){let t=ki(K.webhookUrl)||ki(g||``);w.length>0&&t&&F===`idle`&&(e.preventDefault(),fn(),qr())}};return document.addEventListener(`keydown`,e),()=>document.removeEventListener(`keydown`,e)},[y,Vt,R,ct,z,V,j,w.length,K.webhookUrl,g,F,qr,Fr,Kr,Gr,G]),!L||oe)return null;let Yr=w.length>0,Xr=w.filter(e=>!In.has(e.id)&&e.kind!==`placement`&&e.kind!==`rearrange`),Zr=Xr.length>0,Qr=w.filter(e=>In.has(e.id)),$r=e=>{let t=e.x/100*window.innerWidth,n=typeof e.y==`string`?parseFloat(e.y):e.y,r={};window.innerHeight-n-22-10<80&&(r.top=`auto`,r.bottom=`calc(100% + 10px)`);let i=t-100;return i<10?r.left=`calc(50% + ${10-i}px)`:i+200>window.innerWidth-10&&(r.left=`calc(50% - ${i+200-(window.innerWidth-10)}px)`),r};return(0,l.createPortal)((0,u.jsxs)(`div`,{ref:D,style:{display:`contents`},"data-agentation-theme":vn?`dark`:`light`,"data-agentation-accent":K.annotationColorId,"data-agentation-root":``,children:[(0,u.jsx)(`div`,{className:`${Z.toolbar}${_?` ${_}`:``}`,"data-feedback-toolbar":!0,"data-agentation-toolbar":!0,style:J?{left:J.x,top:J.y,right:`auto`,bottom:`auto`}:void 0,children:(0,u.jsxs)(`div`,{className:`${Z.toolbarContainer} ${y?Z.expanded:Z.collapsed} ${bn?Z.entrance:``} ${ce?Z.hiding:``} ${!K.webhooksEnabled&&(ki(K.webhookUrl)||ki(g||``))?Z.serverConnected:``}`,onClick:y?void 0:e=>{if(Nn.current){Nn.current=!1,e.preventDefault();return}C(!0)},onMouseDown:Jr,role:y?void 0:`button`,tabIndex:y?-1:0,title:y?void 0:`Start feedback mode`,children:[(0,u.jsxs)(`div`,{className:`${Z.toggleContent} ${y?Z.hidden:Z.visible}`,children:[(0,u.jsx)(v,{size:24}),Zr&&(0,u.jsx)(`span`,{className:`${Z.badge} ${y?Z.fadeOut:``} ${bn?Z.entrance:``}`,children:Xr.length})]}),(0,u.jsxs)(`div`,{className:`${Z.controlsContent} ${y?Z.visible:Z.hidden} ${J&&J.y<100?Z.tooltipBelow:``} ${nt||Xe?Z.tooltipsHidden:``} ${nn?Z.tooltipsInSession:``}`,onMouseEnter:mn,onMouseLeave:hn,children:[(0,u.jsxs)(`div`,{className:`${Z.buttonWrapper} ${J&&J.x<120?Z.buttonWrapperAlignLeft:``}`,children:[(0,u.jsx)(`button`,{className:Z.controlButton,onClick:e=>{e.stopPropagation(),fn(),Fr()},"data-active":Je,children:(0,u.jsx)(te,{size:24,isPaused:Je})}),(0,u.jsxs)(`span`,{className:Z.buttonTooltip,children:[Je?`Resume animations`:`Pause animations`,(0,u.jsx)(`span`,{className:Z.shortcut,children:`P`})]})]}),(0,u.jsxs)(`div`,{className:Z.buttonWrapper,children:[(0,u.jsx)(`button`,{className:`${Z.controlButton} ${vn?``:Z.light}`,onClick:e=>{e.stopPropagation(),fn(),Vt&&Ut(!1),Xe&&Ze(!1),j&&Br(),R?jr():it(!0)},"data-active":R,style:R&&B?{color:`#f97316`,background:`rgba(249, 115, 22, 0.25)`}:void 0,children:(0,u.jsx)(se,{size:21})}),(0,u.jsxs)(`span`,{className:Z.buttonTooltip,children:[R?`Exit layout mode`:`Layout mode`,(0,u.jsx)(`span`,{className:Z.shortcut,children:`L`})]})]}),(0,u.jsxs)(`div`,{className:Z.buttonWrapper,children:[(0,u.jsx)(`button`,{className:Z.controlButton,onClick:e=>{e.stopPropagation(),fn(),ae(!ie)},disabled:!Yr||R,children:(0,u.jsx)(x,{size:24,isOpen:ie})}),(0,u.jsxs)(`span`,{className:Z.buttonTooltip,children:[ie?`Hide markers`:`Show markers`,(0,u.jsx)(`span`,{className:Z.shortcut,children:`H`})]})]}),(0,u.jsxs)(`div`,{className:Z.buttonWrapper,children:[(0,u.jsx)(`button`,{className:`${Z.controlButton} ${N?Z.statusShowing:``}`,onClick:e=>{e.stopPropagation(),fn(),Kr()},disabled:R&&B?z.length===0&&!V?.sections?.length:!Yr&&Gt.length===0&&z.length===0&&!V?.sections?.length,"data-active":N,children:(0,u.jsx)(b,{size:24,copied:N,tint:R&&B&&(z.length>0||V?.sections?.length)?`#f97316`:void 0})}),(0,u.jsxs)(`span`,{className:Z.buttonTooltip,children:[R&&B?`Copy layout`:`Copy feedback`,(0,u.jsx)(`span`,{className:Z.shortcut,children:`C`})]})]}),(0,u.jsxs)(`div`,{className:`${Z.buttonWrapper} ${Z.sendButtonWrapper} ${y&&!K.webhooksEnabled&&(ki(K.webhookUrl)||ki(g||``))?Z.sendButtonVisible:``}`,children:[(0,u.jsxs)(`button`,{className:`${Z.controlButton} ${F===`sent`||F===`failed`?Z.statusShowing:``}`,onClick:e=>{e.stopPropagation(),fn(),qr()},disabled:!Yr||!ki(K.webhookUrl)&&!ki(g||``)||F===`sending`,"data-no-hover":F===`sent`||F===`failed`,tabIndex:ki(K.webhookUrl)||ki(g||``)?0:-1,children:[(0,u.jsx)(ee,{size:24,state:F}),Yr&&F===`idle`&&(0,u.jsx)(`span`,{className:Z.buttonBadge,children:w.length})]}),(0,u.jsxs)(`span`,{className:Z.buttonTooltip,children:[`Send Annotations`,(0,u.jsx)(`span`,{className:Z.shortcut,children:`S`})]})]}),(0,u.jsxs)(`div`,{className:Z.buttonWrapper,children:[(0,u.jsx)(`button`,{className:Z.controlButton,onClick:e=>{e.stopPropagation(),fn(),Gr()},disabled:!Yr&&Gt.length===0&&z.length===0&&!V?.sections?.length,"data-danger":!0,children:(0,u.jsx)(S,{size:24})}),(0,u.jsxs)(`span`,{className:Z.buttonTooltip,children:[`Clear all`,(0,u.jsx)(`span`,{className:Z.shortcut,children:`X`})]})]}),(0,u.jsxs)(`div`,{className:Z.buttonWrapper,children:[(0,u.jsx)(`button`,{className:Z.controlButton,onClick:e=>{e.stopPropagation(),fn(),R&&jr(),Ze(!Xe)},children:(0,u.jsx)(ne,{size:24})}),p&&En!==`disconnected`&&(0,u.jsx)(`span`,{className:`${Z.mcpIndicator} ${Z[En]} ${Xe?Z.hidden:``}`,title:En===`connected`?`MCP Connected`:`MCP Connecting...`}),(0,u.jsx)(`span`,{className:Z.buttonTooltip,children:`Settings`})]}),(0,u.jsx)(`div`,{className:Z.divider}),(0,u.jsxs)(`div`,{className:`${Z.buttonWrapper} ${J&&typeof window<`u`&&J.x>window.innerWidth-120?Z.buttonWrapperAlignRight:``}`,children:[(0,u.jsx)(`button`,{className:Z.controlButton,onClick:e=>{e.stopPropagation(),fn(),Mr()},children:(0,u.jsx)(re,{size:24})}),(0,u.jsxs)(`span`,{className:Z.buttonTooltip,children:[`Exit`,(0,u.jsx)(`span`,{className:Z.shortcut,children:`Esc`})]})]})]}),(0,u.jsx)(Ht,{visible:R&&y,activeType:ct,onSelect:e=>{lt(ct===e?null:e)},isDarkMode:vn,sectionCount:V?.sections.length??0,onDetectSections:()=>{let e=gn(),t=V?.sections??[],n=new Set(t.map(e=>e.selector)),r=e.filter(e=>!n.has(e.selector)),i=[...t,...r],a=[...V?.originalOrder??[],...r.map(e=>e.id)];St({sections:i,originalOrder:a,detectedAt:Date.now()})},placementCount:z.length,onClearPlacements:()=>{jt(e=>e+1),Nt(e=>e+1),k(()=>{St({sections:[],originalOrder:[],detectedAt:Date.now()})},200)},blankCanvas:B,onBlankCanvasChange:e=>{let t={sections:[],originalOrder:[],detectedAt:Date.now()};e?(wt.current={rearrange:V,placements:z},St(Tt.current.rearrange||t),st(Tt.current.placements),lt(null)):(Tt.current={rearrange:V,placements:z},St(wt.current.rearrange||t),st(wt.current.placements)),dt(e)},wireframePurpose:vt,onWireframePurposeChange:yt,Tooltip:Se,onDragStart:(e,t)=>{t.preventDefault();let n=A[e],r=null,i=!1,a=t.clientX,o=t.clientY,s=t.target.closest(`[data-feedback-toolbar]`)?.getBoundingClientRect().top??window.innerHeight,c=t=>{let c=t.clientX-a,l=t.clientY-o;if(!i&&(Math.abs(c)>4||Math.abs(l)>4)&&(i=!0,r=document.createElement(`div`),r.className=`${H.dragPreview}${B?` ${H.dragPreviewWireframe}`:``}`,document.body.appendChild(r)),!r)return;let u=Math.max(0,s-t.clientY),d=1-(1-Math.min(1,u/180))**2,f=Math.min(140,n.width*.18),p=Math.min(90,n.height*.18),m=28+(f-28)*d,h=20+(p-20)*d;r.style.width=`${m}px`,r.style.height=`${h}px`,r.style.left=`${t.clientX-m/2}px`,r.style.top=`${t.clientY-h/2}px`,r.style.opacity=`${.5+.5*d}`,r.textContent=d>.25?e:``},l=t=>{if(window.removeEventListener(`mousemove`,c),window.removeEventListener(`mouseup`,l),r&&document.body.removeChild(r),i){let r=n.width,i=n.height,a=window.scrollY,o=Math.max(0,t.clientX-r/2),s=Math.max(0,t.clientY+a-i/2),c={id:`dp-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,type:e,x:o,y:s,width:r,height:i,scrollY:a,timestamp:Date.now()};st(e=>[...e,c]),lt(null),Pt.current=new Set,Dt(e=>e+1)}};window.addEventListener(`mousemove`,c),window.addEventListener(`mouseup`,l)}}),(0,u.jsx)(Ti,{settings:K,onSettingsChange:e=>_n(t=>({...t,...e})),isDarkMode:vn,onToggleTheme:Sn,isDevMode:!1,connectionStatus:En,endpoint:p,isVisible:Qe,toolbarNearBottom:!!J&&J.y<230,settingsPage:et,onSettingsPageChange:tt,onHideToolbar:Or})]})}),(R||at)&&(0,u.jsx)(`div`,{className:`${H.blankCanvas} ${ft?H.visible:``} ${bt?H.gridActive:``}`,style:{"--canvas-opacity":mt},"data-feedback-toolbar":!0}),R&&B&&ft&&(0,u.jsxs)(`div`,{className:H.wireframeNotice,"data-feedback-toolbar":!0,children:[(0,u.jsxs)(`div`,{className:H.wireframeOpacityRow,children:[(0,u.jsx)(`span`,{className:H.wireframeOpacityLabel,children:`Toggle Opacity`}),(0,u.jsx)(`input`,{type:`range`,className:H.wireframeOpacitySlider,min:0,max:1,step:.01,value:mt,onChange:e=>ht(Number(e.target.value))})]}),(0,u.jsxs)(`div`,{className:H.wireframeNoticeTitleRow,children:[(0,u.jsx)(`span`,{className:H.wireframeNoticeTitle,children:`Wireframe Mode`}),(0,u.jsx)(`span`,{className:H.wireframeNoticeDivider}),(0,u.jsx)(`button`,{className:H.wireframeStartOver,onClick:()=>{jt(e=>e+1),St({sections:[],originalOrder:[],detectedAt:Date.now()}),Tt.current={rearrange:null,placements:[]},yt(``),lr(X)},children:`Start Over`})]}),`Drag components onto the canvas.`,(0,u.jsx)(`br`,{}),`Copied output will only include the wireframed layout.`]}),(R||at)&&(0,u.jsx)(Lt,{placements:z,onChange:st,activeComponent:at?null:ct,onActiveComponentChange:lt,isDarkMode:vn,exiting:at,onInteractionChange:xt,passthrough:!ct,extraSnapRects:V?.sections.map(e=>e.currentRect),deselectSignal:Et,clearSignal:At,wireframe:B,onSelectionChange:(e,t)=>{Pt.current=e,t||(Ft.current=new Set,kt(e=>e+1))},onDragMove:(e,t)=>{let n=Ft.current;if(n.size&&V){if(!It.current){It.current=new Map;for(let e of V.sections)n.has(e.id)&&It.current.set(e.id,{x:e.currentRect.x,y:e.currentRect.y})}for(let r of V.sections){if(!n.has(r.id)||!It.current.get(r.id))continue;let i=document.querySelector(`[data-rearrange-section="${r.id}"]`);i&&(i.style.transform=`translate(${e}px, ${t}px)`)}}},onDragEnd:(e,t,n)=>{let r=Ft.current,i=It.current;if(It.current=null,r.size&&V&&i){for(let e of r){let t=document.querySelector(`[data-rearrange-section="${e}"]`);t&&(t.style.transform=``)}n&&St(n=>n&&{...n,sections:n.sections.map(n=>{let r=i.get(n.id);return r?{...n,currentRect:{...n.currentRect,x:Math.max(0,r.x+e),y:Math.max(0,r.y+t)}}:n})})}}}),(R||at)&&V&&(0,u.jsx)(Tn,{rearrangeState:V,onChange:St,isDarkMode:vn,exiting:at,blankCanvas:B,extraSnapRects:z.map(e=>({x:e.x,y:e.y,width:e.width,height:e.height})),clearSignal:Mt,deselectSignal:Ot,onSelectionChange:(e,t)=>{Ft.current=e,t||(Pt.current=new Set,Dt(e=>e+1))},onDragMove:(e,t)=>{let n=Pt.current;if(n.size){if(!It.current){It.current=new Map;for(let e of z)n.has(e.id)&&It.current.set(e.id,{x:e.x,y:e.y})}for(let r of n){let n=document.querySelector(`[data-design-placement="${r}"]`);n&&(n.style.transform=`translate(${e}px, ${t}px)`)}}},onDragEnd:(e,t,n)=>{let r=Pt.current,i=It.current;if(It.current=null,r.size&&i){for(let e of r){let t=document.querySelector(`[data-design-placement="${e}"]`);t&&(t.style.transform=``)}n&&st(n=>n.map(n=>{let r=i.get(n.id);return r?{...n,x:Math.max(0,r.x+e),y:Math.max(0,r.y+t)}:n}))}}}),(0,u.jsx)(`canvas`,{ref:en,className:`${Z.drawCanvas} ${Vt?Z.active:``}`,style:{opacity:+!!Er,transition:`opacity 0.15s ease`},"data-feedback-toolbar":!0}),(0,u.jsxs)(`div`,{className:Z.markersLayer,"data-feedback-toolbar":!0,children:[ue&&Xr.filter(e=>!e.isFixed).map((e,t,n)=>(0,u.jsx)(ci,{annotation:e,globalIndex:Xr.findIndex(t=>t.id===e.id),layerIndex:t,layerSize:n.length,isExiting:pe,isClearing:Ee,isAnimated:Pn.has(e.id),isHovered:!pe&&Oe===e.id,isDeleting:Pe===e.id,isEditingAny:!!I,renumberFrom:Ie,markerClickBehavior:K.markerClickBehavior,tooltipStyle:$r(e),onHoverEnter:e=>!pe&&e.id!==hr.current&&Hr(e),onHoverLeave:()=>Hr(null),onClick:e=>K.markerClickBehavior===`delete`?Vr(e.id):Lr(e),onContextMenu:Lr},e.id)),ue&&!pe&&Qr.filter(e=>!e.isFixed).map(e=>(0,u.jsx)(ui,{annotation:e},e.id))]}),(0,u.jsxs)(`div`,{className:Z.fixedMarkersLayer,"data-feedback-toolbar":!0,children:[ue&&Xr.filter(e=>e.isFixed).map((e,t,n)=>(0,u.jsx)(ci,{annotation:e,globalIndex:Xr.findIndex(t=>t.id===e.id),layerIndex:t,layerSize:n.length,isExiting:pe,isClearing:Ee,isAnimated:Pn.has(e.id),isHovered:!pe&&Oe===e.id,isDeleting:Pe===e.id,isEditingAny:!!I,renumberFrom:Ie,markerClickBehavior:K.markerClickBehavior,tooltipStyle:$r(e),onHoverEnter:e=>!pe&&e.id!==hr.current&&Hr(e),onHoverLeave:()=>Hr(null),onClick:e=>K.markerClickBehavior===`delete`?Vr(e.id):Lr(e),onContextMenu:Lr},e.id)),ue&&!pe&&Qr.filter(e=>e.isFixed).map(e=>(0,u.jsx)(ui,{annotation:e,fixed:!0},e.id))]}),y&&(0,u.jsxs)(`div`,{className:Z.overlay,"data-feedback-toolbar":!0,style:j||I?{zIndex:99999}:void 0,children:[ve?.rect&&!j&&!Ge&&!Hn&&(0,u.jsx)(`div`,{className:`${Z.hoverHighlight} ${Z.enter}`,style:{left:ve.rect.left,top:ve.rect.top,width:ve.rect.width,height:ve.rect.height,borderColor:`color-mix(in srgb, var(--agentation-color-accent) 50%, transparent)`,backgroundColor:`color-mix(in srgb, var(--agentation-color-accent) 4%, transparent)`}}),G.filter(e=>document.contains(e.element)).map((e,t)=>{let n=e.element.getBoundingClientRect(),r=G.length>1;return(0,u.jsx)(`div`,{className:r?Z.multiSelectOutline:Z.singleSelectOutline,style:{position:`fixed`,left:n.left,top:n.top,width:n.width,height:n.height,...r?{}:{borderColor:`color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)`,backgroundColor:`color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)`}}},t)}),Oe&&!j&&(()=>{let e=w.find(e=>e.id===Oe);if(!e?.boundingBox)return null;if(e.elementBoundingBoxes?.length)return Me.length>0?Me.filter(e=>document.contains(e)).map((e,t)=>{let n=e.getBoundingClientRect();return(0,u.jsx)(`div`,{className:`${Z.multiSelectOutline} ${Z.enter}`,style:{left:n.left,top:n.top,width:n.width,height:n.height}},`hover-outline-live-${t}`)}):e.elementBoundingBoxes.map((e,t)=>(0,u.jsx)(`div`,{className:`${Z.multiSelectOutline} ${Z.enter}`,style:{left:e.x,top:e.y-Ue,width:e.width,height:e.height}},`hover-outline-${t}`));let t=Ae&&document.contains(Ae)?Ae.getBoundingClientRect():null,n=t?{x:t.left,y:t.top,width:t.width,height:t.height}:{x:e.boundingBox.x,y:e.isFixed?e.boundingBox.y:e.boundingBox.y-Ue,width:e.boundingBox.width,height:e.boundingBox.height},r=e.isMultiSelect;return(0,u.jsx)(`div`,{className:`${r?Z.multiSelectOutline:Z.singleSelectOutline} ${Z.enter}`,style:{left:n.x,top:n.y,width:n.width,height:n.height,...r?{}:{borderColor:`color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)`,backgroundColor:`color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)`}}})})(),ve&&!j&&!Ge&&!Hn&&(0,u.jsxs)(`div`,{className:`${Z.hoverTooltip} ${Z.enter}`,style:{left:Math.max(8,Math.min(be.x,window.innerWidth-100)),top:Math.max(be.y-(ve.reactComponents?48:32),8)},children:[ve.reactComponents&&(0,u.jsx)(`div`,{className:Z.hoverReactPath,children:ve.reactComponents}),(0,u.jsx)(`div`,{className:Z.hoverElementName,children:ve.elementName})]}),j&&(0,u.jsxs)(u.Fragment,{children:[j.multiSelectElements?.length?j.multiSelectElements.filter(e=>document.contains(e)).map((e,t)=>{let n=e.getBoundingClientRect();return(0,u.jsx)(`div`,{className:`${Z.multiSelectOutline} ${Rn?Z.exit:Z.enter}`,style:{left:n.left,top:n.top,width:n.width,height:n.height}},`pending-multi-${t}`)}):j.targetElement&&document.contains(j.targetElement)?(()=>{let e=j.targetElement.getBoundingClientRect();return(0,u.jsx)(`div`,{className:`${Z.singleSelectOutline} ${Rn?Z.exit:Z.enter}`,style:{left:e.left,top:e.top,width:e.width,height:e.height,borderColor:`color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)`,backgroundColor:`color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)`}})})():j.boundingBox&&(0,u.jsx)(`div`,{className:`${j.isMultiSelect?Z.multiSelectOutline:Z.singleSelectOutline} ${Rn?Z.exit:Z.enter}`,style:{left:j.boundingBox.x,top:j.boundingBox.y-Ue,width:j.boundingBox.width,height:j.boundingBox.height,...j.isMultiSelect?{}:{borderColor:`color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)`,backgroundColor:`color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)`}}}),(()=>{let e=j.x,t=j.isFixed?j.y:j.y-Ue;return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(li,{x:e,y:t,isMultiSelect:j.isMultiSelect,isExiting:Rn}),(0,u.jsx)(_e,{ref:Cr,element:j.element,selectedText:j.selectedText,computedStyles:j.computedStylesObj,placeholder:j.element===`Area selection`?`What should change in this area?`:j.isMultiSelect?`Feedback for this group of elements...`:`What should change?`,onSubmit:zr,onCancel:Br,isExiting:Rn,lightMode:!vn,accentColor:j.isMultiSelect?`var(--agentation-color-green)`:`var(--agentation-color-accent)`,style:{left:Math.max(160,Math.min(window.innerWidth-160,e/100*window.innerWidth)),...t>window.innerHeight-290?{bottom:window.innerHeight-t+20}:{top:t+20}}})]})})()]}),I&&(0,u.jsxs)(u.Fragment,{children:[I.elementBoundingBoxes?.length?Ve.length>0?Ve.filter(e=>document.contains(e)).map((e,t)=>{let n=e.getBoundingClientRect();return(0,u.jsx)(`div`,{className:`${Z.multiSelectOutline} ${Z.enter}`,style:{left:n.left,top:n.top,width:n.width,height:n.height}},`edit-multi-live-${t}`)}):I.elementBoundingBoxes.map((e,t)=>(0,u.jsx)(`div`,{className:`${Z.multiSelectOutline} ${Z.enter}`,style:{left:e.x,top:e.y-Ue,width:e.width,height:e.height}},`edit-multi-${t}`)):(()=>{let e=ze&&document.contains(ze)?ze.getBoundingClientRect():null,t=e?{x:e.left,y:e.top,width:e.width,height:e.height}:I.boundingBox?{x:I.boundingBox.x,y:I.isFixed?I.boundingBox.y:I.boundingBox.y-Ue,width:I.boundingBox.width,height:I.boundingBox.height}:null;return t?(0,u.jsx)(`div`,{className:`${I.isMultiSelect?Z.multiSelectOutline:Z.singleSelectOutline} ${Z.enter}`,style:{left:t.x,top:t.y,width:t.width,height:t.height,...I.isMultiSelect?{}:{borderColor:`color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)`,backgroundColor:`color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)`}}}):null})(),(0,u.jsx)(_e,{ref:wr,element:I.element,selectedText:I.selectedText,computedStyles:an(I.computedStyles),placeholder:`Edit your feedback...`,initialValue:I.comment,submitLabel:`Save`,onSubmit:Ur,onCancel:Wr,onDelete:()=>Vr(I.id),isExiting:Bn,lightMode:!vn,accentColor:I.isMultiSelect?`var(--agentation-color-green)`:`var(--agentation-color-accent)`,style:(()=>{let e=I.isFixed?I.y:I.y-Ue;return{left:Math.max(160,Math.min(window.innerWidth-160,I.x/100*window.innerWidth)),...e>window.innerHeight-290?{bottom:window.innerHeight-e+20}:{top:e+20}}})()})]}),Hn&&(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(`div`,{ref:nr,className:Z.dragSelection}),(0,u.jsx)(`div`,{ref:or,className:Z.highlightsContainer})]})]})]}),document.body)}export{r as i,s as n,a as r,Fi as t};