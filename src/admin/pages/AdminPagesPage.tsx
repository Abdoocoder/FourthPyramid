import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Save, Plus, Trash2, GripVertical } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Button } from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";

type Block = { type: string; content: string; level?: number };

const blockTypes = [
  { value: "heading", label: "Heading" },
  { value: "text", label: "Text" },
  { value: "image", label: "Image URL" },
  { value: "list", label: "List (comma separated)" },
];

export function AdminPagesPage() {
  const { t } = useTranslation();
  const pagesData = useQuery(api.pages.list);
  const upsertPage = useMutation(api.pages.upsert);

  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [title, setTitle] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [blocksAr, setBlocksAr] = useState<Block[]>([]);
  const [saving, setSaving] = useState(false);

  const loadPage = (slug: string) => {
    setSelectedSlug(slug);
    const page = pagesData?.find((p) => p.slug === slug);
    setTitle(page?.title ?? "");
    setTitleAr(page?.title_ar ?? "");
    setBlocks(page?.blocks ?? []);
    setBlocksAr(page?.blocks_ar ?? []);
  };

  const addBlock = (list: Block[], setList: (b: Block[]) => void) =>
    setList([...list, { type: "text", content: "" }]);

  const updateBlock = (list: Block[], setList: (b: Block[]) => void, idx: number, field: keyof Block, value: string | number) => {
    const next = [...list];
    next[idx] = { ...next[idx], [field]: value };
    setList(next);
  };

  const removeBlock = (list: Block[], setList: (b: Block[]) => void, idx: number) =>
    setList(list.filter((_, i) => i !== idx));

  const handleSave = async () => {
    if (!selectedSlug) return;
    setSaving(true);
    try {
      const existing = pagesData?.find((p) => p.slug === selectedSlug);
      await upsertPage({
        id: existing?._id,
        slug: selectedSlug,
        title,
        title_ar: titleAr || undefined,
        blocks: blocks.filter((b) => b.content.trim()),
        blocks_ar: blocksAr.filter((b) => b.content.trim()).length > 0 ? blocksAr.filter((b) => b.content.trim()) : undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline-md text-headline-md text-on-surface">{t("admin.pages")}</h1>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4" /> {t("admin.savePage")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <div className="md:col-span-3 space-y-2">
          <p className="font-data-mono text-data-mono text-on-surface-variant uppercase tracking-wider mb-2">{t("admin.selectPage")}</p>
          {["home", "about", "industries"].map((slug) => (
            <button
              key={slug}
              onClick={() => loadPage(slug)}
              className={`w-full text-left px-4 py-2 rounded-lg font-body-sm text-body-sm transition-colors ${
                selectedSlug === slug ? "bg-primary text-on-primary" : "bg-surface text-on-surface hover:bg-surface-container border border-outline-variant"
              }`}
            >
              {slug.charAt(0).toUpperCase() + slug.slice(1)}
            </button>
          ))}
          {pagesData && pagesData.filter((p) => !["home", "about", "industries"].includes(p.slug)).map((p) => (
            <button
              key={p._id}
              onClick={() => loadPage(p.slug)}
              className={`w-full text-left px-4 py-2 rounded-lg font-body-sm text-body-sm transition-colors ${
                selectedSlug === p.slug ? "bg-primary text-on-primary" : "bg-surface text-on-surface hover:bg-surface-container border border-outline-variant"
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>

        <div className="md:col-span-9 space-y-6">
          {selectedSlug ? (
            <>
              <div className="bg-surface border border-outline-variant rounded-xl p-6 space-y-4">
                <h2 className="font-headline-md text-headline-md text-on-surface pb-2 border-b border-outline-variant">{t("admin.pageContent")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Title (EN)" id="page-title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  <Input label="Title (AR)" id="page-title-ar" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-body-sm text-body-sm font-semibold text-on-surface">{t("admin.contentBlocks")} (EN)</p>
                    <button onClick={() => addBlock(blocks, setBlocks)} className="text-primary hover:text-primary-fixed-dim text-sm flex items-center gap-1">
                      <Plus className="w-3 h-3" /> {t("admin.addBlock")}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {blocks.map((block, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-surface-container-low rounded-lg border border-outline-variant">
                        <GripVertical className="w-4 h-4 mt-3 text-on-surface-variant flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <select value={block.type} onChange={(e) => updateBlock(blocks, setBlocks, i, "type", e.target.value)} className="text-sm border border-outline-variant rounded px-2 py-1 bg-surface text-on-surface">
                            {blockTypes.map((bt) => <option key={bt.value} value={bt.value}>{bt.label}</option>)}
                          </select>
                          {block.type === "heading" && (
                            <select value={block.level ?? 2} onChange={(e) => updateBlock(blocks, setBlocks, i, "level", Number(e.target.value))} className="text-sm border border-outline-variant rounded px-2 py-1 bg-surface text-on-surface ml-2">
                              <option value={1}>H1</option>
                              <option value={2}>H2</option>
                              <option value={3}>H3</option>
                            </select>
                          )}
                          <Textarea label="" id={`block-${i}`} value={block.content} onChange={(e) => updateBlock(blocks, setBlocks, i, "content", e.target.value)} />
                        </div>
                        <button onClick={() => removeBlock(blocks, setBlocks, i)} className="p-1 text-on-surface-variant hover:text-error transition-colors flex-shrink-0 mt-2">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-body-sm text-body-sm font-semibold text-on-surface">{t("admin.contentBlocks")} (AR)</p>
                    <button onClick={() => addBlock(blocksAr, setBlocksAr)} className="text-primary hover:text-primary-fixed-dim text-sm flex items-center gap-1">
                      <Plus className="w-3 h-3" /> {t("admin.addBlock")}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {blocksAr.map((block, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-surface-container-low rounded-lg border border-outline-variant">
                        <GripVertical className="w-4 h-4 mt-3 text-on-surface-variant flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <select value={block.type} onChange={(e) => updateBlock(blocksAr, setBlocksAr, i, "type", e.target.value)} className="text-sm border border-outline-variant rounded px-2 py-1 bg-surface text-on-surface">
                            {blockTypes.map((bt) => <option key={bt.value} value={bt.value}>{bt.label}</option>)}
                          </select>
                          {block.type === "heading" && (
                            <select value={block.level ?? 2} onChange={(e) => updateBlock(blocksAr, setBlocksAr, i, "level", Number(e.target.value))} className="text-sm border border-outline-variant rounded px-2 py-1 bg-surface text-on-surface ml-2">
                              <option value={1}>H1</option>
                              <option value={2}>H2</option>
                              <option value={3}>H3</option>
                            </select>
                          )}
                          <Textarea label="" id={`block-ar-${i}`} value={block.content} onChange={(e) => updateBlock(blocksAr, setBlocksAr, i, "content", e.target.value)} />
                        </div>
                        <button onClick={() => removeBlock(blocksAr, setBlocksAr, i)} className="p-1 text-on-surface-variant hover:text-error transition-colors flex-shrink-0 mt-2">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-surface border border-outline-variant rounded-xl p-12 text-center">
              <p className="font-body-lg text-body-lg text-on-surface-variant">{t("admin.selectPageHint")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
