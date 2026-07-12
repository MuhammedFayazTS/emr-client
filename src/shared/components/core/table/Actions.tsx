import React, { ReactNode } from "react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@shared/components/ui/dropdown-menu";
import { Button } from "@shared/components/ui/button";
import { EllipsisVertical, LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@shared/components/ui/tooltip";

export interface IAction {
    title: string;
    onClick: (event: React.MouseEvent) => void;
    disabled?: boolean;
    loading?: boolean;
    Icon?: LucideIcon;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

interface IActions {
    actions: IAction[];
    children?: ReactNode;
    isDropDown?: boolean;
}

export const Actions = ({ actions, children, isDropDown = false }: IActions) => {
    return (
        <>
            {
                isDropDown ?
                    (<DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                aria-label="Open menu"
                                variant="ghost"
                                className="flex size-8 p-0 data-[state=open]:bg-muted"
                            >
                                <EllipsisVertical className="size-4" aria-hidden="true" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            {actions && actions.length ? (
                                <div className='flex-gap-5 mt-1'>
                                    {actions.map(({ title, Icon, onClick, disabled }, index) => (
                                        <DropdownMenuItem
                                            key={index}
                                            disabled={disabled}
                                            onClick={onClick}
                                        >
                                            {Icon && <Icon />}
                                            {title}
                                        </DropdownMenuItem>
                                    ))}
                                </div>
                            ) : null}
                            <DropdownMenuSeparator />
                            {children}
                        </DropdownMenuContent>
                    </DropdownMenu>)
                    : (
                        <>
                            {actions && actions?.length ? (
                                <div className='flex gap-2 mt-1'>
                                    {actions.map(({ title, Icon, onClick, disabled, variant }, index) => (
                                        <TooltipProvider
                                            key={index}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant={variant ? variant : 'default'}
                                                        disabled={disabled}
                                                        onClick={onClick}
                                                    >
                                                        {Icon && <Icon />}
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{title}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ))}
                                </div>
                            ) : (
                                <></>
                            )}
                        </>
                    )
            }
        </>
    );
};
