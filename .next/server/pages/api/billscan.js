"use strict";(()=>{var a={};a.id=807,a.ids=[807],a.modules={30986:(a,b,c)=>{c.r(b),c.d(b,{config:()=>l,default:()=>k,handler:()=>n});var d=c(29046),e=c(8667),f=c(33480),g=c(86435),h=c(85294),i=c(58112),j=c(18766);let k=(0,g.M)(h,"default"),l=(0,g.M)(h,"config"),m=new f.PagesAPIRouteModule({definition:{kind:e.A.PAGES_API,page:"/api/billscan",pathname:"/api/billscan",bundlePath:"",filename:""},userland:h,distDir:".next",relativeProjectDir:""});async function n(a,b,c){let e=await m.prepare(a,b,{srcPage:"/api/billscan"});if(!e){b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve());return}let{query:f,params:g,prerenderManifest:h,routerServerContext:k}=e;try{let c=a.method||"GET",d=(0,i.getTracer)(),e=d.getActiveScopeSpan(),l=m.instrumentationOnRequestError.bind(m),n=async e=>m.render(a,b,{query:{...f,...g},params:g,allowedRevalidateHeaderKeys:[],multiZoneDraftMode:!1,trustHostHeader:!1,previewProps:h.preview,propagateError:!1,dev:m.isDev,page:"/api/billscan",internalRevalidate:null==k?void 0:k.revalidate,onError:(...b)=>l(a,...b)}).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let f=d.getRootSpanAttributes();if(!f)return;if(f.get("next.span_type")!==j.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${f.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let g=f.get("next.route");if(g){let a=`${c} ${g}`;e.setAttributes({"next.route":g,"http.route":g,"next.span_name":a}),e.updateName(a)}else e.updateName(`${c} ${a.url}`)});e?await n(e):await d.withPropagatedContext(a.headers,()=>d.trace(j.BaseServerSpan.handleRequest,{spanName:`${c} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":c,"http.target":a.url}},n))}catch(a){if(m.isDev)throw a;(0,d.sendError)(b,500,"Internal Server Error")}finally{null==c.waitUntil||c.waitUntil.call(c,Promise.resolve())}}},75600:a=>{a.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},85294:a=>{a.exports=async function(a,b){if("POST"!==a.method)return b.status(405).json({error:"Method not allowed"});let{image:c,mimeType:d}=a.body||{};if(!c)return b.status(400).json({error:"Missing image data"});let e=`You are a medical bill data extraction expert. Extract all information from this medical bill image.

Return the extracted data in this exact format:

PROVIDER:
[Hospital or provider name, address if visible]

DATE OF SERVICE:
[Date(s) of service]

PATIENT:
[Patient name if visible]

ACCOUNT / CLAIM NUMBER:
[Account or claim number if visible]

LINE ITEMS:
[Each charge on its own line: Description | CPT Code | Amount — if CPT code not visible, write N/A]

SUBTOTALS:
[Billed amount, insurance paid, adjustments, patient balance — each on its own line]

INSURANCE:
[Insurance company name, plan, and any policy/group numbers if visible]

NOTES:
[Any important notices, due dates, payment instructions visible on the bill]

EXTRACTED TEXT FOR ANALYSIS:
[A clean summary paragraph combining all charges, perfect for pasting into a bill analyzer. Format: "Provider: X, Date: X, Services: [list each service and amount], Total billed: $X, Insurance paid: $X, Patient owes: $X"]

Extract every number, code, and charge visible. If something is unclear or not visible, write "Not visible".`;try{let a=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${process.env.GROQ_API_KEY}`},body:JSON.stringify({model:"meta-llama/llama-4-scout-17b-16e-instruct",messages:[{role:"user",content:[{type:"text",text:e},{type:"image_url",image_url:{url:`data:${d||"image/jpeg"};base64,${c}`}}]}],temperature:.1,max_tokens:1500})});if(!a.ok){let c=await a.json().catch(()=>({}));return b.status(500).json({error:c.error?.message||"Vision AI request failed"})}let f=await a.json();b.json({result:f.choices[0].message.content})}catch(a){b.status(500).json({error:a.message})}},a.exports.config={api:{bodyParser:{sizeLimit:"12mb"}}}}};var b=require("../../webpack-api-runtime.js");b.C(a);var c=b.X(0,[169],()=>b(b.s=30986));module.exports=c})();