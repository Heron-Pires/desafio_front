"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
}

// Filtro rigoroso de tipos de imagem permitidos
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];

export function ImageUpload({
  value,
  onChange,
  label = "Imagem de Capa (Thumbnail)",
  error,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [typeError, setTypeError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Valida se o arquivo possui um tipo MIME e extensão de imagem permitida.
   */
  const validateFileType = (file: File): boolean => {
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) =>
      fileName.endsWith(ext)
    );
    const hasValidMime =
      file.type.startsWith("image/") &&
      ALLOWED_MIME_TYPES.includes(file.type.toLowerCase());

    if (!hasValidMime && !hasValidExtension) {
      setTypeError(
        "Formato inválido! Selecione apenas imagens (PNG, JPG, WEBP, GIF, SVG)."
      );
      return false;
    }

    setTypeError(null);
    return true;
  };

  const processFile = (file: File) => {
    if (!validateFileType(file)) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setTypeError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300">
          {label}
        </label>
      )}

      {/* Container estilizado e responsivo controlado por Media Query CSS em globals.css */}
      <div className="image-upload-container">
        {/* Dropzone com filtro de tipo de arquivo */}
        <div
          className={`image-upload-dropzone ${
            dragActive ? "drag-active border-neutral-200" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            // Filtro de tipos de arquivo no seletor do sistema operacional
            accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml"
            className="hidden"
            onChange={handleFileChange}
          />

          <svg
            className="mx-auto h-8 w-8 text-neutral-400 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>

          <p className="text-xs font-semibold text-neutral-200">
            Arraste ou clique para enviar a imagem
          </p>
          <p className="mt-1 text-[11px] text-neutral-400">
            Filtro ativo: PNG, JPG, WEBP, GIF até 5MB
          </p>
        </div>

        {/* Pré-visualização com adaptação de tamanho via Media Query */}
        <div className="image-upload-preview-box">
          {value ? (
            <div className="relative h-full w-full">
              <Image
                src={value}
                alt="Pré-visualização da imagem"
                fill
                unoptimized
                className="object-cover"
              />
              <button
                type="button"
                onClick={handleRemove}
                title="Remover imagem"
                className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900/80 text-neutral-200 backdrop-blur transition hover:bg-red-600 hover:text-white"
              >
                &times;
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center text-neutral-500">
              <span className="text-xs font-medium">Sem imagem</span>
              <span className="text-[10px] text-neutral-600">
                Pré-visualização
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Erro de validação de tipo de arquivo */}
      {typeError && (
        <p className="text-xs text-red-400 font-medium">{typeError}</p>
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
export default ImageUpload;
