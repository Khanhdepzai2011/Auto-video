import React from 'react';
import {
  AbsoluteFill, Audio, Composition, Easing, Img, Sequence,
  interpolate, registerRoot, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';

const ink = '#111d20';
const light = '#f8f0e0';
const quiet = '#b6c6bd';
const accent = '#ffc889';
const soft = 'rgba(248,240,224,.16)';
const ease = Easing.bezier(.2,.65,.2,1);
const clamp = (v) => Math.max(0, Math.min(v,1));
const asset = (name) => staticFile(name);
function Photo({scene, full}) {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0,scene.frames], [1.005,1.075]);
  return <Img src={asset(scene.visual.file)} style={{
    position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover',
    transform:'scale('+zoom+')', objectPosition:full?'center 47%':'center',
  }}/>;
}

function Captions({words}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = frame/fps;
  const index = words.findLastIndex((word) => word.start <= now);
  const first = Math.floor(Math.max(0,index)/5)*5;
  const group = words.slice(first,first+5);
  return <div style={{
    position:'absolute',left:76,right:76,bottom:112,height:114,display:'flex',
    justifyContent:'center',alignItems:'center',zIndex:5,pointerEvents:'none',
  }}>
    {index >= 0 && now < words.at(-1).end + .43 && <div style={{
      textAlign:'center', background:'#0d1719ee', border:'1px solid #efe8d42e',
      borderRadius:19,padding:'16px 24px', fontSize:46, fontWeight:740,
      lineHeight:1.22, boxShadow:'0 8px 24px #0005',
    }}>
      {group.map((word,i)=><React.Fragment key={first+i}>
        {i>0?' ':''}<span style={{color:first+i===index?accent:light}}>{word.text}</span>
      </React.Fragment>)}
    </div>}
  </div>;
}

function Source({scene}) {
  const parts = scene.visual.credit.split(' · ');
  return <div style={{display:'flex',justifyContent:'space-between',gap:20,
    fontSize:26, fontWeight:640, color:quiet, letterSpacing:'.015em'}}>
    <span>{parts[0]}</span><span>{parts[1]}</span>
  </div>;
}

function ListProgress({index,frame,frames}) {
  return <div style={{display:'flex',gap:11}}>
    {Array.from({length:5},(_,i)=><div key={i} style={{
      height:5, width:65, background:soft, borderRadius:8, overflow:'hidden',
    }}>
      <div style={{height:'100%',width:(i+1<index?100:i+1===index?100*frame/frames:0)+'%',
        background:accent}}/>
    </div>)}
  </div>;
}

