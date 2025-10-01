"use client";

import type React from "react";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Upload, FileText, Trash2 } from "lucide-react";
import type { ScanDocument } from "@/types/notes";

interface DocumentScannerProps {
  onSave: (docData: Omit<ScanDocument, "id" | "createdAt">) => void;
  scannedDocs: ScanDocument[];
  onDelete: (id: string) => void;
}

export function DocumentScanner({
  onSave,
  scannedDocs,
  onDelete,
}: DocumentScannerProps) {
  const [docName, setDocName] = useState("");
  const [category, setCategory] = useState<ScanDocument["category"]>("notes");
  const [scannedPages, setScannedPages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newPages: string[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPages.push(e.target.result as string);
            if (newPages.length === files.length) {
              setScannedPages([...scannedPages, ...newPages]);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleSaveDocument = () => {
    if (!docName.trim() || scannedPages.length === 0) return;

    onSave({
      name: docName.trim(),
      pages: scannedPages,
      category,
    });

    // Reset form
    setDocName("");
    setScannedPages([]);
    setCategory("notes");
  };

  const removePage = (index: number) => {
    setScannedPages(scannedPages.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Scanner Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Document Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Document Name
              </label>
              <Input
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="Enter document name..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select
                value={category}
                onValueChange={(value: ScanDocument["category"]) =>
                  setCategory(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="textbook">Textbook</SelectItem>
                  <SelectItem value="handout">Handout</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="notes">Notes</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Images
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {scannedPages.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                Scanned Pages ({scannedPages.length})
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                {scannedPages.map((page, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={page || "/placeholder.svg"}
                      alt={`Page ${index + 1}`}
                      width={96}
                      height={96}
                      className="w-full h-24 object-cover rounded border"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      onClick={() => removePage(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleSaveDocument}
            disabled={!docName.trim() || scannedPages.length === 0}
            className="w-full"
          >
            <FileText className="h-4 w-4 mr-2" />
            Save Document
          </Button>
        </CardContent>
      </Card>

      {/* Scanned Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Scanned Documents ({scannedDocs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {scannedDocs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No scanned documents yet. Upload some images to get started!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scannedDocs.map((doc) => (
                <Card
                  key={doc.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium truncate">{doc.name}</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(doc.id)}
                        className="text-destructive hover:text-destructive h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {doc.category} • {doc.pages.length} pages
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {doc.createdAt.toLocaleDateString()}
                    </p>
                    {doc.pages.length > 0 && (
                      <div className="mt-2">
                        <Image
                          src={doc.pages[0] || "/placeholder.svg"}
                          alt="Document preview"
                          width={64}
                          height={64}
                          className="w-full h-16 object-cover rounded border"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
