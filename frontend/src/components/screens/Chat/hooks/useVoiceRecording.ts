import { useRef, useState } from "react";

export function useVoiceRecording(billingData: any, setBillingData: (data: any) => void) {
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceExtractedFields, setVoiceExtractedFields] = useState<string[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  async function startVoiceRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("file", audioBlob, "voice.wav");

        try {
          const response = await fetch(`/ai/process-voice`, {
            method: "POST",
            body: formData,
          });
          const result = await response.json();
          if (result.data) {
            const found: string[] = [];
            const newData = { ...billingData };
            
            Object.entries(result.data).forEach(([key, val]) => {
              if (val && typeof val === 'string' && val.trim().length > 0) {
                newData[key] = val;
                found.push(key);
              }
            });
            
            setBillingData(newData);
            setVoiceExtractedFields(found);
            
            setTimeout(() => {
              setIsVoiceMode(false);
              setVoiceExtractedFields([]);
            }, 2000);
          }
        } catch (err) {
          console.error("Voice processing error:", err);
          setIsVoiceMode(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsVoiceMode(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  }

  function stopVoiceRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  }

  return {
    isVoiceMode,
    setIsVoiceMode,
    isRecording,
    voiceExtractedFields,
    startVoiceRecording,
    stopVoiceRecording
  };
}
