export default function AboutPreview({ data }) {
  if (!data) return null;

  return (
    <div className="bg-[#fcfaf7] scale-[0.78] origin-top font-sans">

      {/* ===== Banner Replica (no PageBanner) ===== */}
      <div className="relative h-[260px] w-full overflow-hidden">
        <img
          src={data.banner.image}
          className="absolute inset-0 w-full h-full object-cover"
          alt=""
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
          <h1 className="text-5xl font-serif mb-3">
            {data.banner.title}
          </h1>
          <p className="text-xs uppercase tracking-[0.4em] opacity-80">
            {data.banner.breadcrumb}
          </p>
        </div>
      </div>

      {/* ===== INTRO ===== */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-16 grid grid-cols-12 gap-16">

          {/* LEFT */}
          <div className="col-span-5 space-y-8">
            <span className="text-[10px] uppercase tracking-[0.5em] text-amber-700 font-bold">
              {data.intro.tag}
            </span>

            <h2 className="text-6xl font-serif leading-[1.1]">
              {data.intro.heading1}<br/>
              <span className="italic">{data.intro.heading2}</span>
            </h2>

            <p className="text-stone-600">{data.intro.para1}</p>
            <p className="text-stone-600">{data.intro.para2}</p>

            <a
              href={data.intro.buttonLink}
              className="px-10 py-5 bg-stone-900 text-white text-xs uppercase tracking-widest inline-block"
            >
              {data.intro.buttonText}
            </a>
          </div>

          {/* RIGHT IMAGES */}
          <div className="col-span-7 grid grid-cols-12 gap-4">
            <div className="col-span-8 relative aspect-[4/5] overflow-hidden">
              <img src={data.images.main} className="w-full h-full object-cover" />
            </div>

            <div className="col-span-4 space-y-4">
              <div className="relative aspect-square overflow-hidden">
                <img src={data.images.square} className="w-full h-full object-cover" />
              </div>

              <div className="bg-amber-700 p-8 text-white">
                <h4 className="text-4xl italic">{data.experience.years}</h4>
                <p className="text-[9px] uppercase tracking-widest">
                  {data.experience.label}
                </p>
              </div>
            </div>

            <div className="col-span-10 col-start-3 relative h-48 overflow-hidden">
              <img src={data.images.wide} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== PHILOSOPHY ===== */}
      <section className="bg-stone-900 text-white py-24 text-center">
        <h3 className="text-5xl italic font-serif max-w-4xl mx-auto">
          "{data.philosophy.quote}"
        </h3>
      </section>
    </div>
  );
}
