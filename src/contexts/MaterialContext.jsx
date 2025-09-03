import { createContext, useContext, useEffect, useState } from 'react';

const MaterialContext = createContext();

export const useMaterialContext = () => {
  const context = useContext(MaterialContext);
  if (!context) {
    throw new Error(
      'useMaterialContext must be used within a MaterialProvider'
    );
  }
  return context;
};

export const MaterialProvider = ({ children }) => {
  const [materials, setMaterials] = useState([]);
  const [versions, setVersions] = useState({});

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedMaterials = localStorage.getItem('classMaterials');
    const savedVersions = localStorage.getItem('materialVersions');

    if (savedMaterials) {
      setMaterials(JSON.parse(savedMaterials));
    } else {
      // Default materials if none exist
      const defaultMaterials = [
        {
          id: 1,
          title: 'Modul Jaringan Komputer',
          description:
            'Modul lengkap tentang konfigurasi jaringan dan troubleshooting',
          subject: 'Jaringan Komputer',
          author: 'Budi Santoso',
          authorId: 'teacher-1',
          category: 'Modul',
          fileType: 'pdf',
          fileSize: '2.4 MB',
          version: '1.2',
          lastUpdated: '2023-10-15',
          downloadCount: 42,
          tags: ['jaringan', 'konfigurasi', 'troubleshooting'],
          isPublic: true,
        },
        {
          id: 2,
          title: 'Slide Presentasi Pemrograman Web',
          description: 'Slide presentasi untuk materi dasar pemrograman web',
          subject: 'Pemrograman Web',
          author: 'Siti Nurhaliza',
          authorId: 'teacher-2',
          category: 'Presentasi',
          fileType: 'pptx',
          fileSize: '5.1 MB',
          version: '2.0',
          lastUpdated: '2023-10-20',
          downloadCount: 38,
          tags: ['html', 'css', 'javascript'],
          isPublic: true,
        },
      ];
      setMaterials(defaultMaterials);
    }

    if (savedVersions) {
      setVersions(JSON.parse(savedVersions));
    } else {
      // Default versions if none exist
      const defaultVersions = {
        1: [
          {
            id: 'v1.0',
            version: '1.0',
            releaseDate: '2023-09-01',
            changes: 'Versi awal modul',
            author: 'Budi Santoso',
          },
          {
            id: 'v1.1',
            version: '1.1',
            releaseDate: '2023-09-20',
            changes: 'Penambahan bab tentang VLAN',
            author: 'Budi Santoso',
          },
          {
            id: 'v1.2',
            version: '1.2',
            releaseDate: '2023-10-15',
            changes: 'Perbaikan diagram dan penjelasan subnetting',
            author: 'Budi Santoso',
          },
        ],
        2: [
          {
            id: 'v1.0',
            version: '1.0',
            releaseDate: '2023-09-05',
            changes: 'Versi awal presentasi',
            author: 'Siti Nurhaliza',
          },
          {
            id: 'v2.0',
            version: '2.0',
            releaseDate: '2023-10-20',
            changes: 'Penambahan materi CSS Grid dan Flexbox',
            author: 'Siti Nurhaliza',
          },
        ],
      };
      setVersions(defaultVersions);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('classMaterials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('materialVersions', JSON.stringify(versions));
  }, [versions]);

  // Material management
  const addMaterial = material => {
    const newMaterial = {
      ...material,
      id: Date.now(),
      version: '1.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      downloadCount: 0,
    };

    setMaterials(prev => [newMaterial, ...prev]);

    // Initialize versions for this material
    setVersions(prev => ({
      ...prev,
      [newMaterial.id]: [
        {
          id: 'v1.0',
          version: '1.0',
          releaseDate: new Date().toISOString().split('T')[0],
          changes: 'Versi awal',
          author: material.author,
        },
      ],
    }));

    return newMaterial;
  };

  const updateMaterial = (id, updatedMaterial) => {
    setMaterials(prev =>
      prev.map(material =>
        material.id === id ? { ...material, ...updatedMaterial } : material
      )
    );
  };

  const deleteMaterial = id => {
    setMaterials(prev => prev.filter(material => material.id !== id));
    // Also delete associated versions
    const newVersions = { ...versions };
    delete newVersions[id];
    setVersions(newVersions);
  };

  const incrementDownloadCount = id => {
    setMaterials(prev =>
      prev.map(material =>
        material.id === id
          ? { ...material, downloadCount: material.downloadCount + 1 }
          : material
      )
    );
  };

  // Version management
  const addVersion = (materialId, versionData) => {
    const newVersion = {
      ...versionData,
      id: `v${Date.now()}`,
      releaseDate: new Date().toISOString().split('T')[0],
    };

    setVersions(prev => ({
      ...prev,
      [materialId]: [...(prev[materialId] || []), newVersion],
    }));

    // Update material version
    const material = materials.find(m => m.id === materialId);
    if (material) {
      updateMaterial(materialId, {
        ...material,
        version: versionData.version,
        lastUpdated: newVersion.releaseDate,
      });
    }

    return newVersion;
  };

  const searchMaterials = query => {
    return materials.filter(
      material =>
        material.title.toLowerCase().includes(query.toLowerCase()) ||
        material.description.toLowerCase().includes(query.toLowerCase()) ||
        material.subject.toLowerCase().includes(query.toLowerCase()) ||
        material.tags.some(tag =>
          tag.toLowerCase().includes(query.toLowerCase())
        )
    );
  };

  const getMaterialsBySubject = subject => {
    return materials.filter(material => material.subject === subject);
  };

  const getMaterialById = id => {
    return materials.find(material => material.id === id);
  };

  const getVersionsByMaterialId = materialId => {
    return versions[materialId] || [];
  };

  const value = {
    materials,
    versions,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    incrementDownloadCount,
    addVersion,
    searchMaterials,
    getMaterialsBySubject,
    getMaterialById,
    getVersionsByMaterialId,
  };

  return (
    <MaterialContext.Provider value={value}>
      {children}
    </MaterialContext.Provider>
  );
};
