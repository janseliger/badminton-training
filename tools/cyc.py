import sys, subprocess, numpy as np
src=sys.argv[1]; fps,W,H=24,192,108
raw=subprocess.run(["ffmpeg","-v","error","-i",src,"-vf",f"fps={fps},scale={W}:{H}","-pix_fmt","gray","-f","rawvideo","-"],capture_output=True,check=True).stdout
F=np.frombuffer(raw,np.uint8).reshape(-1,H,W).astype(np.float32); n=len(F)
K=8
res=[]
for s in range(K,n):
  for c in range(s+int(1.2*fps),n-3):
    d=float(np.mean(np.abs(F[c-K:c]-F[s-K:s])))
    res.append((d,s,c))
res.sort()
print(src.split('/')[-1],n)
seen=[]
for d,s,c in res:
  if any(abs(s-a)<6 and abs(c-b)<6 for a,b in seen): continue
  seen.append((s,c)); print(f"  d={d:.2f} s={s} c={c} len={(c-s)/fps:.2f}s")
  if len(seen)>=6: break
