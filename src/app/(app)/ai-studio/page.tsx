import { StudioHeader } from './components/studio-header';
import { StartupDescriptionTool } from './components/startup-description-tool';

export default function AiStudioPage() {
  return (
    <div className="space-y-8">
        <StudioHeader />
        <StartupDescriptionTool />
    </div>
  );
}
