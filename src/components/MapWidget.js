import React, { useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ScaleControl, useMapEvents, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createCustomPinIcon = (color) => {
  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Pin shadow -->
        <ellipse cx="15" cy="37" rx="6" ry="2" fill="#00000020"/>
        
        <!-- Pin body -->
        <path d="M15 1C8.1 1 2.5 6.6 2.5 13.5C2.5 22.5 15 39 15 39C15 39 27.5 22.5 27.5 13.5C27.5 6.6 21.9 1 15 1Z" fill="${color}" stroke="white" stroke-width="2"/>
        
        <!-- Pin inner circle -->
        <circle cx="15" cy="13" r="5" fill="white" opacity="0.3"/>
        
        <!-- Pin highlight -->
        <circle cx="12" cy="10" r="2" fill="white" opacity="0.6"/>
      </svg>
    `)}`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
  });
};

// Component untuk mengontrol map
const MapController = ({ center, zoom }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom, {
        animate: true,
        duration: 1
      });
    }
  }, [center, zoom, map]);
  
  return null;
};

// Component untuk menampilkan koordinat klik
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};

// Component untuk mencari lokasi
const SearchBox = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const result = data[0];
        const searchResult = {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          name: result.display_name
        };
        onSearch(searchResult);
      } else {
        alert('Lokasi tidak ditemukan');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      alert('Error saat mencari lokasi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute top-4 left-20 z-[1000] bg-white p-2 rounded-lg shadow-lg min-w-48 max-w-64">
      <div className="flex space-x-1">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search Location..."
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors text-xs font-medium whitespace-nowrap"
        >
          {isLoading ? '...' : 'Search'}
        </button>
      </div>
    </div>
  );
};

// Component untuk menampilkan informasi koordinat
const CoordinateDisplay = ({ coordinates }) => {
  if (!coordinates) return null;

  return (
    <div className="absolute bottom-4 left-4 z-[1000] bg-white p-2 rounded-lg shadow-lg">
      <div className="text-xs text-gray-600">
        <div className="font-medium">Koordinat Klik:</div>
        <div>Lat: {coordinates.lat.toFixed(6)}</div>
        <div>Lng: {coordinates.lng.toFixed(6)}</div>
      </div>
    </div>
  );
};

// Custom Zoom Control di kiri atas
const CustomZoomControl = () => {
  const map = useMap();

  return (
    <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg">
      <div className="flex flex-col">
        <button
          onClick={() => map.zoomIn()}
          className="px-3 py-2 hover:bg-gray-100 rounded-t-lg border-b border-gray-200 transition-colors"
          title="Zoom In"
        >
          <span className="text-lg font-bold text-gray-700">+</span>
        </button>
        <button
          onClick={() => map.zoomOut()}
          className="px-3 py-2 hover:bg-gray-100 rounded-b-lg transition-colors"
          title="Zoom Out"
        >
          <span className="text-lg font-bold text-gray-700">−</span>
        </button>
      </div>
    </div>
  );
};

const MapWidget = () => {
  const mapRef = useRef();
  const [viewConfig, setViewConfig] = useState({
    center: [-6.6, 107.5],
    zoom: 8
  });
  const [clickedCoord, setClickedCoord] = useState(null);

  const locations = [
    {
      name: "Jakarta",
      position: [-6.1702, 106.8243],
      color: "#EF4444",
      coordinates: {
        lat: -6.1702,
        lng: 106.8243
      }
    },
    {
      name: "Bandung", 
      position: [-6.9020, 107.6187],
      color: "#3B82F6",
      coordinates: {
        lat: -6.9020,
        lng: 107.6187
      }
    }
  ];

  const handleViewLocation = (location) => {
    setViewConfig({
      center: location.position,
      zoom: 15
    });
  };

  const resetView = () => {
    setViewConfig({
      center: [-6.6, 107.5],
      zoom: 8
    });
    setClickedCoord(null);
  };

  const handleMapClick = (latlng) => {
    setClickedCoord(latlng);
  };

  const handleSearchResult = (result) => {
    setViewConfig({
      center: [result.lat, result.lng],
      zoom: 15
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Location Map</h2>
        <button 
          onClick={resetView}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          Reset View
        </button>
      </div>
      
      <div className="h-96 rounded-xl overflow-hidden border border-gray-200 relative">
        <MapContainer 
          center={viewConfig.center}
          zoom={viewConfig.zoom}
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg"
          scrollWheelZoom={true}
          ref={mapRef}
          zoomControl={false}
        >
          <MapController center={viewConfig.center} zoom={viewConfig.zoom} />
          <MapClickHandler onMapClick={handleMapClick} />
          
          {/* Layers Control dengan pilihan base layer - di pojok kanan atas */}
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Google Satellite">
              <TileLayer
                url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                attribution="Google Satellite"
                maxZoom={20}
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Street Map">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          
          {/* Custom Zoom Control di kiri atas - UKURAN SEMULA */}
          <CustomZoomControl />
          
          {/* Scale Control di kiri bawah */}
          <ScaleControl position="bottomleft" />
          
          {locations.map((location, index) => (
            <Marker 
              key={index}
              position={location.position}
              icon={createCustomPinIcon(location.color)}
            >
              <Popup>
                <div className="min-w-[200px] p-3">
                  <div className="flex items-center space-x-3 mb-3">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: location.color }}
                    ></div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{location.name}</h3>
                    </div>
                  </div>
                  
                  {/* Detail Koordinat */}
                  <div className="mb-4 p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-700">
                      <div className="font-medium mb-1">Koordinat:</div>
                      <div>Latitude: {location.coordinates.lat.toFixed(6)}</div>
                      <div>Longitude: {location.coordinates.lng.toFixed(6)}</div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleViewLocation(location)}
                    className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    View Location
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Search Box di kiri atas, sebelah kanan zoom control */}
        <SearchBox 
          onSearch={handleSearchResult}
        />
        
        {/* Coordinate Display di kiri bawah */}
        <CoordinateDisplay coordinates={clickedCoord} />
      </div>
    </div>
  );
};

export default MapWidget;