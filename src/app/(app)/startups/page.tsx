'use client';
import { ShowcaseHeader } from './components/showcase-header';
import { StartupsGrid } from './components/startups-grid';

export default function StartupsPage() {
  return (
    <div className="space-y-8">
      <ShowcaseHeader />
      <StartupsGrid />
    </div>
  );
}
