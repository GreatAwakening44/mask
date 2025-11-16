import { useState, useEffect } from "react";
import LandingPage from "./pages/index";
import ChatArea from "./components/chat";

const App = () => {
  const [currentSpace, setCurrentSpace] = useState<{ id: string; isHost: boolean } | null>(null);

  // Check URL param for auto-join
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const spaceParam = params.get("space");
    if (spaceParam) {
      setCurrentSpace({ id: spaceParam, isHost: false }); // auto-join as guest
    }
  }, []);

  if (!currentSpace) {
    return <LandingPage onEnterSpace={(id, isHost) => setCurrentSpace({ id, isHost })} />;
  }

  return <ChatArea spaceId={currentSpace.id} onBack={() => setCurrentSpace(null)} />;
};

export default App;
