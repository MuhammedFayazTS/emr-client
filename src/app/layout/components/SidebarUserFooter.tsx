import { LogOut, User as UserIcon } from "lucide-react"
import { SidebarFooter } from "@/shared/components/ui/sidebar"
import { Button } from "@/shared/components/ui/button"
import type { User } from "@/features/auth/types/auth.types"

interface SidebarUserFooterProps {
    user: User | undefined;
    onLogout: () => void;
}

export function SidebarUserFooter({ user, onLogout }: SidebarUserFooterProps) {
    return (
        <SidebarFooter className="p-4 border-t border-border mt-auto">
            {user && (
                <div className="flex items-center gap-3 px-2 py-3 rounded-lg bg-muted/40 mb-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <UserIcon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-foreground truncate">
                            {user.name}
                        </span>
                        <span className="text-xs text-muted-foreground truncate capitalize">
                            {user.role}
                        </span>
                    </div>
                </div>
            )}
            <Button
                variant="ghost"
                onClick={onLogout}
                className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-3"
            >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
            </Button>
        </SidebarFooter>
    );
}