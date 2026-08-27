// src/components/ui/markdown-textarea.tsx
"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Quote,
  Eye,
  PenSquare,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MarkdownTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: string;
}

export function MarkdownTextarea({
  value,
  onChange,
  placeholder,
  disabled,
  minHeight = "min-h-48",
}: MarkdownTextareaProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Helper untuk menyisipkan sintaks Markdown pada kursor atau teks terpilih
  const insertSyntax = (
    prefix: string,
    suffix: string = "",
    defaultText: string = "",
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newValue =
      value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    // Kembalikan fokus kursor ke area setelah karakter pembuka
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length,
      );
    }, 0);
  };

  return (
    <div className="rounded-xl border border-border/80 bg-background overflow-hidden focus-within:border-primary/60 transition-all">
      {/* TOOLBAR HEADER */}
      <div className="flex flex-wrap items-center justify-between border-b border-border/60 bg-muted/40 p-1.5 gap-1">
        {/* Switch Mode: Write vs Preview */}
        <div className="flex items-center gap-1 bg-background/80 p-0.5 rounded-lg border border-border/50">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("write")}
            className={cn(
              "h-7 px-2.5 text-xs font-bold gap-1 rounded-md cursor-pointer transition-all",
              activeTab === "write"
                ? "bg-muted text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <PenSquare className="h-3.5 w-3.5" />
            <span>Write</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("preview")}
            className={cn(
              "h-7 px-2.5 text-xs font-bold gap-1 rounded-md cursor-pointer transition-all",
              activeTab === "preview"
                ? "bg-muted text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Preview</span>
          </Button>
        </div>

        {/* Quick Syntax Actions (Hanya muncul saat mode Write) */}
        {activeTab === "write" && (
          <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar py-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Cetak Tebal (**teks**)"
              disabled={disabled}
              onClick={() => insertSyntax("**", "**", "teks tebal")}
              className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
            >
              <Bold className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Cetak Miring (*teks*)"
              disabled={disabled}
              onClick={() => insertSyntax("*", "*", "teks miring")}
              className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
            >
              <Italic className="h-3.5 w-3.5" />
            </Button>

            <div className="h-3.5 w-px bg-border/80 mx-1 shrink-0" />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Sub-Judul ( Heading )"
              disabled={disabled}
              onClick={() => insertSyntax("**", "**\n", "Judul Bagian")}
              className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
            >
              <Heading2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Bullet List (* Poin)"
              disabled={disabled}
              onClick={() => insertSyntax("\n* ", "", "Poin item")}
              className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
            >
              <List className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Numbered List (1. Poin)"
              disabled={disabled}
              onClick={() => insertSyntax("\n1. ", "", "Poin berurutan")}
              className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
            >
              <ListOrdered className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Kutipan (> Teks)"
              disabled={disabled}
              onClick={() => insertSyntax("\n> ", "", "Kutipan penting")}
              className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
            >
              <Quote className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* CONTENT AREA */}
      <div className="p-1">
        {activeTab === "write" ? (
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "border-0 shadow-none focus-visible:ring-0 text-xs font-mono resize-y p-3 leading-relaxed",
              minHeight,
            )}
          />
        ) : (
          <div
            className={cn(
              "p-3.5 prose prose-slate dark:prose-invert max-w-none text-xs leading-relaxed prose-p:my-2 prose-strong:text-foreground prose-strong:font-bold prose-ul:my-2 prose-ul:list-disc prose-ul:pl-4 prose-li:my-0.5 overflow-y-auto bg-card/20 rounded-lg",
              minHeight,
            )}
          >
            {value.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground/60 italic text-xs">
                Belum ada konten untuk ditampilkan.
              </p>
            )}
          </div>
        )}
      </div>

      {/* FOOTER TIPS */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/20 border-t border-border/40 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <HelpCircle className="h-3 w-3 text-primary/70" />
          Mendukung format Markdown (**bold**, *bullet list*, dsb)
        </span>
      </div>
    </div>
  );
}
