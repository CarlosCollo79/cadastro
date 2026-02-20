'use client';

import { useFormStore } from '@/lib/form-store';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowLeft, ArrowRight, Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import type { DocumentType, ClientDocument } from '@/types/client';

interface Props {
    onNext: () => void;
    onBack: () => void;
}

const DOCUMENT_TYPES: { type: DocumentType; label: string }[] = [
    { type: 'rg_front', label: 'RG (Frente)' },
    { type: 'rg_back', label: 'RG (Verso)' },
    { type: 'proof_address', label: 'Comprovante de Residência' },
    { type: 'selfie', label: 'Selfie com Documento' },
    { type: 'other', label: 'Outro Documento' },
];

export function DocumentsStep({ onNext, onBack }: Props) {
    const { state, addDocument, removeDocument } = useFormStore();
    const [selectedType, setSelectedType] = useState<DocumentType>('rg_front');

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            acceptedFiles.forEach((file) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const doc: ClientDocument = {
                        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                        type: selectedType,
                        fileName: file.name,
                        fileUrl: reader.result as string,
                        uploadedAt: new Date().toISOString(),
                    };
                    addDocument(doc);
                };
                reader.readAsDataURL(file);
            });
        },
        [addDocument, selectedType]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
            'application/pdf': ['.pdf'],
        },
        maxSize: 10 * 1024 * 1024, // 10MB
    });

    const getTypeLabel = (type: DocumentType) =>
        DOCUMENT_TYPES.find((t) => t.type === type)?.label ?? type;

    return (
        <div className="space-y-6">
            {/* Type selector */}
            <div>
                <label className="form-label">Tipo de Documento</label>
                <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as DocumentType)}
                    className="form-select max-w-xs"
                >
                    {DOCUMENT_TYPES.map((dt) => (
                        <option key={dt.type} value={dt.type}>{dt.label}</option>
                    ))}
                </select>
            </div>

            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-accent bg-info-bg' : 'border-border hover:border-accent hover:bg-surface'}
        `}
            >
                <input {...getInputProps()} />
                <Upload className="mx-auto mb-3 text-text-muted" size={32} />
                {isDragActive ? (
                    <p className="text-accent font-medium">Solte o arquivo aqui...</p>
                ) : (
                    <>
                        <p className="text-text-muted font-medium">
                            Arraste e solte ou clique para selecionar
                        </p>
                        <p className="text-text-light text-sm mt-1">
                            PNG, JPG, WEBP ou PDF • Máximo 10MB
                        </p>
                    </>
                )}
            </div>

            {/* Uploaded documents */}
            {state.documents.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-text-muted">
                        Documentos enviados ({state.documents.length})
                    </h4>
                    <div className="space-y-2">
                        {state.documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center gap-3 p-3 rounded-md bg-surface border border-border"
                            >
                                {doc.fileUrl.startsWith('data:image') ? (
                                    <ImageIcon size={18} className="text-info shrink-0" />
                                ) : (
                                    <FileText size={18} className="text-danger shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{doc.fileName}</p>
                                    <p className="text-xs text-text-light">{getTypeLabel(doc.type)}</p>
                                </div>
                                {doc.fileUrl.startsWith('data:image') && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={doc.fileUrl}
                                        alt={doc.fileName}
                                        className="w-12 h-12 rounded object-cover border border-border"
                                    />
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeDocument(doc.id)}
                                    className="p-1.5 rounded-md hover:bg-danger-bg text-text-light hover:text-danger transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-between pt-4">
                <button type="button" onClick={onBack} className="btn-secondary">
                    <ArrowLeft size={16} />
                    Voltar
                </button>
                <button type="button" onClick={onNext} className="btn-primary">
                    Próximo
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}
