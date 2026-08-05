export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center gap-6 px-6 py-16">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          trainNerd
        </h1>
        <div className="overflow-hidden rounded-lg shadow">
          <iframe
            src="https://www.facebook.com/plugins/video.php?height=380&href=https%3A%2F%2Fwww.facebook.com%2Fwatch%2F%3Fv%3D3094440410793804&show_text=false&width=500"
            width={500}
            height={380}
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </main>
    </div>
  );
}
