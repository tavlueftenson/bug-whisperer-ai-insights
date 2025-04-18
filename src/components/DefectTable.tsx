
import React from "react";
import { DefectData } from "./FileUpload";

interface DefectTableProps {
  defects: DefectData[];
}

export const DefectTable: React.FC<DefectTableProps> = ({ defects }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-muted">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Subject</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Feature</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Origin</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Test Case ID</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {defects.slice(0, 10).map((defect) => (
            <tr key={defect.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{defect.id}</td>
              <td className="px-6 py-4 text-sm text-foreground max-w-[200px] truncate">{defect.subject}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{defect.featureTag}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{defect.bugOrigin}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{defect.testCaseId}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {defects.length > 10 && (
        <div className="py-2 px-4 text-sm text-muted-foreground">
          Showing 10 of {defects.length} defects
        </div>
      )}
    </div>
  );
};

export default DefectTable;
