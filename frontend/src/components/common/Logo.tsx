import notarityLogo from "@/assets/notarity-logo.svg";

export function Logo() {
  return (
    <img
      src={notarityLogo}
      alt="notarity"
      className="h-6 w-auto select-none"
    />
  );
}
