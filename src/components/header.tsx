import { Map } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <Map className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-headline font-bold text-foreground">
          PlotSage
        </h1>
      </div>
      <div>
        {/* Placeholder for user authentication button */}
      </div>
    </header>
  );
}
