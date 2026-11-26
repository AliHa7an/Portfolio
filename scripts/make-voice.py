"""
Regenerates Ali's recorded voice lines and their lip-sync data.

Run from the repo root:
    pip install kokoro-onnx soundfile numpy      (ffmpeg must be installed)
    # download kokoro-v1.0.onnx and voices-v1.0.bin from
    # https://github.com/thewh1teagle/kokoro-onnx/releases into this folder as
    # kokoro.onnx and voices.bin, then write every spoken line into lines.json
    python scripts/make-voice.py am_puck

The first argument is the Kokoro voice name. Output: public/voice/*.mp3 and
app/story/voice.json (clip, duration, and a loudness digit per 50ms).
Any line whose text changes on the site must be regenerated, or it falls back
to the browser's built-in voice.
"""
import json, hashlib, re, subprocess, sys, os
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
VOICE=sys.argv[1] if len(sys.argv)>1 else "am_puck"
OUT="public/voice"; os.makedirs(OUT,exist_ok=True)
for f in os.listdir(OUT): os.remove(os.path.join(OUT,f))
SAY=[("NestJS","Nest J S"),("Next.js","Next J S"),("FastAPI","Fast A P I"),("MERN","murn"),("Auth0","Auth zero"),("Azure AD","Azure A D"),("PostgreSQL","Postgres"),("FourthD","Fourth D"),("AWS","A W S"),("WooCommerce","Woo Commerce"),("Vapi","Vah pee"),("Supabase","Soopa base"),("Codex","Co dex")]
k=Kokoro("kokoro.onnx","voices.bin")
lines=json.load(open("lines.json")); man={}
for text in lines:
    spoken=text
    for a,b in SAY: spoken=spoken.replace(a,b)
    s,sr=k.create(spoken,voice=VOICE,speed=1.04,lang="en-us")
    s=np.asarray(s,dtype=np.float32)
    # trim leading/trailing silence, keep 60ms padding
    idx=np.where(np.abs(s)>0.01)[0]
    s=s[max(0,idx[0]-int(.06*sr)):min(len(s),idx[-1]+int(.12*sr))]
    s=s/max(1e-6,np.abs(s).max())*0.9
    h=hashlib.sha1(text.encode()).hexdigest()[:10]
    sf.write("tmp.wav",s,sr)
    subprocess.run(["ffmpeg","-loglevel","error","-y","-i","tmp.wav","-ac","1","-ar","24000","-b:a","48k",f"{OUT}/{h}.mp3"],check=True)
    step=int(sr*0.05); n=len(s)//step
    rms=np.array([np.sqrt(np.mean(s[i*step:(i+1)*step]**2)) for i in range(n)])
    env=np.clip(np.round(rms/ max(1e-6,np.percentile(rms,95))*9),0,9).astype(int)
    man[text]={"src":f"/voice/{h}.mp3","d":round(len(s)/sr,2),"env":"".join(map(str,env))}
    print(h,round(len(s)/sr,1),text[:50],flush=True)
json.dump(man,open("app/story/voice.json","w"),indent=0)
print("total s",round(sum(v["d"] for v in man.values()),1))
