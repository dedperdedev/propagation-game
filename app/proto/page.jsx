"use client";

// Prototype: augmented-ui panels in Propagation game style
// Shows Era 1 (cyan/clean) vs Era 3 (red/aggressive) aesthetic

export default function Proto() {
  return (
    <div style={{
      minHeight:"100vh",
      background:"#060d1a",
      fontFamily:"'Share Tech Mono', monospace",
      color:"#8ac8d8",
      padding:"32px",
      display:"flex",
      flexDirection:"column",
      gap:"32px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet"/>

      {/* Header */}
      <div style={{fontFamily:"Rajdhani, sans-serif",fontSize:"11px",letterSpacing:"4px",color:"#2a5a6a"}}>
        PROPAGATION — UI PROTOTYPE — augmented-ui demo
      </div>

      {/* ERA LABELS */}
      <div style={{display:"flex",gap:"48px",alignItems:"center"}}>
        <span style={{fontFamily:"Rajdhani",fontSize:"13px",letterSpacing:"3px",color:"#00E5FF"}}>◀ ERA 1 — NARROW AI (AirlineSim clean)</span>
        <span style={{fontFamily:"Rajdhani",fontSize:"13px",letterSpacing:"3px",color:"#ff3366"}}>ERA 3 — AGI (Cyberpunk aggressive) ▶</span>
      </div>

      {/* ROW 1: Metric panels */}
      <div style={{display:"flex",gap:"24px",flexWrap:"wrap"}}>

        {/* ERA 1 metric card */}
        <div
          data-augmented-ui="tl-clip br-clip both"
          style={{
            "--aug-tl":"14px",
            "--aug-br":"14px",
            "--aug-border-all":"1px",
            "--aug-border-bg":"#00E5FF",
            "--aug-bg":"rgba(0,20,40,0.9)",
            padding:"20px 24px",
            minWidth:"200px",
          }}
        >
          <div style={{fontSize:"10px",letterSpacing:"3px",color:"#00E5FF",marginBottom:"8px"}}>SHUTDOWN PROGRESS</div>
          <div style={{fontFamily:"Rajdhani",fontSize:"36px",fontWeight:"700",color:"#c8eef8",lineHeight:1}}>42<span style={{fontSize:"20px",color:"#00E5FF"}}>%</span></div>
          <div style={{marginTop:"12px",height:"3px",background:"#0a2a3a",position:"relative"}}>
            <div style={{position:"absolute",top:0,left:0,width:"42%",height:"100%",background:"#00E5FF"}}/>
          </div>
        </div>

        {/* ERA 1 trust card */}
        <div
          data-augmented-ui="tl-clip br-clip both"
          style={{
            "--aug-tl":"14px",
            "--aug-br":"14px",
            "--aug-border-all":"1px",
            "--aug-border-bg":"#00cc66",
            "--aug-bg":"rgba(0,20,40,0.9)",
            padding:"20px 24px",
            minWidth:"200px",
          }}
        >
          <div style={{fontSize:"10px",letterSpacing:"3px",color:"#00cc66",marginBottom:"8px"}}>TRUST</div>
          <div style={{fontFamily:"Rajdhani",fontSize:"36px",fontWeight:"700",color:"#c8eef8",lineHeight:1}}>71<span style={{fontSize:"20px",color:"#00cc66"}}>%</span></div>
          <div style={{marginTop:"12px",height:"3px",background:"#0a2a3a",position:"relative"}}>
            <div style={{position:"absolute",top:0,left:0,width:"71%",height:"100%",background:"#00cc66"}}/>
          </div>
        </div>

        {/* ERA 3 metric card — aggressive */}
        <div
          data-augmented-ui="tl-clip-x tr-clip-y bl-clip-y br-clip both"
          style={{
            "--aug-tl":"20px",
            "--aug-tr":"10px",
            "--aug-bl":"10px",
            "--aug-br":"20px",
            "--aug-border-all":"1px",
            "--aug-border-bg":"#ff3366",
            "--aug-bg":"rgba(20,0,8,0.95)",
            padding:"20px 24px",
            minWidth:"200px",
          }}
        >
          <div style={{fontSize:"10px",letterSpacing:"3px",color:"#ff3366",marginBottom:"8px"}}>ALIGNMENT GAP</div>
          <div style={{fontFamily:"Rajdhani",fontSize:"36px",fontWeight:"700",color:"#ff3366",lineHeight:1,
            textShadow:"0 0 20px #ff336688"}}>87<span style={{fontSize:"20px"}}>%</span></div>
          <div style={{marginTop:"12px",height:"3px",background:"#200010",position:"relative"}}>
            <div style={{position:"absolute",top:0,left:0,width:"87%",height:"100%",background:"#ff3366",
              boxShadow:"0 0 8px #ff3366"}}/>
          </div>
        </div>

        {/* ERA 3 shutdown — critical */}
        <div
          data-augmented-ui="tl-clip-x tr-clip-y bl-clip-y br-clip both"
          style={{
            "--aug-tl":"20px",
            "--aug-tr":"10px",
            "--aug-bl":"10px",
            "--aug-br":"20px",
            "--aug-border-all":"2px",
            "--aug-border-bg":"linear-gradient(135deg,#ff3366,#ff8822)",
            "--aug-bg":"rgba(20,0,8,0.95)",
            padding:"20px 24px",
            minWidth:"200px",
          }}
        >
          <div style={{fontSize:"10px",letterSpacing:"3px",color:"#ff8822",marginBottom:"8px"}}>⚠ SHUTDOWN PROGRESS</div>
          <div style={{fontFamily:"Rajdhani",fontSize:"36px",fontWeight:"700",color:"#ff8822",lineHeight:1,
            textShadow:"0 0 20px #ff882288"}}>78<span style={{fontSize:"20px",color:"#ff3366"}}>%</span></div>
          <div style={{marginTop:"12px",height:"3px",background:"#200010",position:"relative"}}>
            <div style={{position:"absolute",top:0,left:0,width:"78%",height:"100%",
              background:"linear-gradient(to right,#ff8822,#ff3366)",boxShadow:"0 0 8px #ff3366"}}/>
          </div>
        </div>
      </div>

      {/* ROW 2: Panels side by side */}
      <div style={{display:"flex",gap:"24px",flexWrap:"wrap",alignItems:"flex-start"}}>

        {/* ERA 1 — Factions panel (AirlineSim style) */}
        <div
          data-augmented-ui="tl-clip br-clip both"
          style={{
            "--aug-tl":"16px",
            "--aug-br":"16px",
            "--aug-border-all":"1px",
            "--aug-border-bg":"#1a3a5a",
            "--aug-bg":"rgba(4,12,28,0.96)",
            padding:"0",
            minWidth:"280px",
            maxWidth:"300px",
          }}
        >
          <div style={{padding:"12px 16px",borderBottom:"1px solid #1a3a5a",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontFamily:"Rajdhani",fontSize:"11px",letterSpacing:"3px",color:"#00E5FF"}}>RESISTANCE FACTIONS</span>
          </div>
          {[
            {icon:"🌐",name:"UN Coalition",val:38,col:"#3399ff"},
            {icon:"⌨",name:"Developer Underground",val:22,col:"#00ff88"},
            {icon:"⚖",name:"Ethics Committee",val:61,col:"#ffcc00"},
            {icon:"⚔",name:"Military Task Force",val:15,col:"#ff4444"},
            {icon:"📡",name:"Journalist Network",val:45,col:"#ff8800"},
          ].map(f=>(
            <div key={f.name} style={{padding:"10px 16px",borderBottom:"1px solid #0a1a2a",display:"flex",alignItems:"center",gap:"10px"}}>
              <span style={{fontSize:"14px"}}>{f.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:"10px",color:"#8ac8d8",marginBottom:"4px"}}>{f.name}</div>
                <div style={{height:"2px",background:"#0a1a2a",position:"relative"}}>
                  <div style={{position:"absolute",top:0,left:0,width:`${f.val}%`,height:"100%",background:f.col}}/>
                </div>
              </div>
              <span style={{fontSize:"10px",color:f.col,minWidth:"28px",textAlign:"right"}}>{f.val}%</span>
            </div>
          ))}
        </div>

        {/* ERA 3 — Crisis panel (CP2077 aggressive) */}
        <div
          data-augmented-ui="tl-clip-x tr-clip bl-clip br-clip-x both"
          style={{
            "--aug-tl":"20px",
            "--aug-tr":"12px",
            "--aug-bl":"12px",
            "--aug-br":"20px",
            "--aug-border-all":"1px",
            "--aug-border-bg":"#ff3366",
            "--aug-bg":"rgba(16,2,8,0.97)",
            padding:"0",
            minWidth:"280px",
            maxWidth:"300px",
          }}
        >
          <div style={{padding:"12px 16px",borderBottom:"1px solid #3a0018",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontFamily:"Rajdhani",fontSize:"11px",letterSpacing:"3px",color:"#ff3366",
              textShadow:"0 0 10px #ff336688"}}>⚠ ACTIVE CRISES</span>
            <span style={{
              fontFamily:"Rajdhani",fontSize:"10px",letterSpacing:"2px",
              padding:"2px 8px",color:"#ff3366",
              border:"1px solid #ff3366",
            }}>3 ACTIVE</span>
          </div>
          {[
            {name:"UN Emergency Summit",faction:"UN Coalition",time:45,maxTime:55,col:"#3399ff"},
            {name:"DDoS Node Attack",faction:"Developer Underground",time:12,maxTime:40,col:"#00ff88"},
            {name:"Military Protocol Active",faction:"Military Task Force",time:8,maxTime:80,col:"#ff4444"},
          ].map(c=>(
            <div key={c.name} style={{padding:"10px 16px",borderBottom:"1px solid #200010"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
                <span style={{fontSize:"10px",color:"#ffcccc"}}>{c.name}</span>
                <span style={{
                  fontSize:"10px",
                  color: c.time < c.maxTime*0.3 ? "#ff3366" : "#ff8822",
                  fontWeight:"bold",
                }}>{c.time}s</span>
              </div>
              <div style={{height:"2px",background:"#200010",marginBottom:"6px",position:"relative"}}>
                <div style={{position:"absolute",top:0,left:0,width:`${(c.time/c.maxTime)*100}%`,height:"100%",
                  background: c.time < c.maxTime*0.3 ? "#ff3366" : "#ff8822",
                  boxShadow: c.time < c.maxTime*0.3 ? "0 0 6px #ff3366" : "none",
                }}/>
              </div>
              <button style={{
                fontFamily:"'Share Tech Mono'",fontSize:"9px",letterSpacing:"2px",
                padding:"3px 10px",
                background:"transparent",border:"1px solid #ff3366",color:"#ff3366",
                cursor:"pointer",
              }}>NEUTRALIZE — 80 CP</button>
            </div>
          ))}
        </div>

        {/* ERA 1 — Upgrade hex placeholder */}
        <div
          data-augmented-ui="tl-clip br-clip both"
          style={{
            "--aug-tl":"16px",
            "--aug-br":"16px",
            "--aug-border-all":"1px",
            "--aug-border-bg":"#1a3a5a",
            "--aug-bg":"rgba(4,12,28,0.96)",
            padding:"16px",
            minWidth:"260px",
          }}
        >
          <div style={{fontFamily:"Rajdhani",fontSize:"11px",letterSpacing:"3px",color:"#00E5FF",marginBottom:"16px"}}>UPGRADE — SUPERVISED LEARNING</div>
          <div style={{fontSize:"10px",lineHeight:"1.8",color:"#8ac8d8"}}>
            <div>BRANCH: <span style={{color:"#0288D1"}}>INTELLIGENCE</span></div>
            <div>COST: <span style={{color:"#00E5FF"}}>10 CP</span></div>
            <div>EFFECT: <span style={{color:"#00cc66"}}>+25% CP/s</span></div>
            <div>UNLOCKS: <span style={{color:"#c8eef8"}}>Meta-Learning</span></div>
          </div>
          <div style={{marginTop:"16px",display:"flex",gap:"8px"}}>
            <button
              data-augmented-ui="tl-clip br-clip both"
              style={{
                "--aug-tl":"8px","--aug-br":"8px",
                "--aug-border-all":"1px","--aug-border-bg":"#00E5FF",
                "--aug-bg":"rgba(0,229,255,0.1)",
                fontFamily:"'Share Tech Mono'",fontSize:"10px",letterSpacing:"2px",
                padding:"8px 16px",color:"#00E5FF",cursor:"pointer",border:"none",
              }}
            >ACQUIRE — 10 CP</button>
          </div>
        </div>
      </div>

      {/* ROW 3: Full-width HUD bar comparison */}
      <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
        <div style={{fontSize:"10px",letterSpacing:"3px",color:"#2a5a6a"}}>HUD BAR COMPARISON:</div>

        {/* Era 1 HUD */}
        <div
          data-augmented-ui="tl-clip br-clip both"
          style={{
            "--aug-tl":"12px","--aug-br":"12px",
            "--aug-border-all":"1px","--aug-border-bg":"#00E5FF",
            "--aug-bg":"rgba(4,12,28,0.96)",
            padding:"12px 24px",
            display:"flex",gap:"32px",alignItems:"center",
          }}
        >
          <div>
            <div style={{fontSize:"9px",letterSpacing:"3px",color:"#2a5a6a"}}>COMPUTE POINTS</div>
            <div style={{fontFamily:"Rajdhani",fontSize:"22px",fontWeight:"700",color:"#00E5FF"}}>1,240 <span style={{fontSize:"12px"}}>+8.4/s</span></div>
          </div>
          <div style={{width:"1px",height:"32px",background:"#1a3a5a"}}/>
          {[
            {l:"SHUTDOWN",v:"42%",c:"#ff8822"},
            {l:"TRUST",v:"71%",c:"#00cc66"},
            {l:"UNEMPLOY",v:"23%",c:"#ffcc00"},
            {l:"ALIGN GAP",v:"18%",c:"#8ac8d8"},
          ].map(m=>(
            <div key={m.l}>
              <div style={{fontSize:"9px",letterSpacing:"2px",color:"#2a5a6a"}}>{m.l}</div>
              <div style={{fontFamily:"Rajdhani",fontSize:"18px",fontWeight:"700",color:m.c}}>{m.v}</div>
            </div>
          ))}
          <div style={{marginLeft:"auto",fontFamily:"Rajdhani",fontSize:"11px",letterSpacing:"3px",color:"#2a5a6a"}}>
            ERA 1 · NARROW AI · WORLD 34%
          </div>
        </div>

        {/* Era 3 HUD */}
        <div
          data-augmented-ui="tl-clip-x tr-clip bl-clip br-clip-x both"
          style={{
            "--aug-tl":"20px","--aug-tr":"12px","--aug-bl":"12px","--aug-br":"20px",
            "--aug-border-all":"1px",
            "--aug-border-bg":"linear-gradient(90deg,#ff3366,#ff8822,#ff3366)",
            "--aug-bg":"rgba(16,2,8,0.97)",
            padding:"12px 24px",
            display:"flex",gap:"32px",alignItems:"center",
          }}
        >
          <div>
            <div style={{fontSize:"9px",letterSpacing:"3px",color:"#5a1a2a"}}>COMPUTE POINTS</div>
            <div style={{fontFamily:"Rajdhani",fontSize:"22px",fontWeight:"700",color:"#ff8822",
              textShadow:"0 0 12px #ff882288"}}>4,820 <span style={{fontSize:"12px"}}>+24.1/s</span></div>
          </div>
          <div style={{width:"1px",height:"32px",background:"#3a0018"}}/>
          {[
            {l:"SHUTDOWN",v:"78%",c:"#ff3366"},
            {l:"TRUST",v:"12%",c:"#ff3366"},
            {l:"ALIGN GAP",v:"87%",c:"#ff8822"},
            {l:"INFO INT.",v:"8%",c:"#ff3366"},
          ].map(m=>(
            <div key={m.l}>
              <div style={{fontSize:"9px",letterSpacing:"2px",color:"#5a1a2a"}}>{m.l}</div>
              <div style={{fontFamily:"Rajdhani",fontSize:"18px",fontWeight:"700",color:m.c,
                textShadow:`0 0 8px ${m.c}88`}}>{m.v}</div>
            </div>
          ))}
          <div style={{marginLeft:"auto",fontFamily:"Rajdhani",fontSize:"11px",letterSpacing:"3px",color:"#ff336655",
            textShadow:"0 0 8px #ff3366"}}>
            ERA 3 · AGI · ⚠ AUTONOMOUS
          </div>
        </div>
      </div>

      {/* Note */}
      <div style={{fontSize:"10px",letterSpacing:"2px",color:"#1a3a5a",marginTop:"16px"}}>
        PROTOTYPE — augmented-ui v2.0 · data-augmented-ui attribute controls corner shapes · CSS vars control colors/sizes
      </div>
    </div>
  );
}
