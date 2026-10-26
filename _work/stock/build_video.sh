#!/usr/bin/env bash
# Rebuilds assets/video/* (hero brand film) from the two Pexels 4K masters.
# Masters (not committed, ~270 MB): download into _work/stock/video/
#   https://videos.pexels.com/video-files/17094405/17094405-uhd_3840_2160_30fps.mp4 -> video/17094405-4k.mp4
#   https://videos.pexels.com/video-files/17094323/17094323-uhd_3840_2160_30fps.mp4 -> video/17094323-4k.mp4
# Needs ffmpeg with libx264 + libvpx-vp9 (e.g. `pip install imageio-ffmpeg`). Usage: FF=/path/to/ffmpeg bash build_video.sh
set -euo pipefail
cd "$(dirname "$0")"
FF="${FF:-ffmpeg}"
OUT=../../assets/video
mkdir -p "$OUT"

# Edit: sunset conveyor reveal (17094405, 0–7.5 s) dissolving into the dusk stockpile push-in
# (17094323, 3–15 s); light grade per shot; dip from/to dark so the 18.3 s loop has no hard cut.
graph() {
  echo "[0:v]trim=0:7.5,setpts=PTS-STARTPTS,fps=30,eq=gamma=1.18:contrast=1.04:saturation=0.95,$1,settb=AVTB[b];[1:v]trim=3:15,setpts=PTS-STARTPTS,fps=30,eq=contrast=1.06:saturation=0.92:gamma=1.02,$1,settb=AVTB[a];[b][a]xfade=transition=fade:duration=1.2:offset=6.3,fade=t=in:st=0:d=0.8,fade=t=out:st=17.5:d=0.8,format=yuv420p[v]"
}
encode() { # $1 scale/crop filter, $2 output basename, $3 x264 crf, $4 vp9 crf
  "$FF" -v error -y -i video/17094405-4k.mp4 -i video/17094323-4k.mp4 -filter_complex "$(graph "$1")" -map "[v]" -an \
    -c:v libx264 -profile:v high -preset slow -crf "$3" -movflags +faststart "$OUT/$2.mp4"
  "$FF" -v error -y -i video/17094405-4k.mp4 -i video/17094323-4k.mp4 -filter_complex "$(graph "$1")" -map "[v]" -an \
    -c:v libvpx-vp9 -b:v 0 -crf "$4" -deadline good -cpu-used 3 -row-mt 1 -tile-columns 2 "$OUT/$2.webm"
}
encode "scale=2560:-2" hero-1440p 25 36
encode "scale=1920:-2" hero-1080p 25 36
encode "crop=1215:2160:(iw-1215)/2:0,scale=720:1280" hero-portrait-720p 26 37   # native 9:16 cut for phones
# poster frame (graded like the opening shot) -> _work/stock/frames/poster-4k.png, consumed by build_images.py
mkdir -p frames
"$FF" -v error -y -ss 1.6 -i video/17094405-4k.mp4 -frames:v 1 -vf "eq=gamma=1.18:contrast=1.04:saturation=0.95" frames/poster-4k.png
ls -la "$OUT"
