import { HalConsole } from "@/components/HalConsole";
import { HAL_TRANSCRIPT_ANALYSIS } from "@/lib/hal/transcriptAnalysis";

export default function Home() {
  return <HalConsole transcriptAnalysis={HAL_TRANSCRIPT_ANALYSIS} />;
}
