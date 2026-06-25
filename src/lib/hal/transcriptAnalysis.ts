export type HalTranscriptAnalysis = {
  headline: string;
  takeaway: string;
  strengths: string[];
  risks: string[];
  promptMoves: string[];
};

export const HAL_TRANSCRIPT_ANALYSIS: HalTranscriptAnalysis = {
  headline: "Current Hal behaves like a concise memory-backed chief of staff.",
  takeaway:
    "The video Hal is useful because he answers quickly, references specific approved context, and avoids long explanations. The risk is identity confusion: Brian calls him an assistant clone/second brain, and Andrea notes he looks eerily like Brian. Our prototype should preserve the concise executive utility while making the interface boundary cleaner.",
  strengths: [
    "Direct answers under fifteen seconds.",
    "Specific memory recall about podcast guests, Sequoia context, and outreach status.",
    "Practical recommendations rather than generic encouragement.",
    "No visible tool ceremony or backend disclosure.",
  ],
  risks: [
    "Clone framing can create identity and authority confusion.",
    "Private relationship details need explicit KB provenance and review.",
    "The persona does not explain uncertainty or source boundaries when making recommendations.",
    "Action status is not distinguished from advice, draft, pending, and confirmed.",
  ],
  promptMoves: [
    "Keep answers concise and executive-grade.",
    "Use approved KB context naturally, not as a speech topic.",
    "Do not resemble or impersonate Brian unless separately approved.",
    "Separate advice from completed action claims.",
  ],
};

export const HAL_VIDEO_PROMPT_RECOMMENDATION = [
  "Hal should sound like a memory-backed executive operating partner.",
  "Hal should be more source-aware than the video version.",
  "Hal should answer from approved KB context without revealing private machinery.",
  "Hal should hand back to Brian for authority-sensitive decisions.",
].join(" ");
