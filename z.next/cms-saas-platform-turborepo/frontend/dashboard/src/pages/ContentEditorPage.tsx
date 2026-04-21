import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentApi } from '@/lib/api';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Save,
  Globe,
  ArrowLeft,
  GripVertical,
  Plus,
  Trash2,
  Type,
  Heading1,
  ImageIcon,
  Code2,
  Quote,
  List,
  Minus,
  AlertTriangle,
  Video,
  FileIcon,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/skeleton';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

// ─── Block Types ──────────────
interface ContentBlock {
  id: string;
  type: string;
  data: Record<string, unknown>;
}

const blockTypes = [
  { type: 'paragraph', label: 'Paragraph', icon: Type },
  { type: 'heading', label: 'Heading', icon: Heading1 },
  { type: 'image', label: 'Image', icon: ImageIcon },
  { type: 'video', label: 'Video', icon: Video },
  { type: 'code', label: 'Code', icon: Code2 },
  { type: 'quote', label: 'Quote', icon: Quote },
  { type: 'list', label: 'List', icon: List },
  { type: 'divider', label: 'Divider', icon: Minus },
  { type: 'callout', label: 'Callout', icon: AlertTriangle },
  { type: 'file', label: 'File', icon: FileIcon },
];

// ─── Sortable Block ───────────
function SortableBlock({
  block,
  onUpdate,
  onDelete,
}: {
  block: ContentBlock;
  onUpdate: (id: string, data: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative flex gap-2 rounded-lg border border-border bg-card p-3"
    >
      <button
        className="mt-1 cursor-grab touch-none text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="flex-1 min-w-0">
        <BlockEditor block={block} onUpdate={onUpdate} />
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="mt-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        onClick={() => onDelete(block.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ─── Block Editor ─────────────
function BlockEditor({
  block,
  onUpdate,
}: {
  block: ContentBlock;
  onUpdate: (id: string, data: Record<string, unknown>) => void;
}) {
  const update = (key: string, value: unknown) => {
    onUpdate(block.id, { ...block.data, [key]: value });
  };

  switch (block.type) {
    case 'paragraph':
      return (
        <Textarea
          className="w-full resize-none bg-transparent border-none shadow-none focus-visible:ring-0 text-sm"
          rows={3}
          placeholder="Start writing..."
          value={(block.data.text as string) ?? ''}
          onChange={(e) => update('text', e.target.value)}
        />
      );

    case 'heading':
      return (
        <div className="space-y-2">
          <Select
            value={String((block.data.level as number) ?? 2)}
            onValueChange={(val) => update('level', Number(val))}
          >
            <SelectTrigger className="h-7 w-20 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map((n) => (
                <SelectItem key={n} value={String(n)}>H{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            className="border-none shadow-none bg-transparent text-lg font-bold focus-visible:ring-0 px-0"
            placeholder="Heading text..."
            value={(block.data.text as string) ?? ''}
            onChange={(e) => update('text', e.target.value)}
          />
        </div>
      );

    case 'image':
      return (
        <div className="space-y-2">
          <Input
            placeholder="Image URL..."
            value={(block.data.url as string) ?? ''}
            onChange={(e) => update('url', e.target.value)}
          />
          <Input
            placeholder="Alt text..."
            value={(block.data.alt as string) ?? ''}
            onChange={(e) => update('alt', e.target.value)}
          />
          {block.data.url && (
            <img
              src={block.data.url as string}
              alt={(block.data.alt as string) ?? ''}
              className="max-h-48 rounded"
            />
          )}
        </div>
      );

    case 'video':
      return (
        <Input
          placeholder="Video URL (YouTube, Vimeo, etc.)..."
          value={(block.data.url as string) ?? ''}
          onChange={(e) => update('url', e.target.value)}
        />
      );

    case 'code':
      return (
        <div className="space-y-2">
          <Input
            className="h-7 w-32 text-xs"
            placeholder="Language"
            value={(block.data.language as string) ?? ''}
            onChange={(e) => update('language', e.target.value)}
          />
          <textarea
            className="w-full resize-none rounded bg-gray-900 p-3 font-mono text-sm text-green-400 focus:outline-none"
            rows={6}
            placeholder="// Code here..."
            value={(block.data.code as string) ?? ''}
            onChange={(e) => update('code', e.target.value)}
          />
        </div>
      );

    case 'quote':
      return (
        <div className="border-l-4 border-primary pl-4 space-y-2">
          <Textarea
            className="resize-none bg-transparent border-none shadow-none focus-visible:ring-0 text-sm italic"
            rows={2}
            placeholder="Quote text..."
            value={(block.data.text as string) ?? ''}
            onChange={(e) => update('text', e.target.value)}
          />
          <Input
            className="border-none shadow-none bg-transparent focus-visible:ring-0 text-xs text-muted-foreground px-0"
            placeholder="— Attribution"
            value={(block.data.attribution as string) ?? ''}
            onChange={(e) => update('attribution', e.target.value)}
          />
        </div>
      );

    case 'list':
      return (
        <div className="space-y-2">
          <Select
            value={(block.data.style as string) ?? 'unordered'}
            onValueChange={(val) => update('style', val)}
          >
            <SelectTrigger className="h-7 w-28 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unordered">Unordered</SelectItem>
              <SelectItem value="ordered">Ordered</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            className="resize-none bg-transparent border-none shadow-none focus-visible:ring-0 text-sm"
            rows={4}
            placeholder="One item per line..."
            value={(block.data.items as string) ?? ''}
            onChange={(e) => update('items', e.target.value)}
          />
        </div>
      );

    case 'divider':
      return <hr className="border-border my-2" />;

    case 'callout':
      return (
        <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3">
          <Textarea
            className="resize-none bg-transparent border-none shadow-none focus-visible:ring-0 text-sm text-yellow-800 dark:text-yellow-200"
            rows={2}
            placeholder="Callout text..."
            value={(block.data.text as string) ?? ''}
            onChange={(e) => update('text', e.target.value)}
          />
        </div>
      );

    case 'file':
      return (
        <Input
          placeholder="File URL..."
          value={(block.data.url as string) ?? ''}
          onChange={(e) => update('url', e.target.value)}
        />
      );

    default:
      return <p className="text-sm text-muted-foreground">Unknown block type: {block.type}</p>;
  }
}

// ─── Main Editor ──────────────
export default function ContentEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = !id || id === 'new';

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [showBlockPicker, setShowBlockPicker] = useState(false);

  // Load existing content
  const { data: contentData, isLoading } = useQuery({
    queryKey: ['content', id],
    queryFn: () => contentApi.get(id!),
    enabled: !isNew,
  });

  useEffect(() => {
    if (contentData?.data) {
      setTitle(contentData.data.title);
      setSlug(contentData.data.slug);
      setBlocks(contentData.data.blocks ?? []);
    }
  }, [contentData]);

  // Save
  const saveMutation = useMutation({
    mutationFn: (data: unknown) =>
      isNew ? contentApi.create(data) : contentApi.update(id!, data),
    onSuccess: (res) => {
      toast.success(isNew ? 'Content created' : 'Content saved');
      queryClient.invalidateQueries({ queryKey: ['content'] });
      if (isNew) navigate(`/content/${res.data.id}`, { replace: true });
    },
    onError: () => toast.error('Failed to save'),
  });

  const publishMutation = useMutation({
    mutationFn: (contentId: string) => contentApi.publish(contentId),
    onSuccess: () => {
      toast.success('Content published!');
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
    onError: () => toast.error('Failed to publish'),
  });

  // DnD
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlocks((prev) => {
        const oldIndex = prev.findIndex((b) => b.id === active.id);
        const newIndex = prev.findIndex((b) => b.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const addBlock = (type: string) => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      data: {},
    };
    setBlocks((prev) => [...prev, newBlock]);
    setShowBlockPicker(false);
  };

  const updateBlock = useCallback((blockId: string, data: Record<string, unknown>) => {
    setBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, data } : b)));
  }, []);

  const deleteBlock = useCallback((blockId: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
  }, []);

  const handleSave = () => {
    saveMutation.mutate({ title, slug, blocks });
  };

  if (!isNew && isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/content')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1" />
        <Button onClick={handleSave} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save
        </Button>
        {!isNew && (
          <Button
            variant="outline"
            onClick={() => publishMutation.mutate(id!)}
            disabled={publishMutation.isPending}
            className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <Globe className="h-4 w-4" /> Publish
          </Button>
        )}
      </div>

      {/* Title & Slug */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <input
            className="w-full bg-transparent text-3xl font-bold text-foreground focus:outline-none placeholder:text-muted-foreground/40"
            placeholder="Untitled"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (isNew) {
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, ''),
                );
              }
            }}
          />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>/</span>
            <input
              className="flex-1 bg-transparent focus:outline-none text-foreground"
              placeholder="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Block Editor */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {blocks.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                onUpdate={updateBlock}
                onDelete={deleteBlock}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add block */}
      <div className="relative">
        <Button
          variant="ghost"
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-8 text-muted-foreground hover:border-primary-400 hover:text-primary-500 transition-colors"
          onClick={() => setShowBlockPicker(!showBlockPicker)}
        >
          <Plus className="h-5 w-5" /> Add Block
        </Button>
        {showBlockPicker && (
          <Card className="absolute left-1/2 -translate-x-1/2 mt-2 z-20 shadow-xl">
            <CardContent className="grid grid-cols-5 gap-2 p-4">
              {blockTypes.map((bt) => (
                <button
                  key={bt.type}
                  onClick={() => addBlock(bt.type)}
                  className="flex flex-col items-center gap-1.5 rounded-lg p-3 hover:bg-accent transition-colors"
                >
                  <bt.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{bt.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
