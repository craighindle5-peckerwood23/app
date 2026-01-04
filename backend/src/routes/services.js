// src/routes/services.js - Services Routes (Catalog-Driven)
const express = require('express');
const router = express.Router();
const {
  servicesCatalog,
  serviceTypes,
  getServiceById,
  getServicesByType,
  searchServices,
  getEnabledServices,
  getServiceStats
} = require('../config/servicesCatalog');

// Transform service for API response
const transformService = (service) => ({
  ...service,
  price: service.basePrice / 100 // Convert cents to dollars
});

// GET /api/services - List all services with optional filtering
router.get('/', (req, res) => {
  try {
    const { type, tag, search, enabled } = req.query;
    let services;

    if (search) {
      services = searchServices(search);
    } else if (type) {
      services = getServicesByType(type);
    } else if (tag) {
      services = getServicesByTag(tag);
    } else {
      services = enabled === 'false' ? servicesCatalog : getEnabledServices();
    }

    res.json(services.map(transformService));
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// GET /api/services/types - Get service type labels
router.get('/types', (req, res) => {
  res.json(serviceTypes);
});

// GET /api/services/stats - Get service statistics
router.get('/stats', (req, res) => {
  const stats = {};
  const enabledServices = getEnabledServices();
  
  for (const [type, label] of Object.entries(serviceTypes)) {
    const typeServices = enabledServices.filter(s => s.type === type);
    stats[type] = {
      label,
      count: typeServices.length,
      avgPrice: typeServices.length > 0 
        ? Math.round(typeServices.reduce((sum, s) => sum + s.basePrice, 0) / typeServices.length) / 100
        : 0
    };
  }
  
  res.json({
    totalServices: enabledServices.length,
    byType: stats
  });
});

// GET /api/services/:id - Get single service by ID
router.get('/:id', (req, res) => {
  try {
    const service = getServiceById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const response = transformService(service);

    // For bundles, include the full details of included services
    if (service.includes && service.includes.length > 0) {
      response.includedServices = service.includes
        .map(id => getServiceById(id))
        .filter(Boolean)
        .map(transformService);
    }

    res.json(response);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

module.exports = router;
