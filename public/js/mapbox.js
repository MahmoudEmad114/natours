
export const displayMap = locations => {
    // Create map
    const map = L.map('map', {
        // scrollWheelZoom: false
    });

    // OpenStreetMap tiles
    L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
    ).addTo(map);

    // Create bounds
    const bounds = L.latLngBounds([]);

    locations.forEach(loc => {
        // GeoJSON: [lng, lat]
        // Leaflet: [lat, lng]
        const coordinates = [
            loc.coordinates[1],
            loc.coordinates[0]
        ];

        // Custom Natours marker
        const icon = L.divIcon({
            className: 'marker',
            html: '',
            iconSize: [32, 40],
            iconAnchor: [16, 40]
        });

        // Marker
        const marker = L.marker(coordinates, {
            icon
        }).addTo(map);

        // Popup
        marker.bindPopup(
            `<p>Day ${loc.day}: ${loc.description}</p>`,
            {
                offset: [0, -30]
            }
        );

        // Extend bounds
        bounds.extend(coordinates);
    });

    // Fit all locations
    map.fitBounds(bounds, {
        paddingTopLeft: [100, 200],
        paddingBottomRight: [100, 150]
    });
}