function ToolScene({scene,index}) {
  const frame = useCurrentFrame();
  const intro = interpolate(frame,[0,15],[0,1],{extrapolateRight:'clamp',easing:ease});
  const reveal = interpolate(frame,[12,28],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:ease});
  const example = scene.example;
  return <>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 95% 45%, #2d4340, #111d20 64%)'}}/>
    <div style={{position:'absolute',top:110,left:74,right:74,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <span style={{fontSize:39,color:accent,fontWeight:740}}>0{index} <span style={{color:quiet,fontSize:24}}>/ 05</span></span>
      <ListProgress index={index} frame={frame} frames={scene.frames}/>
    </div>
    <div style={{position:'absolute',top:207,left:70,right:65,opacity:.55+intro*.45,
      transform:'translateY('+((1-intro)*22)+'px)'}}>
      <div style={{fontSize:41,color:accent,fontWeight:680,marginBottom:20}}>{scene.title}</div>
      <div style={{fontSize:100,lineHeight:.99,fontWeight:780,whiteSpace:'pre-line',
        letterSpacing:'-.06em'}}>{example.headline}</div>
    </div>
    <div style={{position:'absolute',top:541,left:74,right:74,height:639,
      borderRadius:25,overflow:'hidden',border:'1px solid #eed3b039',background:'#22332e'}}>
      <Photo scene={scene}/>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(155deg,#07121522,transparent 54%,#0d1c1f30)'}}/>
    </div>
    <div style={{position:'absolute',top:1206,left:77,right:77}}><Source scene={scene}/></div>
    <div style={{position:'absolute',top:1338,left:76,right:76,display:'flex',
      alignItems:'center',gap:26,borderTop:'1px solid '+soft,paddingTop:29,
      opacity:.4+reveal*.6,transform:'translateY('+((1-reveal)*16)+'px)'}}>
      <div style={{flex:'1 1 0',fontSize:37,color:quiet,fontWeight:600}}>{example.input}</div>
      <div style={{fontSize:46,color:accent}}>→</div>
      <div style={{flex:'1 1 0',fontSize:39,color:light,fontWeight:760}}>{example.output}</div>
    </div>
  </>;
}

function Bookend({scene,closing}) {
  const frame = useCurrentFrame();
  const show = interpolate(frame,[0,21],[0,1],{extrapolateRight:'clamp',easing:ease});
  return <>
    <Photo scene={scene} full/>
    <div style={{position:'absolute',inset:0,
      background:'linear-gradient(180deg,#081415ee 0%,#0b1617ae 22%,#10191a05 57%,#0a1619e8 89%,#0a1619 100%)'}}/>
    <div style={{position:'absolute',left:73,right:55,top:closing?189:143,
      transform:'translateY('+((1-show)*22)+'px)',opacity:.72+show*.28}}>
      <div style={{height:6,width:101,background:accent,borderRadius:3,marginBottom:36}}/>
      <div style={{fontSize:closing?113:128,fontWeight:800,lineHeight:.96,
        letterSpacing:'-.068em',textShadow:'0 4px 26px #06111299',whiteSpace:'pre-line'}}>
        {scene.headline}
      </div>
    </div>
    <div style={{position:'absolute',left:77,right:77,bottom:280}}>
      <div style={{fontSize:closing?39:41,fontWeight:720,color:light,marginBottom:21}}>
        {scene.subtitle}
      </div>
      <Source scene={scene}/>
    </div>
  </>;
}

function Sound({scene}) {
  const {fps} = useVideoConfig();
  return <>
    <Audio src={asset(scene.voice)} volume={.86}/>
    {scene.music.map((cue,i)=><Sequence key={i} from={cue.start} durationInFrames={cue.frames} layout="none">
      <Audio src={asset(cue.file)} volume={(frame)=>{
        const fade = cue.fade ? clamp(Math.min((frame+1)/cue.fade,(cue.frames-frame)/cue.fade)) : 1;
        const t = (frame+cue.start)/fps;
        const spoken = scene.words.some((word)=>t>=word.start-.1 && t<=word.end+.19);
        return cue.volume*fade*(spoken?cue.duck:1);
      }}/>
    </Sequence>)}
  </>;
}

function Film({timeline}) {
  return <AbsoluteFill style={{background:ink,color:light,fontFamily:'Segoe UI, Arial, sans-serif'}}>
    {timeline.scenes.map((scene,index)=><Sequence key={scene.start} from={scene.start}
      durationInFrames={scene.frames} premountFor={timeline.fps}>
      {index===0 || index===timeline.scenes.length-1
        ? <Bookend scene={scene} closing={index!==0}/>
        : <ToolScene scene={scene} index={index}/>}
      <Captions words={scene.words}/>
      <Sound scene={scene}/>
    </Sequence>)}
  </AbsoluteFill>;
}

function Root() {
  return <Composition id="KazV6" component={Film} width={1080} height={1920} fps={30}
    durationInFrames={30} defaultProps={{timeline:null}}
    calculateMetadata={({props:{timeline}})=>timeline?({
      width:timeline.width,height:timeline.height,fps:timeline.fps,durationInFrames:timeline.frames,
    }):{}}/>;
}
registerRoot(Root);


