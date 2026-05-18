import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Save, Plus, Trash2, GripVertical } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Button } from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";
import { RichTextEditor } from "../../components/ui/RichTextEditor";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Block = { id: string; type: string; content: string; level?: number };
type SavedBlock = { type: string; content: string; level?: number };

const blockTypes = [
  { value: "heading", label: "Heading" },
  { value: "text", label: "Text" },
  { value: "image", label: "Image URL" },
  { value: "list", label: "List (comma separated)" },
];

function toBlock(b: SavedBlock): Block {
  return { ...b, id: crypto.randomUUID() };
}

function toSaved(b: Block): SavedBlock {
  const { id: _id, ...rest } = b;
  return rest;
}

function SortableBlock({
  block,
  i,
  list,
  setList,
  idPrefix,
}: {
  block: Block;
  i: number;
  list: Block[];
  setList: (b: Block[]) => void;
  idPrefix: string;
}) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const isAr = idPrefix === "ar";

  const updateField = (field: keyof Block, value: string | number) => {
    const next = [...list];
    next[i] = { ...next[i], [field]: value };
    setList(next);
  };

  const remove = () => setList(list.filter((_, idx) => idx !== i));

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-2 p-3 bg-surface-container-low rounded-lg border border-outline-variant transition-opacity ${isDragging ? "opacity-40" : ""}`}
    >
      <button
        type="button"
        {...listeners}
        {...attributes}
        aria-label="Drag to reorder"
        className="p-1 mt-2.5 text-on-surface-variant hover:text-on-surface cursor-grab active:cursor-grabbing flex-shrink-0 touch-none"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="flex-1 space-y-2">
        <select
          value={block.type}
          onChange={(e) => updateField("type", e.target.value)}
          className="text-sm border border-outline-variant rounded px-2 py-1 bg-surface text-on-surface"
        >
          {blockTypes.map((bt) => <option key={bt.value} value={bt.value}>{bt.label}</option>)}
        </select>
        {block.type === "heading" && (
          <select
            value={block.level ?? 2}
            onChange={(e) => updateField("level", Number(e.target.value))}
            className="text-sm border border-outline-variant rounded px-2 py-1 bg-surface text-on-surface ml-2"
          >
            <option value={1}>H1</option>
            <option value={2}>H2</option>
            <option value={3}>H3</option>
          </select>
        )}
        {block.type === "text" ? (
          <RichTextEditor
            value={block.content}
            onChange={(html) => updateField("content", html)}
            dir={isAr ? "rtl" : "ltr"}
          />
        ) : (
          <Textarea
            label={block.type === "heading" ? `Heading (${block.level ?? 2})` : "Content"}
            id={`block-${idPrefix}-${i}`}
            value={block.content}
            onChange={(e) => updateField("content", e.target.value)}
          />
        )}
      </div>
      <button
        type="button"
        onClick={remove}
        aria-label={t("admin.removeBlock")}
        className="p-2 text-on-surface-variant hover:text-error transition-colors flex-shrink-0 mt-2 rounded-lg min-h-11"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function SortableBlockList({
  list,
  setList,
  idPrefix,
}: {
  list: Block[];
  setList: (b: Block[]) => void;
  idPrefix: string;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = list.findIndex((b) => b.id === active.id);
    const newIdx = list.findIndex((b) => b.id === over.id);
    setList(arrayMove(list, oldIdx, newIdx));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={list.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {list.map((block, i) => (
            <SortableBlock key={block.id} block={block} i={i} list={list} setList={setList} idPrefix={idPrefix} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

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
    setBlocks((page?.blocks ?? []).map(toBlock));
    setBlocksAr((page?.blocks_ar ?? []).map(toBlock));
  };

  const addBlock = (list: Block[], setList: (b: Block[]) => void) =>
    setList([...list, { id: crypto.randomUUID(), type: "text", content: "" }]);

  const handleSave = async () => {
    if (!selectedSlug) return;
    setSaving(true);
    try {
      const existing = pagesData?.find((p) => p.slug === selectedSlug);
      const saved = blocks.map(toSaved).filter((b) => b.content.trim());
      const savedAr = blocksAr.map(toSaved).filter((b) => b.content.trim());
      await upsertPage({
        id: existing?._id,
        slug: selectedSlug,
        title,
        title_ar: titleAr || undefined,
        blocks: saved,
        blocks_ar: savedAr.length > 0 ? savedAr : undefined,
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
              className={`w-full text-start px-4 py-2 rounded-lg font-body-sm text-body-sm transition-colors ${
                selectedSlug === slug ? "bg-primary text-on-primary" : "bg-surface text-on-surface hover:bg-surface-container border border-outline-variant"
              }`}
            >
              {slug.charAt(0).toUpperCase() + slug.slice(1)}
            </button>
          ))}
          {pagesData === undefined ? (
            <div className="font-body-sm text-body-sm text-on-surface-variant animate-pulse pt-4">{t("admin.loading")}</div>
          ) : pagesData.filter((p) => !["home", "about", "industries"].includes(p.slug)).map((p) => (
            <button
              key={p._id}
              onClick={() => loadPage(p.slug)}
              className={`w-full text-start px-4 py-2 rounded-lg font-body-sm text-body-sm transition-colors ${
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
                    <button onClick={() => addBlock(blocks, setBlocks)} className="text-primary hover:text-primary-fixed-dim text-sm flex items-center gap-1 min-h-11 px-2 rounded-lg hover:bg-surface-container transition-colors">
                      <Plus className="w-3 h-3" /> {t("admin.addBlock")}
                    </button>
                  </div>
                  <SortableBlockList list={blocks} setList={setBlocks} idPrefix="en" />
                </div>

                <div className="pt-4 border-t border-outline-variant">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-body-sm text-body-sm font-semibold text-on-surface">{t("admin.contentBlocks")} (AR)</p>
                    <button onClick={() => addBlock(blocksAr, setBlocksAr)} className="text-primary hover:text-primary-fixed-dim text-sm flex items-center gap-1 min-h-11 px-2 rounded-lg hover:bg-surface-container transition-colors">
                      <Plus className="w-3 h-3" /> {t("admin.addBlock")}
                    </button>
                  </div>
                  <SortableBlockList list={blocksAr} setList={setBlocksAr} idPrefix="ar" />
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
