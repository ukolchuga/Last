import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LandingScreen } from "@/components/screens/Landing/LandingScreen";
import { BookingScreen } from "@/components/screens/Booking/BookingScreen";
import { ChatScreen } from "@/components/screens/Chat/ChatScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Notarity — Notarise Documents Online" },
      {
        name: "description",
        content:
          "Simplify your business processes with our digital platform for all your global notarisation matters. Efficient, legally compliant, anywhere and anytime.",
      },
      { property: "og:title", content: "Notarity — Notarise Documents Online" },
      {
        property: "og:description",
        content: "Digital notarisation platform — anywhere and anytime.",
      },
    ],
  }),
  component: Index,
});

type View = "landing" | "booking" | "chat";

function Index() {
  const [view, setView] = useState<View>("landing");
  const [initialUserMsg, setInitialUserMsg] = useState<string | undefined>(undefined);
  const [initialFile, setInitialFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    if (view === "booking") {
      document.body.classList.add("is-loaded");
      const t = setTimeout(() => document.body.classList.add("is-transitioned"), 50);
      return () => clearTimeout(t);
    } else {
      document.body.classList.remove("is-loaded");
      document.body.classList.remove("is-transitioned");
    }
  }, [view]);

  const openBooking = () => {
    setInitialUserMsg(undefined);
    setInitialFile(undefined);
    setView("booking");
  };
  const backToLanding = () => setView("landing");
  const openChat = (msg?: string, file?: File) => {
    setInitialUserMsg(msg);
    setInitialFile(file);
    setView("chat");
  };

  return (
    <>
      {view === "landing" && <LandingScreen onBook={openBooking} />}
      {view === "booking" && <BookingScreen onBack={backToLanding} onStartChat={openChat} />}
      {view === "chat" && (
        <ChatScreen
          onBack={backToLanding}
          initialUserMsg={initialUserMsg}
          initialFile={initialFile}
        />
      )}
    </>
  );
}
