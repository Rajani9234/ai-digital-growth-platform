import { useState, useRef } from 'react';
import { Users, IndianRupee, MessageCircle, CheckCircle, ArrowRight, Send, Bot, User, Copy, Share2, Zap, Gift } from 'lucide-react';
import { generateReferralCode } from '../utils/api';

interface ChatMsg  { role:'bot'|'user'; text:string }
interface Partner  { name:string; phone:string; email:string; city:string; referralCode:string }
interface PForm    { name:string; phone:string; email:string; city:string }

const FAQ: Record<string,string> = {
  earn:    'You earn ₹1,000 for every successful sale through your referral. NO limit — refer 10 businesses, earn ₹10,000! 💰',
  join:    'Joining is completely free and takes 2 minutes! No qualification needed. Fill the form and your code is ready instantly.',
  track:   'You get a unique referral code. When a business buys any JhaTech package using your code, you get ₹1,000 credited.',
  payment: 'Earnings are paid via UPI, bank transfer, or Paytm within 7 business days of a confirmed sale.',
  qualify: 'Anyone can join! Students, homemakers, freelancers — no degree, no experience required.',
  promote: 'Easiest way: WhatsApp your link to local shop owners, restaurants, salons, clinics — any business needing a website!',
};
const QUICK=[{l:'How much can I earn?',k:'earn'},{l:'How to join?',k:'join'},{l:'How to track?',k:'track'},{l:'When do I get paid?',k:'payment'},{l:'Do I need a degree?',k:'qualify'},{l:'How to promote?',k:'promote'}];
function reply(input:string):string{
  const l=input.toLowerCase();
  if(l.includes('earn')||l.includes('money')||l.includes('1000'))return FAQ.earn;
  if(l.includes('join')||l.includes('register'))return FAQ.join;
  if(l.includes('track')||l.includes('link'))return FAQ.track;
  if(l.includes('pay')||l.includes('upi'))return FAQ.payment;
  if(l.includes('qualif')||l.includes('degree'))return FAQ.qualify;
  if(l.includes('promot')||l.includes('share')||l.includes('how'))return FAQ.promote;
  return "Great question! 😊 Ask me about earnings, joining, payments, or how to promote!";
}
const INIT:PForm={name:'',phone:'',email:'',city:''};

