export default function HomeHeroEnergyTrail() {
  return (
    <div className="hero-energy-scene absolute inset-y-0 left-0 w-[48%] pointer-events-none overflow-hidden">
      <div className="hero-energy-cluster" aria-hidden="true">
        <span className="hero-energy-glow hero-energy-glow-main" />
        <span className="hero-energy-glow hero-energy-glow-soft" />
        <span className="hero-energy-streak hero-energy-streak-a" />
        <span className="hero-energy-streak hero-energy-streak-b" />
        <span className="hero-energy-streak hero-energy-streak-c" />
        <span className="hero-energy-wave hero-energy-wave-a" />
        <span className="hero-energy-wave hero-energy-wave-b" />
        <span className="hero-energy-particle hero-energy-particle-a" />
        <span className="hero-energy-particle hero-energy-particle-b" />
        <span className="hero-energy-particle hero-energy-particle-c" />
        <span className="hero-energy-particle hero-energy-particle-d" />
      </div>
    </div>
  )
}
