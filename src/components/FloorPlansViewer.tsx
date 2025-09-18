import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { useFloorPlans } from '../lib/hooks/useFloorPlans';
import { useApartments } from '../lib/hooks/useApartments';
import { Link } from 'react-router-dom';

interface Point {
  x: number;
  y: number;
}

interface ApartmentShape {
  id: string;
  apartmentId: string | null;
  points: Point[];
}

const FloorPlansViewer = () => {
  const [selectedEntrance, setSelectedEntrance] = useState('1');
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [transform, setTransform] = useState({ scale: 1, translateX: 0, translateY: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [hoveredShape, setHoveredShape] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const {
    floorPlans,
    loading: floorPlansLoading,
    error: floorPlansError
  } = useFloorPlans(selectedEntrance, selectedFloor);

  const {
    apartments,
    loading: apartmentsLoading,
    error: apartmentsError
  } = useApartments(selectedEntrance, selectedFloor.toString());

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

  const handleZoomIn = () => {
    setTransform(prev => ({
      ...prev,
      scale: Math.min(4, prev.scale + 0.25)
    }));
  };

  const handleZoomOut = () => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(1, prev.scale - 0.25)
    }));
  };

  const handleReset = () => {
    setTransform({ scale: 1, translateX: 0, translateY: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.translateX, y: e.clientY - transform.translateY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newTranslateX = e.clientX - dragStart.x;
    const newTranslateY = e.clientY - dragStart.y;

    setTransform(prev => ({
      ...prev,
      translateX: newTranslateX,
      translateY: newTranslateY
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getApartmentById = (apartmentId: string | null) => {
    if (!apartmentId) return null;
    return apartments.find(apt => apt.id === apartmentId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'rgba(34, 197, 94, 0.4)';
      case 'reserved':
        return 'rgba(234, 88, 12, 0.4)';
      case 'sold':
        return 'rgba(239, 68, 68, 0.4)';
      default:
        return 'rgba(107, 114, 128, 0.2)';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Свободен';
      case 'reserved':
        return 'Резервиран';
      case 'sold':
        return 'Продаден';
      default:
        return status;
    }
  };

  const pointsToPath = (points: Point[]): string => {
    if (!points || points.length === 0) return '';
    return `M ${points[0].x} ${points[0].y} ${
      points.slice(1).map(point => `L ${point.x} ${point.y}`).join(' ')
    } Z`;
  };

  const currentFloorPlan = floorPlans[0];
  const shapes = currentFloorPlan?.apartments || [];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <h2 className="section-title text-center">Етажни планове</h2>

        <div className="flex justify-center gap-4 mb-8">
          <div className="relative w-48">
            <select
              value={selectedEntrance}
              onChange={(e) => setSelectedEntrance(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8"
            >
              <option value="1">Вход А</option>
              <option value="2">Вход Б</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative w-48">
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8"
            >
              {Array.from({ length: 11 }, (_, i) => (
                <option key={i + 1} value={i + 1}>Етаж {i + 1}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative border rounded-lg overflow-hidden bg-white shadow-lg" ref={containerRef}>
              <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-2 space-y-2 hidden md:block">
                <button
                  onClick={handleZoomIn}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Увеличи"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Намали"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Нулирай"
                >
                  <Move className="w-5 h-5" />
                </button>
              </div>

              {currentFloorPlan ? (
                <div 
                  className="relative cursor-grab active:cursor-grabbing"
                  style={{ fontSize: 0 }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <div
                    style={{
                      transform: `scale(${transform.scale}) translate(${transform.translateX}px, ${transform.translateY}px)`,
                      transformOrigin: 'center',
                      transition: isDragging ? 'none' : 'transform 0.2s'
                    }}
                  >
                    <img
                      ref={imageRef}
                      src={currentFloorPlan.imageUrl}
                      alt={`Етажен план ${selectedFloor}`}
                      className="w-full h-auto"
                      draggable={false}
                    />
                    <svg
                      ref={svgRef}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      viewBox={`0 0 ${imageDimensions.width} ${imageDimensions.height}`}
                      preserveAspectRatio="xMidYMid meet"
                    >
                      {shapes.map((shape) => {
                        const apartment = getApartmentById(shape.apartmentId);
                        const isHovered = hoveredShape === shape.id;
                        const isSelected = selectedShape === shape.id;
                        
                        return apartment ? (
                          <path
                            key={shape.id}
                            d={pointsToPath(shape.points)}
                            fill={isHovered || isSelected ? getStatusColor(apartment.status) : 'transparent'}
                            stroke={getStatusColor(apartment.status)}
                            strokeWidth={imageDimensions.width * 0.002}
                            className="pointer-events-auto cursor-pointer transition-colors duration-200"
                            onMouseEnter={() => setHoveredShape(shape.id)}
                            onMouseLeave={() => setHoveredShape(null)}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedShape(isSelected ? null : shape.id);
                            }}
                          />
                        ) : null;
                      })}
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 bg-gray-100">
                  <p className="text-gray-500">Няма наличен етажен план</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {selectedShape ? (
              (() => {
                const shape = shapes.find(s => s.id === selectedShape);
                const apartment = shape ? getApartmentById(shape.apartmentId) : null;

                if (!apartment) return null;

                return (
                  <div className="bg-white rounded-lg p-6 shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">
                      Апартамент {apartment.number}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Етаж:</span>
                        <span className="font-medium">{apartment.floor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Площ:</span>
                        <span className="font-medium">{apartment.area} м²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Статус:</span>
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                          apartment.status === 'available'
                            ? 'bg-green-100 text-green-800'
                            : apartment.status === 'reserved'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {getStatusText(apartment.status)}
                        </span>
                      </div>
                      {apartment.price > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Цена:</span>
                          <span className="font-medium">€{apartment.price.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="pt-4">
                        <Link
                          to={`/apartments/${apartment.id}`}
                          className="block w-full bg-primary text-white text-center py-2 rounded-lg hover:bg-primary-dark transition-colors"
                        >
                          Повече информация
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <p className="text-center text-gray-500">
                  Изберете апартамент от плана за повече информация
                </p>
              </div>
            )}

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold mb-4">Легенда</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-100 border-2 border-green-500 mr-2"></div>
                  <span>Свободен</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-orange-100 border-2 border-orange-500 mr-2"></div>
                  <span>Резервиран</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-red-100 border-2 border-red-500 mr-2"></div>
                  <span>Продаден</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FloorPlansViewer;