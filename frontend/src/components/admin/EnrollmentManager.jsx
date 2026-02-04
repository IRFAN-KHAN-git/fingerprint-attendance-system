import { useState, useEffect } from 'react';
import { studentService, fingerprintService } from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Input } from '../ui/Input';
import { CheckCircle2, XCircle, Fingerprint, Search, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export function EnrollmentManager() {
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [enrollingStudent, setEnrollingStudent] = useState(null);
  const [enrollmentStep, setEnrollmentStep] = useState('idle');
  const [enrollmentProgress, setEnrollmentProgress] = useState('');

  useEffect(() => {
    fetchEnrollmentStatus();
  }, []);

  const fetchEnrollmentStatus = async () => {
    try {
      const data = await studentService.getEnrollmentStatus();
      setEnrollmentStatus(data);
    } catch (error) {
      console.error('Error fetching enrollment status:', error);
      toast.error('Failed to load enrollment status');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (student) => {
    setEnrollingStudent(student);
    setEnrollmentStep('enrolling');
    setEnrollmentProgress('Assigning fingerprint ID...');

    try {
      // Start enrollment
      const result = await fingerprintService.enroll(student._id);
      
      setEnrollmentStep('success');
      setEnrollmentProgress(`Fingerprint ID ${result.templateId} assigned successfully!`);
      
      toast.success(`${student.name} enrolled successfully!`);
      
      // Refresh enrollment status
      setTimeout(() => {
        fetchEnrollmentStatus();
        setEnrollingStudent(null);
        setEnrollmentStep('idle');
      }, 2000);

    } catch (error) {
      console.error('Enrollment error:', error);
      setEnrollmentStep('error');
      setEnrollmentProgress(error.response?.data?.message || 'Enrollment failed');
      toast.error('Enrollment failed. Please try again.');
    }
  };

  const filteredNotEnrolled = enrollmentStatus?.students?.notEnrolled?.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredEnrolled = enrollmentStatus?.students?.enrolled?.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const summary = enrollmentStatus?.summary || { total: 0, enrolled: 0, notEnrolled: 0, percentage: 0 };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Overview</CardTitle>
          <CardDescription>Fingerprint enrollment status of all students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{summary.total}</div>
              <div className="text-sm text-muted-foreground">Total Students</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{summary.enrolled}</div>
              <div className="text-sm text-muted-foreground">Enrolled</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{summary.notEnrolled}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Enrollment Progress</span>
              <span className="font-medium">{summary.percentage}%</span>
            </div>
            <Progress value={parseFloat(summary.percentage)} />
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or roll number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Not Enrolled Students */}
      {filteredNotEnrolled.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                Students Pending Enrollment ({filteredNotEnrolled.length})
              </div>
            </CardTitle>
            <CardDescription>Students who need fingerprint registration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredNotEnrolled.map((student) => (
                <div key={student._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.rollNumber} • {student.email}</p>
                  </div>
                  <Button onClick={() => handleEnroll(student)} size="sm">
                    <Fingerprint className="h-4 w-4 mr-2" />
                    Enroll
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enrolled Students */}
      {filteredEnrolled.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Enrolled Students ({filteredEnrolled.length})
              </div>
            </CardTitle>
            <CardDescription>Students with registered fingerprints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredEnrolled.map((student) => (
                <div key={student._id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.rollNumber} • {student.email}</p>
                  </div>
                  <Badge variant="success">
                    <Fingerprint className="h-3 w-3 mr-1" />
                    ID: {student.fingerprintId}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enrollment Dialog */}
      <Dialog open={enrollingStudent !== null} onOpenChange={() => setEnrollingStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {enrollmentStep === 'success' ? '✓ Enrollment Successful!' : 
               enrollmentStep === 'error' ? '✗ Enrollment Failed' : 
               'Enrolling Fingerprint'}
            </DialogTitle>
            <DialogDescription>
              {enrollingStudent?.name} ({enrollingStudent?.rollNumber})
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {enrollmentStep === 'enrolling' && (
              <div className="text-center space-y-4">
                <div className="relative h-32 mx-auto w-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Fingerprint className="h-20 w-20 text-primary animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">{enrollmentProgress}</p>
                  <p className="text-sm text-muted-foreground">
                    Please place your finger on the scanner...
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1 text-left max-w-xs mx-auto">
                    <p>1. Place finger on scanner</p>
                    <p>2. Remove finger when prompted</p>
                    <p>3. Place same finger again</p>
                  </div>
                </div>
              </div>
            )}

            {enrollmentStep === 'success' && (
              <div className="text-center space-y-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <p className="font-medium text-green-600">{enrollmentProgress}</p>
              </div>
            )}

            {enrollmentStep === 'error' && (
              <div className="text-center space-y-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <XCircle className="h-10 w-10 text-red-600" />
                </div>
                <p className="font-medium text-red-600">{enrollmentProgress}</p>
                <Button onClick={() => handleEnroll(enrollingStudent)} variant="outline">
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}