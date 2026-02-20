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

export function DocumentsStep({ onNext, onBack }: Props) {
    const { state, addDocument, removeDocument } = useFormStore();
    const [selectedType, setSelectedType] = useState<DocumentType>('rg_front');

    const DOCUMENT_TYPES: { type: DocumentType; label: string }[] = [
        { type: 'rg_front', label: 'Identidade (Frente)' },
        { type: 'rg_back', label: 'Identidade (Verso)' },
        { type: 'proof_address', label: 'Comprovante de Residência' },
        { type: 'selfie', label: 'Selfie com Documento' },
        { type: 'other', label: 'Outro' },
    ];

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
                    className="form-select w-full md:max-w-xs"
                >
                    <option value="" disabled>Selecione o tipo de documento</option>
                    {DOCUMENT_TYPES.map((dt) => (
                        <option key={dt.type} value={dt.type}>{dt.label}</option>
                    ))}
                </select>
            </div>

            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-accent bg-accent/5' : 'border-border hover:border-accent hover:bg-surface-alt'}
        `}
            >
                <input {...getInputProps()} />
                <Upload className="mx-auto mb-3 text-text-muted" size={32} />
                {isDragActive ? (
                    <p className="text-accent font-medium">Solte os arquivos aqui...</p>
                ) : (
                    <>
                        <p className="text-text-muted font-medium">
                            Clique para selecionar ou solte os arquivos aqui
                        </p>
                        <p className="text-text-light text-sm mt-1">
                            PNG, JPG ou PDF (Máx. 10MB)
                        </p>
                    </>
                )}
            </div>

            {/* Uploaded documents */}
            {state.documents.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-text-muted">
                        Documentos Enviados ({state.documents.length})
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                        {state.documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border overflow-hidden"
                            >
                                {doc.fileUrl.startsWith('data:image') ? (
                                    <ImageIcon size={18} className="text-info shrink-0 hidden xs:block" />
                                ) : (
                                    <FileText size={18} className="text-danger shrink-0 hidden xs:block" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate text-text">{doc.fileName}</p>
                                    <p className="text-[10px] text-text-light uppercase tracking-wider font-bold">{getTypeLabel(doc.type)}</p>
                                </div>
                                {doc.fileUrl.startsWith('data:image') && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={doc.fileUrl}
                                        alt={doc.fileName}
                                        className="w-10 h-10 rounded-lg object-cover border border-border shrink-0"
                                    />
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeDocument(doc.id)}
                                    className="p-2 rounded-lg hover:bg-danger-bg text-text-light hover:text-danger transition-colors shrink-0"
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
                    Próximo Passo
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}
