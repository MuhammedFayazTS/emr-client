import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";

export function AppHeader() {
  const location = useLocation();

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <SidebarTrigger>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Menu className="h-5 w-5" />
          </Button>
        </SidebarTrigger>
        <Separator orientation="vertical" className="h-4" />
        <h1 className="text-lg font-medium text-foreground capitalize">
          {location.pathname.substring(1) || "Dashboard"}
        </h1>
      </div>
      <div className="flex items-center gap-4">{/* Optional header actions */}</div>
    </header>
  );
}
