// useServices.js - Custom hook for services catalog
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const useServices = (options = {}) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { type, tag, search } = options;

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (tag) params.append('tag', tag);
      if (search) params.append('search', search);
      
      const url = `${API}/services${params.toString() ? `?${params}` : ''}`;
      const response = await axios.get(url);
      setServices(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [type, tag, search]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return { services, loading, error, refetch: fetchServices };
};

export const useService = (serviceId) => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!serviceId) {
      setLoading(false);
      return;
    }

    const fetchService = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API}/services/${serviceId}`);
        setService(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch service:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  return { service, loading, error };
};

export const useServiceTypes = () => {
  const [types, setTypes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get(`${API}/services/types`);
        setTypes(response.data);
      } catch (err) {
        console.error('Failed to fetch service types:', err);
        // Fallback to default types
        setTypes({
          conversion: 'Document Conversion',
          ocr: 'OCR & Text Extraction',
          fax: 'Fax Services',
          shredding: 'Secure Shredding',
          bundle: 'Service Bundles',
          grievance: 'Grievance & Complaints',
          notary: 'Notary Services',
          legal: 'Legal Documents',
          medical: 'Medical Documents',
          financial: 'Financial Documents'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
  }, []);

  return { types, loading };
};

// Helper function to format price from cents
export const formatPrice = (priceInCents) => {
  return `$${(priceInCents / 100).toFixed(2)}`;
};

// Helper function to get price display (handles different units)
export const getPriceDisplay = (service) => {
  const price = service.price || service.base_price / 100;
  const unit = service.unit;
  
  switch (unit) {
    case 'per_file':
      return `$${price.toFixed(2)}/file`;
    case 'per_page':
      return `$${price.toFixed(2)}/page`;
    case 'per_mb':
      return `$${price.toFixed(2)}/MB`;
    case 'flat':
      return `$${price.toFixed(2)}`;
    default:
      return `$${price.toFixed(2)}`;
  }
};

// Group services by type
export const groupServicesByType = (services, typeLabels) => {
  const grouped = {};
  
  services.forEach(service => {
    const type = service.type;
    if (!grouped[type]) {
      grouped[type] = {
        label: typeLabels[type] || type,
        services: []
      };
    }
    grouped[type].services.push(service);
  });
  
  return grouped;
};

export default useServices;
