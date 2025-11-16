import { useState } from "react";
import LandingPage from "./index"
import ChatArea from "../components/chat";

const Index = () => {
  const [currentSpace, setCurrentSpace] = useState<{id: string; isHost: boolean} | null>(null);

  if (!currentSpace) {
    return <LandingPage onEnterSpace={(id, isHost) => setCurrentSpace({id, isHost})} />;
  }

  return <ChatArea spaceId={currentSpace.id} onBack={() => setCurrentSpace(null)} />;
};

export default Index;
