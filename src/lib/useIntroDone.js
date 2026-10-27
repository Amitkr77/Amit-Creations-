import { useEffect, useState } from "react";
import { on, sceneState } from "./bus";

export function useIntroDone() {
  const [done, setDone] = useState(sceneState.introDone);
  useEffect(() => {
    if (sceneState.introDone) setDone(true);
    return on("intro:done", () => setDone(true));
  }, []);
  return done;
}
