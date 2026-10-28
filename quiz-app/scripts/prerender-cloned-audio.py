# -*- coding: utf-8 -*-
"""
Fast Pre-render of 14 OCP Java 21 Theory Chapters into static .mp3 + .json timestamp cues
using the 4 Cloned AI Voices (VieNeu-TTS v3turbo int8 on-device).
"""

import os
import sys
import re
import json
import time
import argparse
from pathlib import Path
import numpy as np
import soundfile as sf

ROOT_DIR = Path(r"T:\University\Interview\Java\ocp-21-study-guide")
OUT_DIR = ROOT_DIR / "quiz-app" / "assets" / "theory_audio"
CLONED_VOICES_DIR = Path(r"D:\FullCourse_OneChamp\drive-video-player\src\assets\cloned_voices")

THEORY_FILES = {
    1: "01-chapter-1-building-blocks.md",
    2: "02-chapter-2-operators.md",
    3: "03-chapter-3-making-decisions.md",
    4: "04-chapter-4-core-apis.md",
    5: "05-chapter-5-methods.md",
    6: "06-chapter-6-class-design.md",
    7: "07-chapter-7-beyond-classes.md",
    8: "08-chapter-8-lambdas.md",
    9: "09-chapter-9-collections.md",
    10: "10-chapter-10-streams.md",
    11: "11-chapter-11-exceptions.md",
    12: "12-chapter-12-modules.md",
    13: "13-chapter-13-concurrency.md",
    14: "14-chapter-14-io.md",
}

VOICE_CONFIGS = {
    "cloned_microservices_female": "microservices_female",
    "cloned_jobhub_female": "jobhub_female",
    "cloned_angular_male": "angular_male",
    "cloned_angular_female": "angular_female",
}


def clean_markdown_to_single_clause(md_text: str, max_chars: int = 125) -> str:
    if not md_text:
        return ""
    text = re.sub(r"```[\s\S]*?```", " ", md_text)
    text = re.sub(r"^\s*\|?[\s\-:|]+\|[\s\-:|]*$", " ", text, flags=re.M)
    text = re.sub(r"\[!WARNING\]", "Cảnh báo bẫy thi: ", text, flags=re.I)
    text = re.sub(r"\[!TIP\]", "Mẹo thi: ", text, flags=re.I)
    text = re.sub(r"\[!IMPORTANT\]", "Quan trọng: ", text, flags=re.I)
    text = re.sub(r"\[!NOTE\]", "Lưu ý: ", text, flags=re.I)
    text = re.sub(r"\[!CAUTION\]", "Thận trọng: ", text, flags=re.I)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"^#{1,6}\s+", "", text, flags=re.M)
    text = re.sub(r"[*_`~>|()\"']", " ", text)
    text = re.sub(r"^[-•+]\s+", "", text, flags=re.M)
    # Replace periods with commas inside the clause so VieNeu runs a single fast forward pass
    text = re.sub(r"[.!?]+", ", ", text)
    text = re.sub(r"\s+", " ", text).strip(" ,;-")

    if len(text) <= max_chars:
        return text

    cut = text[:max_chars]
    for sep in [", ", "; ", " "]:
        idx = cut.rfind(sep)
        if idx > max_chars // 2:
            return cut[:idx].strip(" ,;-")
    return cut.strip(" ,;-")


def extract_chapter_sections(md_content: str, chapter_id: int, max_sections: int = 7) -> list[dict]:
    lines = md_content.splitlines()
    sections = []
    current_heading = f"Chương {chapter_id}"
    current_lines = []

    for line in lines:
        h1_match = re.match(r"^#\s+(.+)$", line)
        h2_match = re.match(r"^##\s+(.+)$", line)
        if h1_match:
            if current_lines:
                sections.append((current_heading, "\n".join(current_lines)))
            current_heading = h1_match.group(1).strip()
            current_lines = []
        elif h2_match:
            if current_lines:
                sections.append((current_heading, "\n".join(current_lines)))
            current_heading = h2_match.group(1).strip()
            current_lines = []
        else:
            current_lines.append(line)

    if current_lines:
        sections.append((current_heading, "\n".join(current_lines)))

    filtered = []
    for heading, body in sections:
        low_h = heading.lower()
        if "mục lục" in low_h or "table of contents" in low_h:
            continue
        filtered.append((heading, body))

    # Keep all H2 sections (or sample evenly if more than max_sections)
    if len(filtered) > max_sections:
        step = len(filtered) / float(max_sections)
        picked = [filtered[int(i * step)] for i in range(max_sections)]
    else:
        picked = filtered

    cues_input = []
    for heading, body in picked:
        clean_heading = re.sub(r"[*_`~]", "", heading).strip()
        heading_spoken = re.sub(r"[.!?()]", ", ", clean_heading)
        spoken_body = clean_markdown_to_single_clause(body, max_chars=115)
        if not spoken_body:
            spoken_text = f"{heading_spoken}."
        else:
            spoken_text = f"{heading_spoken}, {spoken_body}."

        cues_input.append({
            "anchorText": clean_heading,
            "text": spoken_text
        })

    return cues_input


