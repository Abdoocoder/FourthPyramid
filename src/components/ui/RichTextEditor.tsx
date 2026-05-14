import { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Bold, Italic, List, ListOrdered, Link2, Link2Off, Check, X } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  dir?: "ltr" | "rtl";
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      className={`p-2.5 rounded transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center ${
        active
          ? "bg-primary/10 text-primary"
          : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
      } disabled:opacity-30`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ value, onChange, dir }: RichTextEditorProps) {
  const [linkBarOpen, setLinkBarOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const linkInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "w-full min-h-[120px] bg-surface-bright border-0 rounded-b-lg px-4 py-3 font-body-lg text-body-lg text-on-surface focus:outline-none rich-content",
        dir: dir ?? "ltr",
      },
    },
  });

  useEffect(() => {
    if (linkBarOpen && linkInputRef.current) {
      linkInputRef.current.focus();
    }
  }, [linkBarOpen]);

  const openLinkBar = () => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    setLinkUrl(prev ?? "");
    setLinkBarOpen(true);
  };

  const applyLink = () => {
    if (!editor) return;
    if (linkUrl.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl.trim() }).run();
    }
    setLinkBarOpen(false);
    setLinkUrl("");
  };

  const cancelLink = () => {
    setLinkBarOpen(false);
    setLinkUrl("");
    editor?.chain().focus().run();
  };

  if (!editor) return null;

  return (
    <div className="border border-outline-variant rounded-lg overflow-hidden focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary transition-colors">
      <div className="flex items-center gap-0.5 px-2 py-1 border-b border-outline-variant bg-surface-container-low">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          label="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          label="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </ToolbarButton>
        <span className="w-px h-4 bg-outline-variant mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          label="Bullet list"
        >
          <List className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          label="Ordered list"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolbarButton>
        <span className="w-px h-4 bg-outline-variant mx-1" />
        <ToolbarButton
          onClick={openLinkBar}
          active={editor.isActive("link")}
          label="Add link"
        >
          <Link2 className="w-3.5 h-3.5" />
        </ToolbarButton>
        {editor.isActive("link") && (
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            label="Remove link"
          >
            <Link2Off className="w-3.5 h-3.5" />
          </ToolbarButton>
        )}
      </div>
      {linkBarOpen && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-outline-variant bg-surface-container-low/60">
          <input
            ref={linkInputRef}
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); applyLink(); }
              if (e.key === "Escape") cancelLink();
            }}
            placeholder="https://..."
            aria-label="Link URL"
            className="flex-1 text-sm px-3 py-1.5 bg-surface border border-outline-variant rounded text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary min-h-[32px]"
          />
          <button
            type="button"
            onClick={applyLink}
            aria-label="Apply link"
            className="p-1.5 rounded bg-primary text-on-primary hover:opacity-90 transition-opacity"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={cancelLink}
            aria-label="Cancel"
            className="p-1.5 rounded text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
