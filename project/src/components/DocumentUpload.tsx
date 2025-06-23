import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Image, File, CheckCircle, Loader2 } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { UploadedDocument } from '../types';
import toast from 'react-hot-toast';

interface DocumentUploadProps {
  onDocumentsChange: (documents: UploadedDocument[]) => void;
  uploadedDocuments: UploadedDocument[];
  maxFiles?: number;
  maxSizePerFile?: number; // in MB
  acceptedTypes?: string[];
}

export default function DocumentUpload({
  onDocumentsChange,
  uploadedDocuments,
  maxFiles = 10,
  maxSizePerFile = 10,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx']
}: DocumentUploadProps) {
  const [uploading, setUploading] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentCategories = [
    'Photos of damage',
    'Police report',
    'Witness statements',
    'Repair estimates',
    'Medical records',
    'Other'
  ];

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (type === 'application/pdf') return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSizePerFile * 1024 * 1024) {
      return `File size must be less than ${maxSizePerFile}MB`;
    }
    
    const isValidType = acceptedTypes.some(type => {
      if (type.includes('*')) {
        return file.type.startsWith(type.replace('*', ''));
      }
      return file.type === type || file.name.toLowerCase().endsWith(type);
    });
    
    if (!isValidType) {
      return 'File type not supported';
    }
    
    return null;
  };

  const uploadFile = async (file: File, category: string): Promise<UploadedDocument> => {
    const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fileName = `claims/${fileId}-${file.name}`;
    const storageRef = ref(storage, fileName);
    
    setUploading(prev => [...prev, fileId]);
    
    try {
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error('Upload error:', error);
            setUploading(prev => prev.filter(id => id !== fileId));
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              const uploadedDoc: UploadedDocument = {
                id: fileId,
                name: file.name,
                type: file.type,
                size: file.size,
                url: downloadURL,
                uploadedAt: new Date(),
                category
              };
              
              setUploading(prev => prev.filter(id => id !== fileId));
              resolve(uploadedDoc);
            } catch (error) {
              setUploading(prev => prev.filter(id => id !== fileId));
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      setUploading(prev => prev.filter(id => id !== fileId));
      throw error;
    }
  };

  const handleFiles = async (files: FileList, category: string = 'Other') => {
    const fileArray = Array.from(files);
    
    if (uploadedDocuments.length + fileArray.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
    }

    if (validFiles.length === 0) return;

    try {
      const uploadPromises = validFiles.map(file => uploadFile(file, category));
      const uploadedDocs = await Promise.all(uploadPromises);
      
      const newDocuments = [...uploadedDocuments, ...uploadedDocs];
      onDocumentsChange(newDocuments);
      
      toast.success(`${uploadedDocs.length} file(s) uploaded successfully`);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed. Please try again.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeDocument = (documentId: string) => {
    const newDocuments = uploadedDocuments.filter(doc => doc.id !== documentId);
    onDocumentsChange(newDocuments);
    toast.success('Document removed');
  };

  const updateDocumentCategory = (documentId: string, category: string) => {
    const newDocuments = uploadedDocuments.map(doc =>
      doc.id === documentId ? { ...doc, category } : doc
    );
    onDocumentsChange(newDocuments);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 hover:border-slate-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          
          <div>
            <p className="text-lg font-medium text-slate-900">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-slate-600 mt-1">
              Support for images, PDFs, and documents up to {maxSizePerFile}MB each
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose Files
          </button>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-900">Uploading...</h4>
          {uploading.map(fileId => (
            <div key={fileId} className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              <span className="text-sm text-blue-700">Uploading file...</span>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Documents */}
      {uploadedDocuments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-900">
              Uploaded Documents ({uploadedDocuments.length}/{maxFiles})
            </h4>
          </div>
          
          <div className="grid gap-3">
            {uploadedDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 text-slate-500">
                    {getFileIcon(doc.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(doc.size)} • {doc.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <select
                      value={doc.category}
                      onChange={(e) => updateDocumentCategory(doc.id, e.target.value)}
                      className="text-xs border border-slate-300 rounded px-2 py-1 bg-white"
                    >
                      {documentCategories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => removeDocument(doc.id)}
                  className="ml-3 p-1 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Requirements */}
      <div className="text-xs text-slate-500 space-y-1">
        <p>• Maximum {maxFiles} files allowed</p>
        <p>• Each file must be less than {maxSizePerFile}MB</p>
        <p>• Supported formats: Images (JPG, PNG, GIF), PDF, Word documents</p>
      </div>
    </div>
  );
}