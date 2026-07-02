export default function Home() {
  return (
    <>
      <main>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-60"
            href="https://github.com/open-meteo/typescript"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open-Meteo Repo
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-60"
            href="https://open-meteo.com/en/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open-Meteo Website
          </a>
        </div>
      </main>
    </>
  );
}
