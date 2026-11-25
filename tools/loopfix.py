#!/usr/bin/env python3
"""Nahtlose Schleife für KI-Clips.
Sucht am Ende den Schnittpunkt, der dem Anfang am ähnlichsten ist (die letzten Bilder der KI
werden gemieden, dort ruckelt es oft), und blendet die letzten K Bilder weich in den Anfang über.
Aufruf: loopfix.py in.mp4 out.mp4"""
import sys, subprocess, numpy as np
src, dst = sys.argv[1], sys.argv[2]
fps, W, H = 24, 960, 540
raw = subprocess.run(["ffmpeg","-v","error","-i",src,"-vf",f"fps={fps},scale={W}:{H}","-pix_fmt","rgb24","-f","rawvideo","-"],capture_output=True,check=True).stdout
F = np.frombuffer(raw,np.uint8).reshape(-1,H,W,3); n = len(F)
small = F[:, ::10, ::10].mean(axis=3).astype(np.float32)
K = int(0.5*fps)
# Anfangs- und Endpunkt gemeinsam suchen: Schleife = Bilder s..c-1, deren letzte K Bilder in s-K..s-1 übergehen.
# Bewertet wird die Ähnlichkeit über das ganze Überblendfenster (verhindert Geisterbilder).
best = None
for s0 in range(K, min(K + int(1.6*fps), n//3)):
    for c in range(max(s0 + int(0.8*n), n - int(2.6*fps)), n - 5):
        d = float(np.mean(np.abs(small[c-K:c] - small[s0-K:s0])))
        score = d - 0.004*(c - s0)                      # längere Schleifen leicht bevorzugen
        if best is None or score < best[0]: best = (score, d, s0, c)
_, d, S0, c = best
p = subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r",str(fps),"-i","-",
                      "-an","-c:v","libx264","-preset","veryfast","-crf","22","-pix_fmt","yuv420p","-movflags","+faststart",dst],stdin=subprocess.PIPE)
mode = "Überblendung"
import os
if d <= 3.1 and not os.environ.get("PINGPONG"):
    L = c - S0
    for j in range(L):
        f = F[S0+j]
        if j >= L-K:
            a = (j-(L-K)+1)/(K+1); a = a*a*(3-2*a)        # weiche Kurve
            f = ((1-a)*F[S0+j].astype(np.float32) + a*F[S0-K+(j-(L-K))].astype(np.float32)).astype(np.uint8)
        p.stdin.write(f.tobytes())
else:
    # Anfang und Ende passen nicht zusammen (die KI ist im Ablauf verrutscht): vorwärts und rückwärts abspielen,
    # Umkehrpunkte dort, wo sich am wenigsten bewegt (Haltephasen) -> kein Geisterbild, keine Sprünge
    mode = "vor/zurück"
    sp = np.array([np.mean(np.abs(small[i+1]-small[i])) for i in range(n-1)])
    sm = np.convolve(sp, np.ones(5)/5, mode="same")
    a0 = int(np.argmin(sm[2:int(1.2*fps)])) + 2
    b0 = int(np.argmin(sm[n-int(1.4*fps):n-6])) + n-int(1.4*fps)
    seq = list(range(a0, b0+1)) + list(range(b0-1, a0, -1))
    for i in seq: p.stdin.write(F[i].tobytes())
    S0, c, L = a0, b0, len(seq)
p.stdin.close(); p.wait()
print(f"{src.split('/')[-1]}: {n} Bilder, {mode} {S0}..{c} (Abweichung {d:.1f}), Länge {L/fps:.2f}s")
