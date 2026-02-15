
import { Sandpack } from "@codesandbox/sandpack-react";

interface InteractivePreviewProps {
    code: string;
}

export default function InteractivePreview({ code }: InteractivePreviewProps) {
    return (
        <Sandpack
            template="react"
            theme="dark"
            files={{
                "/App.js": code,
            }}
            options={{
                showNavigator: true,
                showTabs: true,
                editorHeight: "80vh",  // Make it taller
                externalResources: ["https://cdn.tailwindcss.com"]
            }}
        />
    );
}
