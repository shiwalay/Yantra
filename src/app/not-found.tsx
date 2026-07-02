import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-foreground flex flex-col items-center justify-center text-center px-6">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary glow-orb opacity-[0.05]" />
      <p className="text-[clamp(72px,14vw,140px)] font-black leading-none text-gradient-brand select-none">404</p>
      <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">Page not found</h1>
      <p className="text-sm text-muted-foreground mt-2 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className="btn-premium mt-8 px-6 py-3 rounded-full text-white font-semibold text-sm">
        Back to home
      </Link>
    </div>
  );
}
