export default function Player({ state = 'idle' }) {
  return (
    <div className={`pixel-stickman pixel-${state}`} aria-label={`player-${state}`}>
      <div className="stick-helmet">
        <span className="helmet-icon">☢</span>
      </div>
      <div className="stick-head" />
      <div className="stick-body" />
      <div className="stick-arm stick-arm-left" />
      <div className="stick-arm stick-arm-right" />
      <div className="stick-leg stick-leg-left" />
      <div className="stick-leg stick-leg-right" />
    </div>
  )
}
