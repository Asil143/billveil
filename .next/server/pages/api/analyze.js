"use strict";(()=>{var a={};a.id=985,a.ids=[985],a.modules={19904:a=>{a.exports=require("groq-sdk")},75600:a=>{a.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},91158:(a,b,c)=>{let d=new(c(19904))({apiKey:process.env.GROQ_API_KEY});a.exports=async function(a,b){if("POST"!==a.method)return b.status(405).json({error:"Method not allowed"});let{bill:c}=a.body;if(!c)return b.status(400).json({error:"No bill provided"});try{let a=await d.chat.completions.create({model:"llama-3.3-70b-versatile",max_tokens:1200,messages:[{role:"system",content:"You are BillVeil, an expert medical billing advocate with deep knowledge of CPT codes, Medicare allowable rates, hospital chargemasters, the No Surprises Act (2022), balance billing protections, and ERISA appeal rights. You give direct, specific, actionable advice that saves Americans real money. Always reference Medicare rates as the fair price benchmark. Be specific with dollar amounts."},{role:"user",content:`A patient needs help understanding this medical bill or charge: "${c}"

IMPORTANT: Do NOT use markdown (no ##, no **, no bullet points with *). Use plain text only with the EXACT section headers below, nothing else before them:

Respond in this EXACT format with these EXACT section headers:

WHAT IS THIS:
[2-3 sentences in plain English. What the service is, why it's done, and how common it is. Zero medical jargon.]

FAIR PRICE:
[Use Medicare allowable rate as the fair benchmark. Example format: "Medicare pays approximately $X for this. A fair out-of-pocket price is $X–$X. Anything above $X is likely inflated."]

VERDICT:
[Exactly one of these three: FAIR PRICE | POSSIBLY OVERCHARGED | SIGNIFICANTLY OVERCHARGED]

WHY:
[2-3 sentences. If overcharged, state the exact markup (e.g. "This is 8x the Medicare rate"). Mention the No Surprises Act if this was an out-of-network or surprise bill. Be specific.]

WHAT TO DO:
1. [Call the billing department and request a complete itemized bill in writing. By law they must provide one within 30 days.]
2. [Say exactly this: "I'd like to pay the Medicare allowable rate of approximately $X. Can you adjust my bill to that amount?" Most hospitals will negotiate.]
3. [If they refuse: file a complaint at consumerfinance.gov/complaint (CFPB) and your state insurance commissioner. Hospitals fear regulators.]

MONEY YOU COULD SAVE:
[Specific dollar estimate based on the difference between the charged amount and Medicare rate. Example: "Negotiating to Medicare rates could save you $X–$X on this charge alone."]`}]});b.json({result:a.choices[0].message.content})}catch(a){console.error(a),b.status(500).json({error:"Analysis failed"})}}},97738:(a,b,c)=>{c.r(b),c.d(b,{config:()=>l,default:()=>k,handler:()=>n});var d=c(29046),e=c(8667),f=c(33480),g=c(86435),h=c(91158),i=c(58112),j=c(18766);let k=(0,g.M)(h,"default"),l=(0,g.M)(h,"config"),m=new f.PagesAPIRouteModule({definition:{kind:e.A.PAGES_API,page:"/api/analyze",pathname:"/api/analyze",bundlePath:"",filename:""},userland:h,distDir:".next",relativeProjectDir:""});async function n(a,b,c){let e=await m.prepare(a,b,{srcPage:"/api/analyze"});if(!e){b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve());return}let{query:f,params:g,prerenderManifest:h,routerServerContext:k}=e;try{let c=a.method||"GET",d=(0,i.getTracer)(),e=d.getActiveScopeSpan(),l=m.instrumentationOnRequestError.bind(m),n=async e=>m.render(a,b,{query:{...f,...g},params:g,allowedRevalidateHeaderKeys:[],multiZoneDraftMode:!1,trustHostHeader:!1,previewProps:h.preview,propagateError:!1,dev:m.isDev,page:"/api/analyze",internalRevalidate:null==k?void 0:k.revalidate,onError:(...b)=>l(a,...b)}).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let f=d.getRootSpanAttributes();if(!f)return;if(f.get("next.span_type")!==j.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${f.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let g=f.get("next.route");if(g){let a=`${c} ${g}`;e.setAttributes({"next.route":g,"http.route":g,"next.span_name":a}),e.updateName(a)}else e.updateName(`${c} ${a.url}`)});e?await n(e):await d.withPropagatedContext(a.headers,()=>d.trace(j.BaseServerSpan.handleRequest,{spanName:`${c} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":c,"http.target":a.url}},n))}catch(a){if(m.isDev)throw a;(0,d.sendError)(b,500,"Internal Server Error")}finally{null==c.waitUntil||c.waitUntil.call(c,Promise.resolve())}}}};var b=require("../../webpack-api-runtime.js");b.C(a);var c=b.X(0,[169],()=>b(b.s=97738));module.exports=c})();