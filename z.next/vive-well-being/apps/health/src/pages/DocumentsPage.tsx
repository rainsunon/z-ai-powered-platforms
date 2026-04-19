import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  Download,
  FileText,
  Plus,
  Pencil,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileDown,
  FileBarChart,
  Filter,
} from "lucide-react";
import { cn, formatDate, formatFileSize } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { documentApi } from "../api";
import type { HealthDocument, PaginatedResponse } from "../types";

const DOC_TYPE_COLORS: Record<string, string> = {
  LAB_RESULT: "bg-blue-100 text-blue-700",
  PRESCRIPTION: "bg-emerald-100 text-emerald-700",
  IMAGING: "bg-violet-100 text-violet-700",
  VISIT_SUMMARY: "bg-orange-100 text-orange-700",
  REFERRAL: "bg-pink-100 text-pink-700",
  VACCINATION: "bg-cyan-100 text-cyan-700",
  OTHER: "bg-gray-100 text-gray-700",
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<HealthDocument[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [viewDoc, setViewDoc] = useState<HealthDocument | null>(null);
  const [editDoc, setEditDoc] = useState<HealthDocument | null>(null);
  const [showNewDoc, setShowNewDoc] = useState(false);

  const totalPages = Math.ceil(total / limit);

  const fetchDocs = async (p = page, s = search, ft = filterType) => {
    setIsLoading(true);
    try {
      const params: Record<string, unknown> = { page: p, limit };
      if (s) params.search = s;
      if (ft) params.documentType = ft;
      const result = await documentApi.list(params);
      setDocuments(result.items);
      setTotal(result.total);
      setPage(result.page);
    } catch {} finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleSearch = () => {
    setPage(1);
    fetchDocs(1, search, filterType);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchDocs(newPage);
  };

  const handleDelete = async (id: string) => {
    await documentApi.delete(id);
    fetchDocs();
  };

  const handleExportAll = async () => {
    const blob = await documentApi.exportAll();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "health-documents-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportReport = async () => {
    const blob = await documentApi.exportReport();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "health-report.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownload = (doc: HealthDocument) => {
    const a = document.createElement("a");
    a.href = doc.filePath;
    a.download = doc.fileName;
    a.click();
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-primary font-semibold tracking-widest text-xs uppercase mb-1">Records</p>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Documents</h1>
          <p className="text-sm text-muted-foreground mt-1">All your health files in one place</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setShowNewDoc(true)} size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" /> New Document
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExportAll}>
            <FileDown className="w-4 h-4" /> Export All
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExportReport}>
            <FileBarChart className="w-4 h-4" /> Health Report
          </Button>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <select
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); setPage(1); fetchDocs(1, search, e.target.value); }}
        >
          <option value="">All Types</option>
          {["LAB_RESULT", "PRESCRIPTION", "IMAGING", "VISIT_SUMMARY", "REFERRAL", "VACCINATION", "OTHER"].map((t) => (
            <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
          ))}
        </select>
        <Button variant="outline" size="sm" onClick={handleSearch}>
          <Filter className="w-4 h-4 mr-1" /> Filter
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider">Document</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider">Type</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider">Provider</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider">Date</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider">Size</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div>
                          <span className="font-semibold">{doc.title}</span>
                          {doc.description && (
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{doc.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", DOC_TYPE_COLORS[doc.documentType] || DOC_TYPE_COLORS.OTHER)}>
                        {doc.documentType.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{doc.providerName || "—"}</td>
                    <td className="py-3 px-4">{doc.issuedDate ? formatDate(doc.issuedDate) : "—"}</td>
                    <td className="py-3 px-4 text-muted-foreground">{doc.fileSizeBytes ? formatFileSize(doc.fileSizeBytes) : "—"}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setViewDoc(doc)}><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDownload(doc)}><Download className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => setEditDoc(doc)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(doc.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {documents.length === 0 && (
                  <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">No documents found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <span className="text-xs text-muted-foreground">
              Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total}
            </span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = page <= 3 ? i + 1 : page + i - 2;
                if (p < 1 || p > totalPages) return null;
                return (
                  <Button key={p} variant={p === page ? "default" : "outline"} size="sm" onClick={() => handlePageChange(p)} className="w-8">
                    {p}
                  </Button>
                );
              })}
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!viewDoc} onOpenChange={(open) => { if (!open) setViewDoc(null); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewDoc?.title}</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {viewDoc && (
            <div className="space-y-2 text-sm">
              {Object.entries(viewDoc).map(([key, value]) => {
                if (value === null || value === undefined || key === "id" || key === "userId") return null;
                return (
                  <div key={key} className="flex justify-between border-b py-1.5">
                    <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <span className="font-medium text-right max-w-[60%] truncate">
                      {Array.isArray(value) ? value.join(", ") : String(value)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editDoc || showNewDoc} onOpenChange={(open) => { if (!open) { setEditDoc(null); setShowNewDoc(false); } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editDoc ? "Edit Document" : "New Document"}</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <DocumentForm
            initial={editDoc}
            onSubmit={async (data) => {
              if (editDoc) {
                await documentApi.update(editDoc.id, data);
              } else {
                await documentApi.create(data);
              }
              setEditDoc(null);
              setShowNewDoc(false);
              fetchDocs();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DocumentForm({
  initial,
  onSubmit,
}: {
  initial?: HealthDocument | null;
  onSubmit: (data: any) => void;
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [documentType, setDocumentType] = useState(initial?.documentType || "OTHER");
  const [description, setDescription] = useState(initial?.description || "");
  const [providerName, setProviderName] = useState(initial?.providerName || "");
  const [issuedDate, setIssuedDate] = useState(initial?.issuedDate || "");

  return (
    <div className="space-y-3">
      <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <select className="w-full border rounded-lg px-3 py-2 text-sm" value={documentType} onChange={(e) => setDocumentType(e.target.value as any)}>
        {["LAB_RESULT", "PRESCRIPTION", "IMAGING", "VISIT_SUMMARY", "REFERRAL", "VACCINATION", "OTHER"].map((t) => (
          <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
        ))}
      </select>
      <textarea className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Provider Name" value={providerName} onChange={(e) => setProviderName(e.target.value)} />
      <input className="w-full border rounded-lg px-3 py-2 text-sm" type="date" value={issuedDate} onChange={(e) => setIssuedDate(e.target.value)} />
      <DialogFooter>
        <Button onClick={() => onSubmit({ title, documentType, description, providerName, issuedDate: issuedDate || null, fileName: initial?.fileName || "document.pdf", filePath: initial?.filePath || "/uploads/document.pdf" })} disabled={!title}>
          {initial ? "Update" : "Create"}
        </Button>
      </DialogFooter>
    </div>
  );
}
