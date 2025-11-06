import { PitchHero } from './components/pitch-hero';
import { VenturesHeader } from './components/ventures-header';
import { IdeasGrid } from './components/ideas-grid';

export default function IncubatorPage() {
  return (
    <div className="space-y-8">
      <PitchHero />
      <VenturesHeader />
      <IdeasGrid />
    </div>
  );
}