export default function Referral(){
  const [form,setForm]=useState<PForm>(INIT);
  const [partner,setPartner]=useState<Partner|null>(null);
  const [errors,setErrors]=useState<Partial<PForm>>({});
  const [copied,setCopied]=useState(false);
  const [msgs,setMsgs]=useState<ChatMsg[]>([{role:'bot',text:"Hi there! 👋 I'm your JhaTech Referral Assistant. Ask me anything about the Refer & Earn program!"}]);
  const [chatInput,setChatInput]=useState('');
  const [botTyping,setBotTyping]=useState(false);
  const isFirst=useRef(true);
  const chatEnd=useRef<HTMLDivElement>(null);

  const validate=()=>{
    const e:Partial<PForm>={};
    if(!form.name.trim())e.name='Required';
    if(!/^[6-9]\d{9}$/.test(form.phone))e.phone='Valid 10-digit number required';
    if(!form.city.trim())e.city='Required';
    setErrors(e);return!Object.keys(e).length;
  };
  const handleReg=(e:React.FormEvent)=>{
    e.preventDefault();if(!validate())return;
    setPartner({...form,referralCode:generateReferralCode(form.name)});
  };
  const send=(text?:string)=>{
    const msg=text??chatInput.trim();if(!msg)return;
    setMsgs(p=>[...p,{role:'user',text:msg}]);setChatInput('');setBotTyping(true);
    setTimeout(()=>{
      setBotTyping(false);setMsgs(p=>[...p,{role:'bot',text:reply(msg)}]);
      if(!isFirst.current)chatEnd.current?.scrollIntoView({behavior:'smooth'});
      isFirst.current=false;
    },800+Math.random()*500);
  };
  const copyCode=()=>{if(!partner)return;navigator.clipboard.writeText(partner.referralCode);setCopied(true);setTimeout(()=>setCopied(false),2000)};
  const shareLink=()=>{const t=`🚀 Grow your business with JhaTech!\nUse my code: ${partner?.referralCode}\nhttps://jhatechsolutions.in/ref/${partner?.referralCode}`;if(navigator.share)navigator.share({title:'JhaTech',text:t});else navigator.clipboard.writeText(t)};

  return(
    <main style={{paddingTop:'5rem',minHeight:'100vh'}}>
      <section className="rf-hero">
        <div className="rf-hero__glow"/>
        <div className="container" style={{textAlign:'center',position:'relative',zIndex:1}}>
          <div className="badge badge-green" style={{display:'inline-flex',marginBottom:'1.25rem'}}><Gift size={13}/> Referral Partner Program</div>
          <h1 className="section-title">Refer & Earn <span className="gradient-text">₹1,000</span><br/>Per Successful Sale</h1>
          <p className="section-subtitle">No degree needed. No experience needed. Refer local businesses and earn every time they buy a package.</p>
          <div className="rf-stats">
            {[{v:'₹1,000',l:'Per Sale'},{v:'Unlimited',l:'Earning Potential'},{v:'Free',l:'To Join'},{v:'7 Days',l:'Payout'}].map(s=>(
              <div key={s.l} className="rf-stat"><span className="gradient-text">{s.v}</span><span>{s.l}</span></div>
            ))}
          </div>
        </div>
      </section>

      <div className="container" style={{paddingBottom:'6rem'}}>
        <div className="rf-layout">
          <div>
            {!partner?(
              <div className="rf-card animate-fade-up">
                <div className="rf-card__head">
                  <div className="rf-card__icon"><Zap size={18}/></div>
                  <div><h3>Join as Referral Partner</h3><p>Free to join. Start earning in minutes.</p></div>
                </div>
                <form onSubmit={handleReg} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                  {[{f:'name',l:'Full Name *',p:'Rahul Sharma',t:'text'},{f:'phone',l:'Mobile Number *',p:'9876543210',t:'tel'},{f:'email',l:'Email (Optional)',p:'rahul@gmail.com',t:'email'},{f:'city',l:'City *',p:'Mumbai',t:'text'}].map(item=>(
                    <div className="form-group" key={item.f}>
                      <label className="form-label">{item.l}</label>
                      <input className="form-input" type={item.t} placeholder={item.p}
                        maxLength={item.f==='phone'?10:undefined}
                        value={(form as any)[item.f]}
                        onChange={e=>setForm(p=>({...p,[item.f]:item.f==='phone'?e.target.value.replace(/\D/g,''):e.target.value}))}/>
                      {(errors as any)[item.f]&&<span className="rf-error">{(errors as any)[item.f]}</span>}
                    </div>
                  ))}
                  <div className="rf-terms"><CheckCircle size={14} color="#10B981"/><span>No qualification required. Open to everyone!</span></div>
                  <button type="submit" className="btn btn-primary btn-lg" style={{justifyContent:'center'}}>
                    <Users size={17}/> Register as Partner <ArrowRight size={16}/>
                  </button>
                </form>
              </div>
            ):(
              <div className="rf-dashboard animate-fade-up">
                <div className="rf-dash__welcome">
                  <div className="rf-dash__avatar">{partner.name.charAt(0)}</div>
                  <div><h3>Welcome, {partner.name}! 🎉</h3><p>Your referral partner account is active.</p></div>
                </div>
                <div className="rf-dash__stats">
                  <div className="rf-dash__stat"><IndianRupee size={18} color="#10B981"/><div><span>₹0</span><span>Total Earned</span></div></div>
                  <div className="rf-dash__stat"><Users size={18} color="#8B5CF6"/><div><span>0</span><span>Referrals</span></div></div>
                </div>
                <div className="rf-code-box">
                  <p>Your Referral Code</p>
                  <div className="rf-code-box__code">{partner.referralCode}</div>
                  <div className="rf-code-box__link">jhatechsolutions.in/ref/{partner.referralCode}</div>
                  <div style={{display:'flex',gap:'.75rem',marginTop:'1rem'}}>
                    <button className="btn btn-secondary btn-sm" onClick={copyCode} style={{flex:1,justifyContent:'center'}}><Copy size={14}/> {copied?'Copied!':'Copy'}</button>
                    <button className="btn btn-primary btn-sm" onClick={shareLink} style={{flex:1,justifyContent:'center'}}><Share2 size={14}/> Share</button>
                  </div>
                </div>
                <a href={`https://wa.me/919999999999?text=Hi!+I+registered+as+partner.+My+code:+${partner.referralCode}`}
                  target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" style={{width:'100%',justifyContent:'center'}}>
                  <MessageCircle size={15}/> Confirm on WhatsApp
                </a>
              </div>
            )}

            <div className="rf-hiw">
              <h4>How It Works</h4>
              {[{n:'1',t:'Register Free',d:'Fill the form and get your unique referral code instantly.'},{n:'2',t:'Share with Businesses',d:'Send your link to shops, restaurants, clinics — any local business.'},{n:'3',t:'They Buy a Package',d:'When they purchase any JhaTech plan using your code, you earn ₹1,000.'},{n:'4',t:'Get Paid in 7 Days',d:'Earnings transferred to your UPI or bank account.'}].map(s=>(
                <div key={s.n} className="rf-hiw__step">
                  <div className="rf-hiw__num">{s.n}</div>
                  <div><strong>{s.t}</strong><p>{s.d}</p></div>
                </div>
              ))}
            </div>
          </div>

          {/* Chatbot */}
          <div>
            <div className="rf-chat">
              <div className="rf-chat__head">
                <div className="rf-chat__avatar"><Bot size={16}/></div>
                <div><strong>JhaTech AI Assistant</strong><div className="rf-chat__status"><span className="rf-chat__dot"/> Online</div></div>
              </div>
              <div className="rf-chat__msgs">
                {msgs.map((m,i)=>(
                  <div key={i} className={`rf-msg rf-msg--${m.role}`}>
                    {m.role==='bot'&&<div className="rf-msg__av"><Bot size={13}/></div>}
                    <div className="rf-msg__bubble">{m.text}</div>
                    {m.role==='user'&&<div className="rf-msg__av rf-msg__av--user"><User size={13}/></div>}
                  </div>
                ))}
                {botTyping&&(
                  <div className="rf-msg rf-msg--bot">
                    <div className="rf-msg__av"><Bot size={13}/></div>
                    <div className="rf-msg__bubble rf-msg__bubble--typing"><span/><span/><span/></div>
                  </div>
                )}
                <div ref={chatEnd}/>
              </div>
              <div className="rf-chat__quick">
                {QUICK.map(q=><button key={q.k} className="rf-quick-btn" onClick={()=>send(q.l)}>{q.l}</button>)}
              </div>
              <div className="rf-chat__input">
                <input className="form-input" placeholder="Ask about earning, payments…" value={chatInput}
                  onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}/>
                <button className="btn btn-primary" onClick={()=>send()} disabled={!chatInput.trim()}
                  style={{padding:'.7rem 1rem',borderRadius:'var(--radius-md)',flexShrink:0}}><Send size={15}/></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .rf-hero{padding:5rem 0 3.5rem;position:relative;overflow:hidden}
        .rf-hero__glow{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(16,185,129,.15) 0%,transparent 65%);pointer-events:none}
        .rf-stats{display:flex;justify-content:center;gap:3rem;flex-wrap:wrap;margin-top:2.5rem;padding:1.75rem 2rem;background:rgba(255,255,255,.03);border:1px solid var(--dark-border);border-radius:var(--radius-xl);max-width:600px;margin-left:auto;margin-right:auto}
        .rf-stat{text-align:center}.rf-stat span:first-child{display:block;font-size:1.6rem;font-weight:900;font-family:var(--font-heading)}.rf-stat span:last-child{display:block;font-size:.75rem;color:var(--gray-400);text-transform:uppercase;letter-spacing:.06em;margin-top:.2rem}
        .rf-layout{display:grid;grid-template-columns:1fr 1fr;gap:2rem;align-items:start;margin-top:2rem}
        .rf-card{background:var(--dark-card);border:1px solid var(--dark-border);border-radius:var(--radius-2xl);padding:2rem}
        .rf-card__head{display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem}
        .rf-card__icon{width:44px;height:44px;border-radius:var(--radius-md);background:linear-gradient(135deg,#6C3CE1,#8B5CF6);display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .rf-card__head h3{font-size:1.1rem;font-weight:800;margin:0}.rf-card__head p{font-size:.82rem;color:var(--gray-400);margin:0}
        .rf-error{font-size:.8rem;color:#EF4444}
        .rf-terms{display:flex;align-items:center;gap:.5rem;font-size:.82rem;color:var(--gray-400);background:rgba(16,185,129,.07);border:1px solid rgba(16,185,129,.18);border-radius:var(--radius-md);padding:.65rem .9rem}
        .rf-dashboard{background:var(--dark-card);border:1px solid var(--dark-border);border-radius:var(--radius-2xl);padding:2rem;display:flex;flex-direction:column;gap:1.5rem}
        .rf-dash__welcome{display:flex;align-items:center;gap:1rem}
        .rf-dash__avatar{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#6C3CE1,#F59E0B);display:flex;align-items:center;justify-content:center;font-size:1.3rem;font-weight:800;flex-shrink:0}
        .rf-dash__welcome h3{font-size:1.1rem;margin:0 0 .15rem}.rf-dash__welcome p{font-size:.82rem;color:var(--gray-400);margin:0}
        .rf-dash__stats{display:flex;gap:1rem}
        .rf-dash__stat{flex:1;display:flex;align-items:center;gap:.75rem;padding:1rem;background:rgba(255,255,255,.04);border:1px solid var(--dark-border);border-radius:var(--radius-md)}
        .rf-dash__stat span:first-child{display:block;font-size:1.4rem;font-weight:900;font-family:var(--font-heading)}.rf-dash__stat span:last-child{display:block;font-size:.75rem;color:var(--gray-400)}
        .rf-code-box{background:rgba(108,60,225,.08);border:1px solid rgba(108,60,225,.25);border-radius:var(--radius-lg);padding:1.5rem;text-align:center}
        .rf-code-box p{font-size:.8rem;color:var(--gray-400);margin:0 0 .5rem}
        .rf-code-box__code{font-size:2rem;font-weight:900;letter-spacing:.12em;font-family:var(--font-heading);background:linear-gradient(135deg,#8B5CF6,#F59E0B);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .rf-code-box__link{font-size:.78rem;color:var(--gray-500);margin-top:.3rem}
        .rf-hiw{background:var(--dark-card);border:1px solid var(--dark-border);border-radius:var(--radius-2xl);padding:1.75rem;margin-top:1.5rem}
        .rf-hiw h4{font-size:1rem;font-weight:700;margin-bottom:1.25rem}
        .rf-hiw__step{display:flex;gap:1rem;align-items:flex-start;margin-bottom:1.1rem}.rf-hiw__step:last-child{margin-bottom:0}
        .rf-hiw__num{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#6C3CE1,#8B5CF6);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.82rem;flex-shrink:0}
        .rf-hiw__step strong{display:block;font-size:.9rem;margin-bottom:.2rem}.rf-hiw__step p{font-size:.82rem;color:var(--gray-400);margin:0}
        .rf-chat{background:var(--dark-card);border:1px solid var(--dark-border);border-radius:var(--radius-2xl);overflow:hidden;display:flex;flex-direction:column;height:680px;position:sticky;top:6rem}
        .rf-chat__head{display:flex;align-items:center;gap:.9rem;padding:1.25rem 1.5rem;background:linear-gradient(135deg,rgba(108,60,225,.2),rgba(108,60,225,.05));border-bottom:1px solid var(--dark-border)}
        .rf-chat__avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#6C3CE1,#8B5CF6);display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .rf-chat__head strong{display:block;font-size:.95rem}
        .rf-chat__status{display:flex;align-items:center;gap:.4rem;font-size:.78rem;color:var(--gray-400)}
        .rf-chat__dot{width:7px;height:7px;border-radius:50%;background:#10B981;animation:pulse-glow 2s ease-in-out infinite}
        .rf-chat__msgs{flex:1;overflow-y:auto;padding:1.25rem;display:flex;flex-direction:column;gap:1rem}
        .rf-msg{display:flex;gap:.6rem;align-items:flex-end}.rf-msg--user{flex-direction:row-reverse}
        .rf-msg__av{width:28px;height:28px;border-radius:50%;background:rgba(108,60,225,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#8B5CF6}
        .rf-msg__av--user{background:rgba(245,158,11,.2);color:#F59E0B}
        .rf-msg__bubble{max-width:80%;padding:.75rem 1rem;border-radius:14px;font-size:.875rem;line-height:1.55}
        .rf-msg--bot .rf-msg__bubble{background:rgba(255,255,255,.06);border-bottom-left-radius:4px;color:var(--gray-200)}
        .rf-msg--user .rf-msg__bubble{background:linear-gradient(135deg,#6C3CE1,#8B5CF6);border-bottom-right-radius:4px;color:white}
        .rf-msg__bubble--typing{display:flex;align-items:center;gap:4px;padding:.65rem .9rem}
        .rf-msg__bubble--typing span{width:7px;height:7px;border-radius:50%;background:var(--gray-400);animation:typing-dot 1.4s ease-in-out infinite}
        .rf-msg__bubble--typing span:nth-child(2){animation-delay:.2s}.rf-msg__bubble--typing span:nth-child(3){animation-delay:.4s}
        @keyframes typing-dot{0%,80%,100%{transform:scale(.7);opacity:.4}40%{transform:scale(1);opacity:1}}
        .rf-chat__quick{display:flex;flex-wrap:wrap;gap:.4rem;padding:.75rem 1rem;border-top:1px solid var(--dark-border)}
        .rf-quick-btn{padding:.3rem .75rem;border-radius:var(--radius-full);background:rgba(108,60,225,.1);border:1px solid rgba(108,60,225,.22);color:#8B5CF6;font-size:.76rem;font-weight:500;transition:var(--transition)}
        .rf-quick-btn:hover{background:rgba(108,60,225,.22)}
        .rf-chat__input{display:flex;gap:.6rem;padding:1rem 1.25rem;border-top:1px solid var(--dark-border)}
        @media(max-width:860px){.rf-layout{grid-template-columns:1fr}.rf-chat{height:500px;position:static}}
        @media(max-width:480px){.rf-stats{gap:1.5rem}}
      `}</style>
    </main>
  );
}
