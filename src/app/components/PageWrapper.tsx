'use client';

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col animate-fadeIn">
      {children}
    </div>
  );
}
