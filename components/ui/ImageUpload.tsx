"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onFileChange?: (file: File | null) => void;
  label?: string;
  error?: string;
}

// Filtro rigoroso de tipos de imagem permitidos (compatível com Multer do backend)
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
  onFileChange,
  label = "Imagem de Capa (Thumbnail)",
  error,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [typeError, setTypeError] = useState<string | null>(null);
  const [failedPreviewSrc, setFailedPreviewSrc] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isBroken = Boolean(value && failedPreviewSrc === value);

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

    // Validação de tamanho máximo (5MB) alinhada ao backend
    if (file.size > 5 * 1024 * 1024) {
      setTypeError("A imagem excede o tamanho máximo permitido de 5MB.");
      return false;
    }

    setTypeError(null);
    return true;
  };

  /**
   * Redimensiona e otimiza a imagem em um canvas no cliente para garantir que
   * a string Base64 fique com segurança abaixo do limite de 100KB do Express (prevenindo erro 413 Payload Too Large).
   */
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || typeof document === "undefined") {
        resolve("");
        return;
      }

      if (file.type === "image/svg+xml") {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || "");
        reader.onerror = () => resolve("");
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const rawUrl = e.target?.result as string;
        if (!rawUrl) {
          resolve("");
          return;
        }

        const img = new window.Image();
        img.onload = () => {
          const maxDim = 500;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(rawUrl);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Compressão progressiva para garantir tamanho < 60KB (Express default: 100KB)
          let quality = 0.75;
          let dataUrl = canvas.toDataURL("image/jpeg", quality);

          while (dataUrl.length > 60 * 1024 && quality > 0.25) {
            quality -= 0.15;
            dataUrl = canvas.toDataURL("image/jpeg", quality);
          }

          resolve(dataUrl);
        };
        img.onerror = () => resolve(rawUrl);
        img.src = rawUrl;
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
  };

  const processFile = async (file: File) => {
    if (!validateFileType(file)) {
      return;
    }

    setFailedPreviewSrc(null);

    // Notifica o componente pai sobre o objeto File binário
    onFileChange?.(file);

    // Otimiza e gera o preview base64 compacto para exibição imediata e fallback resiliente (< 60KB)
    const optimized = await compressImage(file);
    if (optimized) {
      onChange(optimized);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          onChange(result);
        }
      };
      reader.readAsDataURL(file);
    }
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
    onFileChange?.(null);
    setTypeError(null);
    setFailedPreviewSrc(null);
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

      {/* Container estilizado e responsivo */}
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
              {!isBroken ? (
                <Image
                  src={value}
                  alt="Pré-visualização da imagem"
                  fill
                  unoptimized
                  onError={() => setFailedPreviewSrc(value)}
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-3 text-center bg-neutral-950 text-neutral-500">
                  <span className="text-xs font-medium text-amber-400/80">Imagem indisponível</span>
                  <span className="text-[10px] text-neutral-500 mt-1">
                    Clique no X para remover
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={handleRemove}
                title="Remover imagem"
                className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900/80 text-neutral-200 backdrop-blur transition hover:bg-red-600 hover:text-white z-10"
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

      {/* Erro de validação de tipo de arquivo ou tamanho */}
      {typeError && (
        <p className="text-xs text-red-400 font-medium">{typeError}</p>
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
export default ImageUpload;
