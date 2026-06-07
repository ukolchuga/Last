import { useState, useEffect, useRef } from "react";

export type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
  displayContent?: string;
  isTyping?: boolean;
  isRevealing?: boolean;
};

const FIRST_MSG = "Looks like you need a **signature notarisation** to send your document to the national bank. Is it right?";

export function useChatLogic(initialUserMsg?: string, initialFile?: File) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [exitBatch, setExitBatch] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [allCountries, setAllCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isChangingCountry, setIsChangingCountry] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [hasFile, setHasFile] = useState(false);
  const [addApostille, setAddApostille] = useState(false);
  const [addProofOfRepresentation, setAddProofOfRepresentation] = useState(false);
  const [addSigner, setAddSigner] = useState(false);
  const [signerEmail, setSignerEmail] = useState("");
  const [signerWillSign, setSignerWillSign] = useState(false);
  const [showAddons, setShowAddons] = useState(false);
  const [docsNotReady, setDocsNotReady] = useState(false);
  const [needHelpDrafting, setNeedHelpDrafting] = useState(false);
  const [appointmentStep, setAppointmentStep] = useState(false);
  const [billingStep, setBillingStep] = useState(false);
  const [summaryStep, setSummaryStep] = useState(false);
  const [participantStep, setParticipantStep] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [finalAmount] = useState(Math.floor(Math.random() * (759 - 194 + 1)) + 194);
  const [isDragging, setIsDragging] = useState(false);

  const [appointmentData, setAppointmentData] = useState({
    date: "",
    time: ""
  });
  
  const [billingData, setBillingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "",
    isCompany: false,
    companyName: "",
    vatNumber: "",
    sameAsBilling: true,
    contactFirstName: "",
    contactLastName: "",
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    contactCity: "",
    contactZip: "",
    contactCountry: "",
    contactIsCompany: false,
    contactCompanyName: "",
  });

  const revealRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initialisedRef = useRef(false);

  // API Calls
  async function fetchCountries() {
    try {
      const response = await fetch(`/api/countries`);
      const data = await response.json();
      setAllCountries(data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  }

  async function fetchServices(country: string) {
    try {
      const response = await fetch(`/api/services?country=${country}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  }

  async function callChatApi(text: string, msgId: string) {
    try {
      const history = messages.slice(-5).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch(`/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: text,
          history: history 
        }),
      });
      const data = await response.json();
      
      if (data.destinationCountry) {
        setSelectedCountry(data.destinationCountry);
      }

      if (data.products && data.products.length > 0) {
        setProducts(data.products);
      } else if (!data.destinationCountry) {
        setProducts([]);
      }
      startReveal(msgId, data.reply || "I'm sorry, I couldn't process that.");
    } catch (error) {
      console.error("Chat error:", error);
      startReveal(msgId, "Error connecting to the AI assistant.");
    }
  }

  async function callAnalyzeApi(file: File, msgId: string) {
    try {
      setHasFile(true);
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`/ai/analyze-document`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.destinationCountry) {
        setSelectedCountry(data.destinationCountry);
      }

      if (selectedProduct) {
        setAppointmentStep(true);
        startReveal(msgId, "Document received and analyzed. Now, please select a convenient date and time for your notary appointment.");
      } else {
        if (data.products) setProducts(data.products);
        const reply = data.explanation || (data.destinationCountry
          ? `I've analyzed your document. It appears to be for **${data.destinationCountry}**. Based on this, I've found some relevant notarization services for you.`
          : "I've analyzed the document but couldn't determine the destination country. Here are some general services.");
        startReveal(msgId, reply);
      }
    } catch (error) {
      console.error("Analysis error:", error);
      startReveal(msgId, "Error analyzing the document. Please ensure it's a valid PDF.");
    }
  }

  function startReveal(msgId: string, fullContent: string) {
    const plain = fullContent.replace(/\*\*(.*?)\*\*/g, "$1");
    const words = plain.split(/\s+/).filter(Boolean);
    if (revealRef.current) clearInterval(revealRef.current);

    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId
          ? {
              ...m,
              content: fullContent,
              isTyping: false,
              displayContent: words[0] ?? "",
              isRevealing: words.length > 1,
            }
          : m
      )
    );

    if (words.length <= 1) return;
    let idx = 1;
    revealRef.current = setInterval(() => {
      idx++;
      const done = idx >= words.length;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId
            ? {
                ...m,
                displayContent: done ? undefined : words.slice(0, idx).join(" "),
                isRevealing: !done,
              }
            : m
        )
      );
      if (done) {
        clearInterval(revealRef.current!);
        revealRef.current = null;
      }
    }, 40);
  }

  function handleSend(overrideText?: string) {
    const text = (overrideText || input).trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: text },
    ]);
    if (!overrideText) setInput("");
    const tid = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: tid, role: "assistant", content: "", isTyping: true },
    ]);
    callChatApi(text, tid);
  }

  function handleProductSelect(product: any) {
    setSelectedProduct(product);
    setProducts([]);
    const tid = crypto.randomUUID();
    
    const title = (product.title?.en || product.title || "").toLowerCase();
    const needsAddons = title.includes("signature notarisation") || 
                        title.includes("certified copy") || 
                        title.includes("certification of facts") ||
                        title.includes("nie");

    if (needsAddons) {
      setShowAddons(true);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "user", content: `I've selected: ${product.title}` },
        { id: tid, role: "assistant", content: "Great choice! Would you like to add any additional certifications to this service?", isTyping: false }
      ]);
    } else {
      if (hasFile) {
        setAppointmentStep(true);
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "user", content: `I've selected: ${product.title}` },
          { id: tid, role: "assistant", content: "Great choice! Since you've already provided the document, let's proceed to scheduling your appointment.", isTyping: false }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "user", content: `I've selected: ${product.title}` },
          { id: tid, role: "assistant", content: "Great choice! To proceed, please tell me about your document status. Do you have it ready for upload?", isTyping: false }
        ]);
      }
    }
  }

  function handleProceedFromAddons() {
    setShowAddons(false);
    const tid = crypto.randomUUID();
    let addonText = "";
    const addons = [addApostille ? "Apostille" : null, addProofOfRepresentation ? "Proof of Representation" : null].filter(Boolean);
    if (addons.length > 0) addonText = " with " + addons.join(" and ");

    if (hasFile) {
      setAppointmentStep(true);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "user", content: `Continue${addonText}` },
        { id: tid, role: "assistant", content: "Perfect. Let's proceed to scheduling your appointment.", isTyping: false }
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "user", content: `Continue${addonText}` },
        { id: tid, role: "assistant", content: "To proceed, please tell me about your document status. Do you have it ready for upload?", isTyping: false }
      ]);
    }
  }

  useEffect(() => {
    fetchCountries();
    if (initialisedRef.current) return;
    initialisedRef.current = true;
    
    if (initialFile) {
      const tid = "ai-1";
      setMessages([{ id: "f0", role: "user", content: `Uploaded: ${initialFile.name}` }, { id: tid, role: "assistant", content: "", isTyping: true }]);
      callAnalyzeApi(initialFile, tid);
    } else if (initialUserMsg?.trim()) {
      const tid = "ai-1";
      setMessages([{ id: "u0", role: "user", content: initialUserMsg.trim() }, { id: tid, role: "assistant", content: "", isTyping: true }]);
      callChatApi(initialUserMsg.trim(), tid);
    } else {
      const tid = "ai-1";
      setMessages([{ id: tid, role: "assistant", content: "", isTyping: true }]);
      const t = setTimeout(() => startReveal(tid, FIRST_MSG), 2100);
      return () => clearTimeout(t);
    }
  }, []);

  function handleContinueWithoutDocument() {
    setAppointmentStep(true);
    const tid = crypto.randomUUID();
    const userMsg = docsNotReady ? "Documents are not ready yet" : "I need help drafting documents";
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: userMsg },
      { id: tid, role: "assistant", content: "No problem! We can proceed with scheduling. You can upload your documents later. Now, please select a convenient date and time for your notary appointment.", isTyping: false }
    ]);
  }

  return {
    messages, setMessages,
    exitBatch, setExitBatch,
    input, setInput,
    products, setProducts,
    allCountries,
    selectedCountry, setSelectedCountry,
    isChangingCountry, setIsChangingCountry,
    countrySearch, setCountrySearch,
    selectedProduct, setSelectedProduct,
    hasFile, setHasFile,
    addApostille, setAddApostille,
    addProofOfRepresentation, setAddProofOfRepresentation,
    addSigner, setAddSigner,
    signerEmail, setSignerEmail,
    signerWillSign, setSignerWillSign,
    showAddons, setShowAddons,
    docsNotReady, setDocsNotReady,
    needHelpDrafting, setNeedHelpDrafting,
    appointmentStep, setAppointmentStep,
    billingStep, setBillingStep,
    summaryStep, setSummaryStep,
    participantStep, setParticipantStep,
    isFinished, setIsFinished,
    finalAmount,
    isDragging, setIsDragging,
    appointmentData, setAppointmentData,
    billingData, setBillingData,
    handleSend,
    handleProductSelect,
    handleProceedFromAddons,
    handleContinueWithoutDocument,
    callAnalyzeApi,
    fetchServices
  };
}
