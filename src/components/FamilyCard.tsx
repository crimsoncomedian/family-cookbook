import { Heart } from 'lucide-react'
import { ChileFlag, Mountains, UsFlag } from './Flags'

export default function FamilyCard() {
  return (
    <aside className="family-card">
      <h2 className="script">Good Food Brings Us Together</h2>
      <div className="rule">
        <span />
        <Heart size={14} fill="#c8102e" color="#c8102e" aria-hidden="true" />
        <span />
      </div>
      <p>
        A family cookbook for our Chilean and American roots, our shared adventures, and all the
        delicious places in between.
      </p>
      <Mountains />
      <div className="flags">
        <span />
        <UsFlag />
        <Heart size={12} fill="#14305a" color="#14305a" aria-hidden="true" />
        <ChileFlag />
        <span />
      </div>
      <p className="tagline">Real recipes • Family • Always</p>
    </aside>
  )
}
