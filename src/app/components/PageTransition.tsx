import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate page in
    gsap.fromTo(pageRef.current,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }
    );
  }, [pathname]);

  return (
    <div ref={pageRef}>
      {children}
    </div>
  );
}
