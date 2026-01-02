// app/dashboard/layout.tsx
import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Removemos a Sidebar daqui para colocá-la na Page onde o estado existe */}
      {children}
    </div>
  );
}