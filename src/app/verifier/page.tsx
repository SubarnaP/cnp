// src/app/verifier/page.tsx
import { notFound } from 'next/navigation';

export default function VerifierPage() {
  notFound();
  // This line is technically unreachable because notFound() throws an error
  // that Next.js catches to render the not-found UI.
  // However, to satisfy linters or type checkers that expect a return value:
  return null; 
}
