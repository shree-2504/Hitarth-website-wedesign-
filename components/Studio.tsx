export default function Studio() {
  return (
    <section id="studio" className="bg-paper-2/90 py-24 md:py-[120px]">
      <div className="max-w-[1240px] mx-auto px-6 md:px-10">
        <div className="eyebrow reveal mb-5">About the studio</div>
        <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-10 md:gap-20 items-start">
          <p className="reveal font-display text-2xl md:text-[26px] font-medium leading-relaxed">
            At We Design, we believe every structure speaks — about the process it took to
            complete it, not just the form it takes.
          </p>
          <div>
            <p className="reveal text-lg leading-relaxed text-[#3B3934] mb-5">
              We&apos;re your partner across that whole journey: planning, designing and
              securing CRZ approvals for work that ranges from high-end residential lifestyle
              towers to sprawling commercial complexes and large industrial layouts.
            </p>
            <p className="reveal text-lg leading-relaxed text-[#3B3934]">
              Fifteen years in, that partnership is built on the same two things every client
              tells us they came back for — reliability and trust.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
