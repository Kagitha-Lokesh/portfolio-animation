# Character Keyframe Prompts — Google Flow (Nano Banana)
Attach your character reference sheet as the Ingredient before generating any of these.

---

**K1 — Home (starting picture)**
Pixar-style 3D cartoon character, using the uploaded reference sheet for face and proportions — short wavy dark hair, round glasses, light beard, warm skin tone. Wearing a green hoodie with a backpack over one shoulder. Walking in from the left side of the frame, mid-step, casual confident stride, one hand just starting to lift up. Full body visible, portrait orientation. Background: clean modern professional website look, soft plain mint-green to cream gradient only, completely flat and empty, no shapes, no panels, no cards, no glass elements, no objects of any kind, generous empty negative space on the right side of the frame, no text, no logos.

**K2 — Home ending / About Me starting**
Pixar-style 3D cartoon character, using the uploaded reference sheet for face and proportions — short wavy dark hair, round glasses, light beard, warm skin tone. Wearing a green hoodie with a backpack. Standing centered in frame, both feet planted, one hand raised in a friendly wave, warm relaxed smile. Full body visible, portrait orientation. Background: clean modern professional website look, soft plain mint-green to cream gradient only, completely flat and empty, no shapes, no panels, no cards, no glass elements, no objects of any kind, generous empty negative space, no text, no logos.

**K3 — About Me ending / Skills starting**
Pixar-style 3D cartoon character, using the uploaded reference sheet for face and proportions — short wavy dark hair, round glasses, light beard, warm skin tone. Wearing a beige knit sweater. Sitting comfortably in a plain solid-color beanbag chair, holding a simple coffee mug near their mouth mid-sip, relaxed and content expression, legs casually crossed. Full body visible, portrait orientation. Background: clean modern professional website look, soft plain warm cream gradient only, completely flat and empty, no shapes, no panels, no cards, no glass elements, no objects of any kind, generous empty negative space, no text, no logos.

**K4 — Skills ending / Tech Stack starting**
Pixar-style 3D cartoon character, using the uploaded reference sheet for face and proportions — short wavy dark hair, round glasses, light beard, warm skin tone. Wearing a yellow hoodie. Standing centered, one arm raised with index finger pointing forward confidently, other hand resting on hip, energetic confident expression. Full body visible, portrait orientation. Background: clean modern professional website look, soft plain golden-yellow to cream gradient only, completely flat and empty, no shapes, no panels, no cards, no glass elements, no objects of any kind, generous empty negative space, no text, no logos.

**K5 — Tech Stack ending / Projects starting**
Pixar-style 3D cartoon character, using the uploaded reference sheet for face and proportions — short wavy dark hair, round glasses, light beard, warm skin tone. Wearing a yellow hoodie. Body turned three-quarters to the side, one arm extended outward as if presenting something off to the right, engaged curious expression. Full body visible, portrait orientation. Background: clean modern professional website look, soft plain gradient from pale yellow to muted teal only, completely flat and empty, no shapes, no panels, no cards, no glass elements, no objects of any kind, generous empty negative space, no text, no logos.

**K6 — Projects ending / Experience starting**
Pixar-style 3D cartoon character, using the uploaded reference sheet for face and proportions — short wavy dark hair, round glasses, light beard, warm skin tone. Wearing a red hoodie. Seated at a plain minimal wooden desk, laptop open in front of them, both hands resting on the keyboard, focused determined expression looking down at the screen. Full body visible, portrait orientation. Background: clean modern professional website look, soft plain muted teal gradient only, completely flat and empty, no shapes, no panels, no cards, no glass elements, no objects of any kind (desk and laptop only, nothing else), generous empty negative space, no text, no logos.

**K7 — Experience ending / Education starting**
Pixar-style 3D cartoon character, using the uploaded reference sheet for face and proportions — short wavy dark hair, round glasses, light beard, warm skin tone. Wearing a purple hoodie with a backpack on both shoulders. Holding a small pair of binoculars up to their eyes with both hands, looking forward as if surveying a distant horizon, adventurous confident expression. Full body visible, portrait orientation. Background: clean modern professional website look, soft plain lavender to cream gradient only, completely flat and empty, no shapes, no panels, no cards, no glass elements, no objects of any kind, generous empty negative space, no text, no logos.

**K8 — Education ending / Achievements starting**
Pixar-style 3D cartoon character, using the uploaded reference sheet for face and proportions — short wavy dark hair, round glasses, light beard, warm skin tone. Wearing a light casual button shirt, with a backpack resting on the ground beside them. Sitting on a plain simple stool, holding an open book in both hands, looking up and slightly to the side with a thoughtful curious expression. Full body visible, portrait orientation. Background: clean modern professional website look, soft plain golden-cream gradient only, completely flat and empty, no shapes, no panels, no cards, no glass elements, no objects of any kind (stool, book, and backpack only, nothing else), generous empty negative space, no text, no logos.

**K9 — Achievements ending / Contact starting**
Pixar-style 3D cartoon character, using the uploaded reference sheet for face and proportions — short wavy dark hair, round glasses, light beard, warm skin tone. Wearing a collared shirt with sleeves rolled up. Standing tall, holding a small gold trophy up with one raised hand at shoulder height, big proud accomplished smile, confident energetic stance. Full body visible, portrait orientation. Background: clean modern professional website look, soft plain blush-pink to cream gradient only, completely flat and empty, no shapes, no panels, no cards, no glass elements, no objects of any kind besides the trophy in hand, generous empty negative space, no text, no logos.

**K10 — Contact (final ending picture)**
Pixar-style 3D cartoon character, using the uploaded reference sheet for face and proportions — short wavy dark hair, round glasses, light beard, warm skin tone. Wearing a green button-up shirt. Standing centered in frame, both hands raised in an enthusiastic double wave, wide warm welcoming smile, open friendly body language. Full body visible, portrait orientation. Background: clean modern professional website look, soft plain mint-green to cream gradient only, completely flat and empty, no shapes, no panels, no cards, no glass elements, no objects of any kind, generous empty negative space, no text, no logos.

---

## Note on how these 10 map to the enter/loop/exit frame structure
These K1–K10 images were designed for the earlier simpler chained-frame plan. Under the current Enter/Loop/Exit master prompt, each of these 10 images works as a **loop endpoint reference**:
- K1 → Home enter starting pose (frame 0 area)
- K2 → Home loop pose (frames 15–26 loop around this pose) / About enter starting pose
- K3 → About loop pose / Skills enter starting pose
- ...and so on through K10 → Contact loop pose (frames 510–517)

When generating your Frames-to-Video clips in Flow, use each pair (e.g. K1→K2) as first/last frame for that section's full Enter+Loop+Exit span, with a motion prompt describing: walk in (enter) → settle into the repeating loop motion → begin exiting toward the next pose (exit). You'll then slice out the loop segment separately per the frame numbers in sections.js so it can play as a seamless repeating loop independent of the enter/exit motion.
