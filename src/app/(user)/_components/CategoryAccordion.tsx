"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
interface CategoryAccordionProps {
  onLinkClick?: () => void;
}

export function CategoryAccordion({ onLinkClick }: CategoryAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between w-full cursor-pointer hover:text-foreground hover:bg-muted p-3 rounded-md transition-colors text-left"
      >
        <span className="font-medium text-foreground">Jelajahi Kategori</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="pl-2 space-y-0.5">
          {CATEGORIES.map((category) => (
            <CategorySubSheet
              key={category.id}
              category={category}
              onLinkClick={onLinkClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CategorySubSheet({
  category,
  onLinkClick,
}: {
  category: Category;
  onLinkClick?: () => void;
}) {
  const subCats = SUB_CATEGORIES[category.id] || [];

  return (
    <Sheet>
      <SheetTrigger
        render={
          <button
            type="button"
            className="flex items-center justify-between w-full hover:text-foreground hover:bg-muted/80 p-3 rounded-md transition-colors text-left text-foreground text-sm font-normal cursor-pointer"
          >
            <span>{category.name}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </button>
        }
      />

      <SheetContent
        side={"right"}
        className="w-[300px] sm:w-[350px] p-0 flex flex-col"
      >
        <SheetHeader className="p-4 border-b border-border text-left">
          <SheetTitle className="text-base font-bold text-foreground">
            {category.name}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {/* <Link
            href={category.href}
            onClick={onLinkClick}
            className="flex items-center justify-between p-3 rounded-md font-semibold text-brand hover:bg-muted transition-colors text-sm mb-2 border-b border-border/50"
          >
            <span>Lihat Semua {category.name}</span>
            <ArrowRight className="h-4 w-4" />
          </Link> */}

          {subCats.map((subItem) => (
            <Link
              key={subItem.href}
              href={subItem.href}
              onClick={onLinkClick}
              className="block p-3 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {subItem.name}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
