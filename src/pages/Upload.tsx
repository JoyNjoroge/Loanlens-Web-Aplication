import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, FileText, AlertCircle, CheckCircle, Loader2, Camera, Scan } from "lucide-react";
import { cn } from "@/lib/utils";

// Complete translations
const translations = {
  en: {
    dragDrop: "Drag & drop your file here",
    or: "or",
    browse: "Browse files",
    supported: "PDF, JPG, PNG up to 10MB",
    analyzing: "Analyzing document...",
    uploadAnother: "Upload another file",
    remove: "Remove",
    maxSizeError: "File size exceeds 10MB limit",
    invalidTypeError: "Invalid file type. Please upload PDF, JPG, or PNG",
    uploadError: "Failed to upload file. Please try again.",
    success: "File uploaded successfully!",
    selectModel: "Select Model",
    modelGeneral: "General Document",
    modelReceipt: "Receipt Scanner",
    modelId: "ID Document",
    scanDocument: "Scan Document",
    startScan: "Start Camera",
    stopScan: "Stop Camera",
    capture: "Capture Image",
    scanning: "Ready to scan...",
    noCamera: "Camera not accessible. Please check permissions.",
    uploadTitle: "Document Upload",
  },
  sw: {
    dragDrop: "Burudisha faili yako hapa",
    or: "au",
    browse: "Chagua faili",
    supported: "PDF, JPG, PNG hadi 10MB",
    analyzing: "Inachambua hati...",
    uploadAnother: "Pakia faili nyingine",
    remove: "Ondoa",
    maxSizeError: "Ukubwa wa faili unazidi kikomo cha 10MB",
    invalidTypeError: "Aina ya faili batili. Tafadhali pakia PDF, JPG, au PNG",
    uploadError: "Imeshindwa kupakia faili. Tafadhali jaribu tena.",
    success: "Faili imepakiwa kwa mafanikio!",
    selectModel: "Chagua Modeli",
    modelGeneral: "Hati ya Jumla",
    modelReceipt: "Skana ya Risiti",
    modelId: "Hati ya Kitambulisho",
    scanDocument: "Skana Hati",
    startScan: "Washa Kamera",
    stopScan: "Zima Kamera",
    capture: "Chukua Picha",
    scanning: "Tayari kuskana...",
    noCamera: "Kamera haipatikani. Tafadhali angalia ruhusa.",
    uploadTitle: "Upakiaji wa Hati",
  },
  fr: {
    dragDrop: "Glissez et déposez votre fichier ici",
    or: "ou",
    browse: "Parcourir les fichiers",
    supported: "PDF, JPG, PNG jusqu'à 10 Mo",
    analyzing: "Analyse du document...",
    uploadAnother: "Télécharger un autre fichier",
    remove: "Supprimer",
    maxSizeError: "La taille du fichier dépasse la limite de 10 Mo",
    invalidTypeError: "Type de fichier invalide. Veuillez télécharger PDF, JPG ou PNG",
    uploadError: "Échec du téléchargement du fichier. Veuillez réessayer.",
    success: "Fichier téléchargé avec succès !",
    selectModel: "Sélectionner le modèle",
    modelGeneral: "Document général",
    modelReceipt: "Scanner de reçus",
    modelId: "Document d'identité",
    scanDocument: "Scanner un document",
    startScan: "Démarrer la caméra",
    stopScan: "Arrêter la caméra",
    capture: "Capturer l'image",
    scanning: "Prêt à scanner...",
    noCamera: "Caméra non accessible. Veuillez vérifier les autorisations.",
    uploadTitle: "Téléchargement de document",
  },
  es: {
    dragDrop: "Arrastra y suelta tu archivo aquí",
    or: "o",
    browse: "Explorar archivos",
    supported: "PDF, JPG, PNG hasta 10 MB",
    analyzing: "Analizando documento...",
    uploadAnother: "Subir otro archivo",
    remove: "Eliminar",
    maxSizeError: "El tamaño del archivo excede el límite de 10 MB",
    invalidTypeError: "Tipo de archivo no válido. Por favor, sube PDF, JPG o PNG",
    uploadError: "Error al subir el archivo. Por favor, inténtalo de nuevo.",
    success: "¡Archivo subido con éxito!",
    selectModel: "Seleccionar modelo",
    modelGeneral: "Documento general",
    modelReceipt: "Escáner de recibos",
    modelId: "Documento de identidad",
    scanDocument: "Escanear documento",
    startScan: "Iniciar cámara",
    stopScan: "Detener cámara",
    capture: "Capturar imagen",
    scanning: "Listo para escanear...",
    noCamera: "Cámara no accesible. Por favor, verifica los permisos.",
    uploadTitle: "Carga de documento",
  }
};

