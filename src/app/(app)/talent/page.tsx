import { TalentHeader } from './components/talent-header';
import { TalentFilters } from './components/talent-filters';
import { TalentGrid } from './components/talent-grid';
import { talentPool } from './components/data';

export default function TalentPage() {
  return (
    <div className="space-y-8">
      <TalentHeader />
      <TalentFilters />
      <TalentGrid data={talentPool} />
    </div>
  );
}