def render_voices(voice_ids: list[str], chapters: list[int], threads: int = 6, force: bool = False):
    from vieneu import Vieneu
    from vieneu_utils.phonemize_text import phonemize_text_with_emotions
    from vieneu_utils.core_utils import max_expected_frames

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Loading VieNeu v3turbo int8 (threads={threads}) for voices={voice_ids}...", flush=True)
    t_load = time.time()
    tts = Vieneu(mode="v3turbo", precision="int8", threads=threads)
    sr = getattr(tts, "sample_rate", 48000) or 48000

    voice_refs = {}
    for vid in voice_ids:
        base_name = VOICE_CONFIGS[vid]
        emb = np.asarray(np.load(str(CLONED_VOICES_DIR / f"{base_name}_emb.npy")), dtype=np.float32)
        codes = np.asarray(np.load(str(CLONED_VOICES_DIR / f"{base_name}_codes.npy")), dtype=np.int64)
        voice_refs[vid] = (emb, codes)

    print(f"Model ready in {time.time() - t_load:.2f}s", flush=True)

    # Pre-phonemize all chapters once in this worker
    chapter_phonemes = {}
    for ch_id in chapters:
        md_file = ROOT_DIR / THEORY_FILES[ch_id]
        if not md_file.exists():
            continue
        cues_input = extract_chapter_sections(md_file.read_text(encoding="utf-8"), ch_id)
        for item in cues_input:
            ph = phonemize_text_with_emotions(item["text"])
            item["ph"] = ph
            item["max_frames"] = min(260, max_expected_frames(ph))
        chapter_phonemes[ch_id] = cues_input

    pause_sec = 0.35
    pause_samples = np.zeros(int(sr * pause_sec), dtype=np.float32)

    for ch_id in chapters:
        if ch_id not in chapter_phonemes:
            continue
        cues_input = chapter_phonemes[ch_id]

        for vid in voice_ids:
            mp3_path = OUT_DIR / f"ch{ch_id}_{vid}.mp3"
            json_path = OUT_DIR / f"ch{ch_id}_{vid}.json"
            if not force and mp3_path.exists() and json_path.exists() and mp3_path.stat().st_size > 8000:
                print(f"[{vid}] CH{ch_id} exists, skipping.", flush=True)
                continue

            emb, codes = voice_refs[vid]
            audio_segments = []
            cues_manifest = []
            current_time_sec = 0.0
            t_ch = time.time()

            for idx, item in enumerate(cues_input):
                wav = tts.engine.infer(
                    phonemes=item["ph"],
                    speaker_emb=emb,
                    ref_codes=codes,
                    use_ref_codes=True,
                    temperature=0.8,
                    top_k=25,
                    top_p=0.95,
                    max_new_frames=item["max_frames"],
                    repetition_penalty=1.2,
                )
                wav = np.asarray(wav, dtype=np.float32).reshape(-1)
                dur_sec = float(len(wav)) / float(sr)
                start_sec = round(current_time_sec, 3)
                end_sec = round(current_time_sec + dur_sec, 3)

                cues_manifest.append({
                    "index": idx,
                    "start": start_sec,
                    "end": end_sec,
                    "voiceId": vid,
                    "anchorText": item["anchorText"],
                    "text": item["text"],
                })
                audio_segments.append(wav)
                audio_segments.append(pause_samples)
                current_time_sec += dur_sec + pause_sec

            full_audio = np.concatenate(audio_segments) if audio_segments else np.zeros(sr, dtype=np.float32)
            sf.write(str(mp3_path), full_audio, sr, format="MP3")

            manifest_data = {
                "chapterId": ch_id,
                "voiceId": vid,
                "audioUrl": f"assets/theory_audio/ch{ch_id}_{vid}.mp3",
                "duration": round(current_time_sec, 2),
                "cues": cues_manifest,
            }
            json_path.write_text(json.dumps(manifest_data, ensure_ascii=False, indent=2), encoding="utf-8")
            print(
                f"[{vid}] CH{ch_id} ({len(cues_input)} cues) -> {mp3_path.name} ({mp3_path.stat().st_size // 1024} KB, {current_time_sec:.1f}s audio) in {time.time() - t_ch:.1f}s",
                flush=True,
            )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--voices", type=str, default="cloned_microservices_female,cloned_jobhub_female,cloned_angular_male,cloned_angular_female")
    parser.add_argument("--chapters", type=str, default="1-14")
    parser.add_argument("--threads", type=int, default=6)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    v_list = [v.strip() for v in args.voices.split(",") if v.strip()]
    if "-" in args.chapters:
        s, e = args.chapters.split("-")
        ch_list = list(range(int(s), int(e) + 1))
    else:
        ch_list = [int(x) for x in args.chapters.split(",") if x.strip()]

    render_voices(v_list, ch_list, threads=args.threads, force=args.force)


if __name__ == "__main__":
    main()
