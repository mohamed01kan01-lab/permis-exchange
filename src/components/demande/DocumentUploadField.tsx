"use client";

import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { IconFileCheck, IconUpload, IconX } from "@tabler/icons-react";
import type { UploadedDocument } from "@/lib/validation/documents.schema";

export function DocumentUploadField({
  type,
  label,
  hint,
  required,
  value,
  onChange,
}: {
  type: UploadedDocument["type"];
  label: string;
  hint: string;
  required?: boolean;
  value?: UploadedDocument;
  onChange: (doc: UploadedDocument | undefined) => void;
}) {
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </p>
        {value ? (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-accent">
            <IconFileCheck className="size-4" aria-hidden />
            {value.fileName}
          </p>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        )}
      </div>

      {value ? (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1 self-start rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted sm:self-auto"
        >
          <IconX className="size-3.5" aria-hidden />
          Retirer
        </button>
      ) : (
        <CldUploadWidget
          uploadPreset={preset}
          options={{
            maxFiles: 1,
            sources: ["local", "camera"],
            clientAllowedFormats: ["png", "jpg", "jpeg", "pdf"],
            maxFileSize: 10_000_000,
          }}
          onSuccess={(result: CloudinaryUploadWidgetResults) => {
            const info = result.info;
            if (!info || typeof info === "string") return;
            onChange({
              type,
              publicId: info.public_id,
              url: info.secure_url,
              format: info.format,
              fileName: info.original_filename || info.public_id,
            });
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 self-start rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-secondary sm:self-auto"
            >
              <IconUpload className="size-3.5" aria-hidden />
              Téléverser
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
}
