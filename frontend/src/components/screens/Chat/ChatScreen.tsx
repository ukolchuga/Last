import React, { useRef, type DragEvent } from "react";
import { Logo } from "@/components/common/Logo";
import { useChatLogic } from "./hooks/useChatLogic";
import { useVoiceRecording } from "./hooks/useVoiceRecording";
import { MessageList } from "./components/MessageList";
import { ChatInput } from "./components/ChatInput";
import { ProductList } from "./components/ProductList";
import { AddonsForm } from "./components/AddonsForm";
import { DocumentStatus } from "./components/DocumentStatus";
import { CountrySelector } from "./components/CountrySelector";
import { AppointmentCalendar } from "./components/AppointmentCalendar";
import { ParticipantForm } from "./components/ParticipantForm";
import { BillingForm } from "./components/BillingForm";
import { OrderSummary } from "./components/OrderSummary";
import { VoiceOverlay } from "./components/VoiceOverlay";
import { SuccessOverlay } from "./components/SuccessOverlay";

export function ChatScreen({
  onBack,
  initialUserMsg,
  initialFile,
}: {
  onBack: () => void;
  initialUserMsg?: string;
  initialFile?: File;
}) {
  const chat = useChatLogic(initialUserMsg, initialFile);
  const voice = useVoiceRecording(chat.billingData, chat.setBillingData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    chat.setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    chat.setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    chat.setIsDragging(false);
    
    const f = e.dataTransfer.files?.[0];
    if (f) {
      const userMsgId = crypto.randomUUID();
      chat.setMessages((prev) => [...prev, { id: userMsgId, role: "user", content: `Uploaded: ${f.name}` }]);
      const aiMsgId = crypto.randomUUID();
      chat.setMessages((prev) => [...prev, { id: aiMsgId, role: "assistant", content: "", isTyping: true }]);
      chat.callAnalyzeApi(f, aiMsgId);
    }
  };

  function parseContent(text: string) {
    return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={i}>{part.slice(2, -2)}</strong>
        : <span key={i}>{part}</span>
    );
  }

  const rendered = [
    ...chat.exitBatch.map((m) => ({ ...m, _exiting: true, _fromBottom: -1 })),
    ...chat.messages.map((m, i) => ({
      ...m,
      _exiting: false,
      _fromBottom: chat.messages.length - 1 - i,
    })),
  ];

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`chat-page-in chat-bg h-screen w-full flex flex-col transition-colors duration-300 ${chat.isDragging ? "bg-accent/5" : ""}`}
    >
      {chat.isFinished && <SuccessOverlay onBack={onBack} />}

      {/* Header */}
      <div className="flex-shrink-0 w-full px-6 py-6 flex items-center justify-between z-10 backdrop-blur-md bg-white/20 border-b border-white/10">
        <button onClick={onBack} aria-label="Back to home" className="transition hover:opacity-80">
          <Logo />
        </button>
        <div className="w-10" />
      </div>

      {/* Messages */}
      <MessageList messages={chat.messages} rendered={rendered} parseContent={parseContent} />

      {/* Bottom Sticky Area */}
      <div className="flex-shrink-0 w-full max-w-2xl mx-auto px-6 pb-12 space-y-4">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              const userMsgId = crypto.randomUUID();
              chat.setMessages((prev) => [...prev, { id: userMsgId, role: "user", content: `Uploaded: ${f.name}` }]);
              const aiMsgId = crypto.randomUUID();
              chat.setMessages((prev) => [...prev, { id: aiMsgId, role: "assistant", content: "", isTyping: true }]);
              chat.callAnalyzeApi(f, aiMsgId);
            }
          }}
        />

        {!chat.selectedProduct && chat.selectedCountry && (
          <CountrySelector 
            selectedCountry={chat.selectedCountry}
            isChangingCountry={chat.isChangingCountry}
            setIsChangingCountry={chat.setIsChangingCountry}
            countrySearch={chat.countrySearch}
            setCountrySearch={chat.setCountrySearch}
            allCountries={chat.allCountries}
            onSelect={(c) => {
              chat.setSelectedCountry(c);
              chat.setIsChangingCountry(false);
              chat.fetchServices(c);
              chat.setCountrySearch("");
            }}
          />
        )}

        {chat.appointmentStep && (
          <AppointmentCalendar 
            appointmentData={chat.appointmentData}
            setAppointmentData={chat.setAppointmentData}
            onConfirm={() => {
              chat.setAppointmentStep(false);
              chat.setParticipantStep(true);
              const tid = crypto.randomUUID();
              chat.setMessages((prev) => [...prev, { id: tid, role: "assistant", content: `Great! Appointment scheduled for **${chat.appointmentData.date}** at **${chat.appointmentData.time}**. Would you like to add another participant to this booking?`, isTyping: false }]);
            }}
          />
        )}

        {chat.participantStep && (
          <ParticipantForm 
            addSigner={chat.addSigner}
            setAddSigner={chat.setAddSigner}
            signerEmail={chat.signerEmail}
            setSignerEmail={chat.setSignerEmail}
            signerWillSign={chat.signerWillSign}
            setSignerWillSign={chat.setSignerWillSign}
            onContinue={() => {
              chat.setParticipantStep(false);
              chat.setBillingStep(true);
              const tid = crypto.randomUUID();
              chat.setMessages((prev) => [...prev, { id: tid, role: "assistant", content: "Perfect. Now, please finalize your billing information.", isTyping: false }]);
            }}
          />
        )}

        {chat.billingStep && (
          <>
            <BillingForm 
              billingData={chat.billingData}
              setBillingData={chat.setBillingData}
              voiceExtractedFields={voice.voiceExtractedFields}
              onVoiceClick={voice.startVoiceRecording}
              onProceed={() => {
                chat.setBillingStep(false);
                chat.setSummaryStep(true);
                const tid = crypto.randomUUID();
                chat.setMessages((prev) => [...prev, { id: tid, role: "assistant", content: "Great! Please review your order summary below.", isTyping: false }]);
              }}
            />
            {voice.isVoiceMode && (
              <VoiceOverlay 
                isRecording={voice.isRecording}
                billingData={chat.billingData}
                voiceExtractedFields={voice.voiceExtractedFields}
                onStop={voice.stopVoiceRecording}
              />
            )}
          </>
        )}

        {chat.summaryStep && (
          <OrderSummary 
            selectedProduct={chat.selectedProduct}
            finalAmount={chat.finalAmount}
            onConfirm={() => chat.setIsFinished(true)}
          />
        )}

        {chat.showAddons && chat.selectedProduct && (
          <AddonsForm 
            selectedProduct={chat.selectedProduct}
            addApostille={chat.addApostille}
            setAddApostille={chat.setAddApostille}
            addProofOfRepresentation={chat.addProofOfRepresentation}
            setAddProofOfRepresentation={chat.setAddProofOfRepresentation}
            onProceed={chat.handleProceedFromAddons}
          />
        )}

        {chat.selectedProduct && !chat.hasFile && !chat.appointmentStep && !chat.billingStep && !chat.summaryStep && !chat.participantStep && !chat.showAddons && (
          <DocumentStatus 
            docsNotReady={chat.docsNotReady}
            setDocsNotReady={chat.setDocsNotReady}
            needHelpDrafting={chat.needHelpDrafting}
            setNeedHelpDrafting={chat.setNeedHelpDrafting}
            onUploadClick={() => fileInputRef.current?.click()}
            onContinue={chat.handleContinueWithoutDocument}
          />
        )}

        <ProductList 
          products={chat.products}
          onSelect={chat.handleProductSelect}
          onNoneOfThese={() => {
            chat.setProducts([]);
            chat.handleSend("None of these match what I need.");
          }}
        />

        <ChatInput 
          input={chat.input}
          setInput={chat.setInput}
          handleSend={chat.handleSend}
          disabled={chat.appointmentStep || chat.billingStep || chat.summaryStep || chat.participantStep || chat.showAddons}
        />
      </div>
    </div>
  );
}
