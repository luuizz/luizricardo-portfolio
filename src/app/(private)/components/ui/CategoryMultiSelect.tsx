"use client";

import { useState, useRef, useEffect } from "react";
import { Category } from "@/types/dashboard";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryMultiSelectProps {
  categories: Category[];
  selected: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function CategoryMultiSelect({
  categories,
  selected,
  onChange,
  placeholder = "Selecionar categorias",
  className,
}: CategoryMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  function remove(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    onChange(selected.filter((s) => s !== id));
  }

  const selectedItems = categories.filter((c) => selected.includes(c.id));

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex min-h-9 w-full items-center gap-1.5 rounded-md border bg-background px-3 py-2 text-sm transition-colors hover:bg-accent/50",
          open && "ring-1 ring-ring",
        )}
      >
        {selectedItems.length === 0 ? (
          <span className="flex-1 text-left text-muted-foreground">{placeholder}</span>
        ) : (
          <div className="flex flex-1 flex-wrap gap-1">
            {selectedItems.map((cat) => (
              <Badge
                key={cat.id}
                variant="secondary"
                className="gap-1 pr-1 text-xs"
              >
                {cat.name}
                <button
                  type="button"
                  onClick={(e) => remove(cat.id, e)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <ChevronDown
          className={cn(
            "ml-auto h-4 w-4 shrink-0 opacity-50 transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-md border bg-popover shadow-md animate-in fade-in-0 slide-in-from-top-2 duration-150">
          {categories.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground">Nenhuma categoria disponível.</p>
          ) : (
            categories.map((cat) => {
              const isSelected = selected.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggle(cat.id)}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-accent"
                >
                  <div
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                      isSelected
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-input",
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                  <span>{cat.name}</span>
                  <span className="ml-auto font-mono text-xs text-muted-foreground">
                    {cat.slug}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
