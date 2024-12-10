"use client";
import React, { useState } from "react";
import { FaChevronDown, FaChevronRight, FaDownload, FaEye, FaTimes, FaUserTie, FaCircle } from "react-icons/fa";

interface OrgNode {
    name: string;
    department?: string;
    children?: OrgNode[];
  }
  
  interface DepartmentInfo {
    Indicadores: string[];
    Descripcion: string;
    Procesos: string;
    status: string;
    lastUpdate: string;
  }
  
  interface DepartmentDataType {
    [key: string]: DepartmentInfo;
  }

  interface ModalProps {
    content: DepartmentInfo;
    onClose: () => void;  // Añadir prop para cerrar el modal
  }
// <iframe src="https://demo-orgchart.vercel.app/orgchart" width="1175px" height="600px"></iframe>
const orgData: OrgNode = {
    name: "Consejo Politecnico",
    children:[
        {
            name: "Rectorado",
            children: [
                {
                name: "Gerencia de Tecnologías y Sistemas de información",
                department: "Technology",
                children: [
                    { name: "Analista de Desarrollo", department: "Development" },
                    { name: "Analista de Infraestructura", department: "Architecture" },
                    { name: "Analista de Desarrollo Sr", department: "Development" }
                ]
                },
                {
                name: "Gerencia Financiera",
                department: "Finance",
                children: [
                    { name: "Analista Financiero", department: "Finance" },
                    { name: "Asistente Contable", department: "Accounting" },
                    { name: "Contadora", department: "Accounting" }
                ]
                },
                {
                    name: "Gerencia Juridica",
                    department: "Legal",
                }

            ]
        }
    ]
};

const departmentData: DepartmentDataType = {
    Technology: {
        Indicadores: ["Tasa de entrega del proyecto", "Nivel de calidad del código", "Tiempo de actividad del sistema"],
        Descripcion:"Liderar iniciativas técnicas y de innovación",
        Procesos: "Implementación de metodología de desarrollo ágil",
        status: "actualizado",
        lastUpdate: "2024-01-15"
      },
      Finance: {
        Indicadores: ["Crecimiento de ingresos", "Márgenes de beneficio", "Reducción de costes"],
        Descripcion: "Gestionar las operaciones y la estrategia financiera",
        Procesos: "Informes y análisis financieros mensuales",
        status: "pendiente",
        lastUpdate: "2024-01-10"
      }
};

const OrgChart = () => {
    //const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<DepartmentInfo | null>(null);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

const handleNodeClick = (department: string) => {
   // setSelectedDepartment(department);
    setShowModal(true);
    setModalContent(departmentData[department]);
  };

  const toggleItem = (item: string) => {
    setExpandedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "actualizado": return "text-green-500";
      case "pendiente": return "text-yellow-500";
      default: return "text-gray-500";
    }
  };

  const renderNode = (node: OrgNode, level: number = 0) => (
    <div
      key={node.name}
      className={`flex flex-col items-center mb-4 ${level > 0 ? "mt-4" : ""}`}
    >
      <div
        onClick={() => node.department && handleNodeClick(node.department)}
        className={`flex items-center space-x-2 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer ${node.department ? "hover:bg-blue-50" : ""}`}
      >
        <FaUserTie className="text-blue-600" />
        <span className="font-semibold">{node.name}</span>
      </div>
      {node.children && (
        <div className="flex space-x-8 mt-4">
          {node.children.map((child) => renderNode(child, level + 1))}
        </div>
      )}
    </div>
  );

  const Modal: React.FC<ModalProps> = ({ content }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Detalle de departamentos</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaCircle className={getStatusColor(content.status)} />
              <span className="text-sm capitalize">{content.status}</span>
            </div>
            <div className="text-sm text-gray-600">
              Ultima act.: {content.lastUpdate}
            </div>


          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
          </div>
        </div>

        <div className="space-y-4">
          {["Indicadores", "Descripcion", "Procesos"].map((item) => (
            <div key={item} className="border rounded-lg">
              <button
                onClick={() => toggleItem(item)}
                className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg"
              >
                <span className="font-semibold capitalize">
                  {item.replace(/([A-Z])/g, " $1").trim()}
                </span>
                {expandedItems.includes(item) ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronRight />
                )}
              </button>
              {expandedItems.includes(item) && (
                <div className="p-4 border-t">
                  {Array.isArray(content[item as keyof DepartmentInfo]) ? (
                    <ul className="list-disc pl-4">
                      {(content[item as keyof DepartmentInfo] as string[]).map((kpi) => (
                        <li key={kpi}>{kpi}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{content[item as keyof DepartmentInfo]}</p>
                  )}
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={() => console.log("Preview clicked")}                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <FaEye />
                      <span>Previsualizacion</span>
                    </button>
                    <button
                      onClick={() => console.log("Download clicked")}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <FaDownload />
                      <span>Descarga</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-12">Repositorio de puestos intitucionales</h1>
      <div className="flex justify-center">{renderNode(orgData)}</div>
      {showModal && modalContent && <Modal 
          content={modalContent} 
          onClose={() => setShowModal(false)} 
        />}
    </div>
  );
};

export default OrgChart;