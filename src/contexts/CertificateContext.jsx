import { createContext, useContext, useEffect, useState } from 'react';

const CertificateContext = createContext();

export const useCertificateContext = () => {
  const context = useContext(CertificateContext);
  if (!context) {
    throw new Error(
      'useCertificateContext must be used within a CertificateProvider'
    );
  }
  return context;
};

export const CertificateProvider = ({ children }) => {
  const [certificates, setCertificates] = useState([]);

  // Load certificates from localStorage on initial load
  useEffect(() => {
    const savedCertificates = localStorage.getItem('certificates');
    if (savedCertificates) {
      setCertificates(JSON.parse(savedCertificates));
    } else {
      // Add sample data for demonstration
      const sampleCertificates = [
        {
          id: 1,
          studentId: 1,
          title: 'Juara 1 Lomba Pemrograman',
          description:
            'Penghargaan atas prestasi juara 1 dalam lomba pemrograman tingkat sekolah',
          type: 'achievement',
          issuer: 'Panitia Lomba',
          issueDate: '2025-08-10',
        },
        {
          id: 2,
          studentId: 1,
          title: 'Sertifikat Kelulusan Pelatihan Jaringan',
          description:
            'Sertifikat kelulusan pelatihan administrasi jaringan komputer',
          type: 'academic',
          issuer: 'Lembaga Pelatihan',
          issueDate: '2025-07-15',
        },
        {
          id: 3,
          studentId: 2,
          title: 'Partisipasi Seminar Teknologi',
          description:
            'Sertifikat partisipasi dalam seminar teknologi informasi',
          type: 'participation',
          issuer: 'Himpunan Mahasiswa',
          issueDate: '2025-08-05',
        },
      ];
      setCertificates(sampleCertificates);
    }
  }, []);

  // Save certificates to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('certificates', JSON.stringify(certificates));
  }, [certificates]);

  const addCertificate = certificateData => {
    const newCertificate = {
      id: Date.now(),
      issueDate: new Date().toISOString().split('T')[0],
      ...certificateData,
    };
    setCertificates(prev => [...prev, newCertificate]);
    return newCertificate;
  };

  const updateCertificate = (id, updatedData) => {
    setCertificates(prev =>
      prev.map(certificate =>
        certificate.id === id ? { ...certificate, ...updatedData } : certificate
      )
    );
  };

  const deleteCertificate = id => {
    setCertificates(prev => prev.filter(certificate => certificate.id !== id));
  };

  const getStudentCertificates = studentId => {
    return certificates.filter(
      certificate => certificate.studentId === studentId
    );
  };

  const getCertificateById = id => {
    return certificates.find(certificate => certificate.id === id);
  };

  const getCertificatesByType = type => {
    return certificates.filter(certificate => certificate.type === type);
  };

  const value = {
    certificates,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    getStudentCertificates,
    getCertificateById,
    getCertificatesByType,
  };

  return (
    <CertificateContext.Provider value={value}>
      {children}
    </CertificateContext.Provider>
  );
};
