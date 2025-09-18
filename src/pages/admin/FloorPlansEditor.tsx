import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Save, Trash2, Building2, Loader2, Pencil, Square, Move, X } from 'lucide-react';
import { useFloorPlans } from '../../lib/hooks/useFloorPlans';
import { useApartments } from '../../lib/hooks/useApartments';

interface Point {
  x: number;
  y: number;
}

interface ApartmentShape {
  id: string;
  apartmentId: string | null;
  points: Point[];
}

const FloorPlansEditor = () => {
  const [selectedEntrance, setSelectedEntrance] = useState('1');
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [shapes, setShapes] = useState<ApartmentShape[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [drawingMode, setDrawingMode] = useState<'draw' | 'select'>('select');
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [showApartmentForm, setShowApartmentForm] = useState(false);
  const [tempShape, setTempShape] = useState<ApartmentShape | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  
  const imageRef = useRef<HTMLImageElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    floorPlans,
    loading: floorPlansLoading,
    error: floorPlansError,
    uploadFloorPlan,
    updateFloorPlan,
    deleteFloorPlan
  } = useFloorPlans(selectedEntrance, selectedFloor);

  const {
    apartments,
    loading: apartmentsLoading,
    error: apartmentsError
  } = useApartments(selectedEntrance, selectedFloor.toString());

  useEffect(() => {
    if (floorPlans.length > 0 && floorPlans[0].apartments) {
      setShapes(floorPlans[0].apartments);
    }
  }, [floorPlans]);

  useEffect(() => {
    const updateDimensions = () => {
      if (imageRef.current) {
        const { naturalWidth, naturalHeight } = imageRef.current;
        setImageDimensions({ width: naturalWidth, height: naturalHeight });
      }
    };

    const image = imageRef.current;
    if (image) {
      if (image.complete) {
        updateDimensions();
      } else {
        image.addEventListener('load', updateDimensions);
      }
    }

    return () => {
      if (image) {
        image.removeEventListener('load', updateDimensions);
      }
    };
  }, [floorPlans]);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        setIsSaving(true);
        await uploadFloorPlan(file, selectedEntrance, selectedFloor);
      } catch (error) {
        console.error('Error uploading floor plan:', error);
        alert('Грешка при качване на етажния план');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: false
  });

  const getMousePosition = (event: React.MouseEvent): Point | null => {
    if (!svgRef.current || !imageRef.current) return null;
    
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    
    // Get click coordinates relative to SVG
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert to percentage coordinates
    return {
      x: (x / rect.width) * imageDimensions.width,
      y: (y / rect.height) * imageDimensions.height
    };
  };

  const handleMouseClick = (event: React.MouseEvent) => {
    if (drawingMode !== 'draw') return;

    const point = getMousePosition(event);
    if (!point) return;
    
    // Check if we're closing the polygon
    if (currentPoints.length > 2) {
      const firstPoint = currentPoints[0];
      const distance = Math.sqrt(
        Math.pow(point.x - firstPoint.x, 2) + 
        Math.pow(point.y - firstPoint.y, 2)
      );
      
      if (distance < (imageDimensions.width * 0.01)) { // 1% of image width as snap distance
        const newShape: ApartmentShape = {
          id: Date.now().toString(),
          apartmentId: null,
          points: [...currentPoints]
        };
        setTempShape(newShape);
        setShowApartmentForm(true);
        setCurrentPoints([]);
        return;
      }
    }
    
    setCurrentPoints(prev => [...prev, point]);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (drawingMode !== 'draw' || currentPoints.length === 0) return;
    setHoveredPoint(null);

    const point = getMousePosition(event);
    if (!point) return;
    
    // Check if we're hovering near the starting point
    if (currentPoints.length > 2) {
      const startPoint = currentPoints[0];
      const distance = Math.sqrt(
        Math.pow(point.x - startPoint.x, 2) + 
        Math.pow(point.y - startPoint.y, 2)
      );
      
      if (distance < (imageDimensions.width * 0.01)) {
        setHoveredPoint(0);
      }
    }
  };

  const cancelDrawing = () => {
    setCurrentPoints([]);
    setIsDrawing(false);
    setTempShape(null);
    setShowApartmentForm(false);
  };

  const pointsToPath = (points: Point[] | undefined): string => {
    if (!points || points.length === 0) return '';
    return `M ${points[0].x} ${points[0].y} ${
      points.slice(1).map(point => `L ${point.x} ${point.y}`).join(' ')
    }${points.length > 2 ? ' Z' : ''}`;
  };

  const handleShapeClick = (event: React.MouseEvent, shapeId: string) => {
    if (drawingMode === 'select') {
      event.stopPropagation();
      setSelectedShape(shapeId);
    }
  };

  const handleSave = async () => {
    if (floorPlans.length > 0) {
      const currentPlan = floorPlans[0];
      try {
        setIsSaving(true);
        await updateFloorPlan(currentPlan.id, { apartments: shapes });
        alert('Етажният план е запазен успешно!');
      } catch (error) {
        console.error('Error saving floor plan:', error);
        alert('Грешка при запазване на етажния план');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDelete = async () => {
    if (floorPlans.length > 0) {
      const currentPlan = floorPlans[0];
      if (window.confirm('Сигурни ли сте, че искате да изтриете този етажен план?')) {
        try {
          setIsSaving(true);
          await deleteFloorPlan(currentPlan.id, currentPlan.imageUrl);
          setShapes([]);
          alert('Етажният план е изтрит успешно!');
        } catch (error) {
          console.error('Error deleting floor plan:', error);
          if (error instanceof Error) {
            alert(error.message);
          } else {
            alert('Възникна неочаквана грешка при изтриване на етажния план');
          }
        } finally {
          setIsSaving(false);
        }
      }
    }
  };

  const handleDeleteShape = (shapeId: string) => {
    setShapes(prev => prev.filter(shape => shape.id !== shapeId));
    setSelectedShape(null);
  };

  const handleAssignApartment = (shapeId: string, apartmentId: string | null) => {
    if (tempShape && showApartmentForm) {
      // Adding new shape
      setShapes(prev => [...prev, { ...tempShape, apartmentId }]);
      setTempShape(null);
      setShowApartmentForm(false);
    } else {
      // Updating existing shape
      setShapes(prev => prev.map(shape =>
        shape.id === shapeId ? { ...shape, apartmentId } : shape
      ));
    }
  };

  const getApartmentById = (apartmentId: string | null) => {
    if (!apartmentId) return null;
    return apartments.find(apt => apt.id === apartmentId);
  };

  if (floorPlansLoading || apartmentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (floorPlansError || apartmentsError) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        <p>{floorPlansError || apartmentsError}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Building2 className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-2xl font-bold">Етажни планове</h1>
        </div>
        <div className="flex space-x-4">
          <select
            value={selectedEntrance}
            onChange={(e) => setSelectedEntrance(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white shadow-sm hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            <option value="1">Вход А</option>
            <option value="2">Вход Б</option>
          </select>
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(Number(e.target.value))}
            className="px-4 py-2 border rounded-lg bg-white shadow-sm hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            {Array.from({ length: 11 }, (_, i) => (
              <option key={i + 1} value={i + 1}>Етаж {i + 1}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {floorPlans.length > 0 ? (
            <div className="relative border rounded-lg overflow-hidden bg-white shadow-lg">
              <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-2 space-x-2">
                <button
                  onClick={() => {
                    setDrawingMode('draw');
                    setSelectedShape(null);
                    setCurrentPoints([]);
                  }}
                  className={`p-2 rounded-lg ${
                    drawingMode === 'draw' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  title="Начертай апартамент"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setDrawingMode('select');
                    setSelectedShape(null);
                    setCurrentPoints([]);
                  }}
                  className={`p-2 rounded-lg ${
                    drawingMode === 'select'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  title="Избери апартамент"
                >
                  <Move className="w-5 h-5" />
                </button>
              </div>

              {drawingMode === 'draw' && currentPoints.length > 0 && (
                <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-2 space-x-2">
                  <button
                    onClick={cancelDrawing}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Отказ
                  </button>
                </div>
              )}

              <div className="relative" style={{ fontSize: 0 }}>
                <img
                  ref={imageRef}
                  src={floorPlans[0].imageUrl}
                  alt={`Floor plan ${selectedFloor}`}
                  className="w-full h-auto"
                />
                <svg
                  ref={svgRef}
                  className="absolute inset-0 w-full h-full"
                  viewBox={`0 0 ${imageDimensions.width} ${imageDimensions.height}`}
                  preserveAspectRatio="xMidYMid meet"
                  onClick={handleMouseClick}
                  onMouseMove={handleMouseMove}
                >
                  {/* Existing shapes */}
                  {shapes.map((shape) => (
                    <path
                      key={shape.id}
                      d={pointsToPath(shape.points)}
                      fill={selectedShape === shape.id ? 'rgba(44, 62, 80, 0.4)' : 'rgba(44, 62, 80, 0.2)'}
                      stroke="#2C3E50"
                      strokeWidth={imageDimensions.width * 0.002}
                      className="cursor-pointer hover:fill-opacity-40 transition-colors"
                      onClick={(e) => handleShapeClick(e, shape.id)}
                    />
                  ))}

                  {/* Current drawing */}
                  {currentPoints.length > 0 && (
                    <>
                      <path
                        d={pointsToPath(currentPoints)}
                        fill="none"
                        stroke="#2C3E50"
                        strokeWidth={imageDimensions.width * 0.002}
                        strokeDasharray="4"
                      />
                      {currentPoints.map((point, index) => (
                        <circle
                          key={index}
                          cx={point.x}
                          cy={point.y}
                          r={imageDimensions.width * 0.005}
                          fill={index === 0 ? '#2C3E50' : '#fff'}
                          stroke="#2C3E50"
                          strokeWidth={imageDimensions.width * 0.001}
                          className={index === 0 && hoveredPoint === 0 ? 'animate-pulse' : ''}
                        />
                      ))}
                    </>
                  )}
                </svg>
              </div>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary hover:bg-primary/5'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-600">
                {isDragActive
                  ? 'Пуснете файла тук...'
                  : 'Плъзнете етажен план или кликнете, за да изберете файл'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Поддържани формати: PNG, JPG, JPEG
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6">Апартаменти на етажа</h2>
            {drawingMode === 'draw' ? (
              <div className="text-sm text-gray-600 space-y-2">
                <p>Кликнете върху плана, за да добавите точки за апартамента.</p>
                <p>Кликнете върху първата точка, за да затворите формата.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {apartments.map((apartment) => {
                  const isAssigned = shapes.some(shape => shape.apartmentId === apartment.id);
                  const isSelected = selectedShape && shapes.find(shape => shape.id === selectedShape)?.apartmentId === apartment.id;
                  
                  return (
                    <div
                      key={apartment.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-primary/10 border border-primary'
                          : isAssigned
                          ? 'bg-gray-100 opacity-50'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div>
                        <span className="font-medium">Апартамент {apartment.number}</span>
                        <div className="text-sm text-gray-500">
                          {apartment.area} м² • {apartment.rooms} стаи
                        </div>
                      </div>
                      {(showApartmentForm || selectedShape) && !isAssigned && (
                        <button
                          onClick={() => handleAssignApartment(selectedShape || '', apartment.id)}
                          className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                        >
                          Избери
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={floorPlans.length === 0 || isSaving}
              className="flex-1 bg-secondary text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-secondary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <span>Запазване...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  <span>Запази</span>
                </>
              )}
            </button>

            {floorPlans.length > 0 && (
              <button
                onClick={handleDelete}
                disabled={isSaving}
                className="bg-red-600 text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                <span>Изтрий</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlansEditor;