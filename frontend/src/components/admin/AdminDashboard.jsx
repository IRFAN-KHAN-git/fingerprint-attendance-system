import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Fingerprint, LogOut, Users, Radio } from 'lucide-react';
import { LiveClassScanner } from './LiveClassScanner';
import { EnrollmentManager } from './EnrollmentManager';

export function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Fingerprint className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="font-bold text-xl text-blue-900">Admin Portal</h1>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={logout} className="text-red-600 hover:bg-red-50">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome, Administrator! 👨‍💼</h1>
          <p className="text-lg text-gray-600">Manage attendance and student enrollments</p>
        </div>

        <Tabs defaultValue="scanner" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto bg-white border">
            <TabsTrigger value="scanner" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Radio className="h-4 w-4 mr-2" />
              Live Class Scanner
            </TabsTrigger>
            <TabsTrigger value="enrollment" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Fingerprint Enrollment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scanner">
            <LiveClassScanner />
          </TabsContent>

           <TabsContent value="enrollment">
            <EnrollmentManager /> 
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}