type Language = 'en' | 'sw' | 'fr' | 'es';
type ProcessingModel = 'general' | 'receipt' | 'id';

const Upload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ProcessingModel>('general');
  const [scanMode, setScanMode] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [scanningError, setScanningError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const language = 'en'; // You can make this dynamic later
  const t = translations[language];

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Handle file selection and processing
  const handleFileSelect = useCallback(async (selectedFile: File, model: ProcessingModel) => {
    setIsProcessing(true);
    
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store file info in localStorage or context for results page
      const fileData = {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        model: model,
        uploadedAt: new Date().toISOString()
      };
      
      localStorage.setItem('uploadedFile', JSON.stringify(fileData));
      
      // Navigate to results page
      navigate('/results');
    } catch (err) {
      console.error('File processing error:', err);
      setError(t.uploadError);
    } finally {
      setIsProcessing(false);
    }
  }, [navigate, t]);

  // Handle file validation
  const validateAndSetFile = useCallback((file: File) => {
    setError(null);
    
    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError(t.maxSizeError);
      return;
    }

    // Check file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const fileExtension = file.name.toLowerCase().split('.').pop();
    const isValidType = validTypes.includes(file.type) || 
                       ['pdf', 'jpg', 'jpeg', 'png'].includes(fileExtension || '');
    
    if (!isValidType) {
      setError(t.invalidTypeError);
      return;
    }

    setFile(file);
    setCapturedImage(null);
    handleFileSelect(file, selectedModel);
  }, [handleFileSelect, selectedModel, t]);

  // Drag and drop handlers
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  }, [validateAndSetFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  }, [validateAndSetFile]);

  // Camera handlers
  const startCamera = useCallback(async () => {
    setScanningError(null);
    setScanMode(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setCameraStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera error:", err);
      setScanningError(t.noCamera);
      setScanMode(false);
    }
  }, [t]);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => {
        track.stop();
      });
      setCameraStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setScanMode(false);
    setScanningError(null);
  }, [cameraStream]);

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      console.error("Failed to get canvas context");
      return;
    }

    // Set canvas to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Create image blob
    canvas.toBlob((blob) => {
      if (blob) {
        const capturedFile = new File([blob], `scanned-document-${Date.now()}.jpg`, { 
          type: 'image/jpeg' 
        });
        
        // Create preview URL
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);
        
        // Set and validate the file
        validateAndSetFile(capturedFile);
        
        // Stop camera after capture
        stopCamera();
      }
    }, 'image/jpeg', 0.9);
  }, [validateAndSetFile, stopCamera]);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setError(null);
    setCapturedImage(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (scanMode) {
      stopCamera();
    }
  }, [scanMode, stopCamera]);

  const handleModelChange = useCallback((value: string) => {
    const newModel = value as ProcessingModel;
    setSelectedModel(newModel);
    
    // If a file is already selected, re-process it with the new model
    if (file) {
      handleFileSelect(file, newModel);
    }
  }, [file, handleFileSelect]);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }, []);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={cn("space-y-6")}>
      {/* Header with model selection */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Scan className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-lg">{t.uploadTitle}</h3>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none">
            <Select value={selectedModel} onValueChange={handleModelChange} disabled={isProcessing}>
              <SelectItem value="general">{t.modelGeneral}</SelectItem>
              <SelectItem value="receipt">{t.modelReceipt}</SelectItem>
              <SelectItem value="id">{t.modelId}</SelectItem>
            </Select>
          </div>

          <Button
            type="button"
            variant={scanMode ? "destructive" : "outline"}
            size="lg"
            className="gap-2"
            onClick={scanMode ? stopCamera : startCamera}
            disabled={isProcessing}
          >
            {scanMode ? <X className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
            {scanMode ? t.stopScan : t.scanDocument}
          </Button>
        </div>
      </div>

      {/* Scanner Preview Area */}
      {scanMode && (
        <div className="border border-gray-200 rounded-2xl p-6 space-y-4 bg-gray-50">
          <p className="text-sm font-medium flex items-center gap-2">
            <Camera className="w-4 h-4" />
            {t.scanning}
          </p>
          
          <div className="relative rounded-lg overflow-hidden bg-black/5 min-h-[300px] flex items-center justify-center">
            {scanningError ? (
              <div className="text-center p-8">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 font-medium">{scanningError}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Make sure you're on HTTPS or localhost and have granted camera permissions.
                </p>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-auto max-h-[500px] rounded-lg"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Capture button */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                  <Button
                    onClick={captureImage}
                    size="lg"
                    className="rounded-full h-16 w-16 bg-white border-2 border-blue-500 shadow-lg hover:bg-blue-50"
                  >
                    <Camera className="w-6 h-6 text-blue-600" />
                  </Button>
                </div>
              </>
            )}
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Position your document within the frame and press the camera button to capture.
          </p>
        </div>
      )}

      {/* Upload Area (shown when not in scan mode and no file) */}
      {!file && !scanMode && (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-2xl p-8 md:p-12 transition-all duration-200",
            dragOver
              ? "border-blue-500 bg-blue-50 scale-[1.02]"
              : "border-gray-300 hover:border-blue-300 hover:bg-blue-50/50",
            error && "border-red-300 bg-red-50"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4 md:mb-6">
              <Upload size={32} className="text-blue-600" />
            </div>
            
            <p className="text-lg font-medium text-gray-900 mb-2">
              {t.dragDrop}
            </p>
            
            <p className="text-gray-600 mb-4 md:mb-6">
              {t.supported}
            </p>

            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="h-px w-8 bg-gray-300" />
              <span className="text-sm text-gray-500">{t.or}</span>
              <div className="h-px w-8 bg-gray-300" />
            </div>

            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileInput}
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                disabled={isProcessing}
              />
              
              <Button
                onClick={triggerFileInput}
                variant="outline"
                size="lg"
                className="gap-2"
                disabled={isProcessing}
              >
                <Upload className="w-4 h-4" />
                {t.browse}
              </Button>
              
              {capturedImage && (
                <div className="mt-4">
                  <img 
                    src={capturedImage} 
                    alt="Captured document" 
                    className="max-w-xs mx-auto rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="mt-6 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* File Preview (shown when file is selected) */}
      {file && (
        <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 truncate max-w-xs">{file.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-gray-600">
                    {formatFileSize(file.size)}
                  </p>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    {selectedModel === 'general' ? t.modelGeneral : 
                     selectedModel === 'receipt' ? t.modelReceipt : t.modelId}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {isProcessing ? (
                <div className="flex items-center gap-2 text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">{t.analyzing}</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">{t.success}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    {t.remove}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Button component if yours isn't working
const Button = ({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'default',
  disabled = false,
  className = '',
  type = 'button'
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
    ghost: "hover:bg-gray-100"
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-8"
  };
  
  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Simple Select component
const Select = ({ 
  value, 
  onValueChange, 
  children, 
  disabled = false 
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      disabled={disabled}
      className="w-full max-w-[180px] h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
    >
      {children}
    </select>
  );
};

const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => {
  return <option value={value}>{children}</option>;
};

export default Upload;