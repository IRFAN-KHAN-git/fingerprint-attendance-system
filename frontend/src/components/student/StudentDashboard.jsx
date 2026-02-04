import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService, attendanceService, classService } from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { 
  Fingerprint, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle,
  BookOpen,
  LogOut,
  Calendar,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import toast from 'react-hot-toast';

export function StudentDashboard() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [allClasses, setAllClasses] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);
  const [enrollingClass, setEnrollingClass] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch profile
      const profileData = await studentService.getMyProfile();
      const studentProfile = profileData.student || profileData;
      setProfile(studentProfile);

      // Fetch all classes
      const classesData = await classService.getAll();
      setAllClasses(classesData.classes || []);

      // Fetch recent attendance
      try {
        const attendanceData = await studentService.getAttendance(studentProfile._id || studentProfile.id, { limit: 5 });
        setRecentAttendance(attendanceData.attendance || []);

        // Fetch stats
        const statsData = await attendanceService.getStats({ studentId: studentProfile._id || studentProfile.id });
        setStats(statsData.stats || { total: 0, present: 0, absent: 0, percentage: 0 });
      } catch (err) {
        console.log('No attendance data yet');
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollInClass = async (classId) => {
    setEnrollingClass(classId);
    try {
      await classService.addStudent(classId, profile._id || profile.id);
      toast.success('Enrolled successfully! Waiting for admin approval.');
      fetchData(); // Refresh
    } catch (error) {
      toast.error(error.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrollingClass(null);
    }
  };

  const isEnrolledInClass = (classId) => {
    return profile?.classes?.some(c => c._id === classId || c.id === classId);
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Fingerprint className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="font-bold text-xl">Student Portal</h1>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={logout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome, {profile?.name || 'Student'}! 👋</h1>
          <p className="text-lg text-gray-600">Roll Number: <span className="font-semibold">{profile?.rollNumber || 'N/A'}</span></p>
        </div>

        {/* Fingerprint Status Alert */}
        {!profile?.isFingerprintRegistered && (
          <Card className="mb-6 border-l-4 border-l-yellow-500 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-yellow-900 mb-1 text-lg">
                    ⚠️ Fingerprint Not Registered
                  </h3>
                  <p className="text-yellow-800">
                    You need to register your fingerprint with the admin to mark attendance automatically.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-t-4 border-t-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Classes</CardTitle>
                <BookOpen className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-gray-500 mt-1">This semester</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-green-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Present</CardTitle>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.present}</div>
              <p className="text-xs text-gray-500 mt-1">Classes attended</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-red-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Absent</CardTitle>
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.absent}</div>
              <p className="text-xs text-gray-500 mt-1">Classes missed</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-purple-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Attendance %</CardTitle>
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.percentage.toFixed(1)}%</div>
              <Progress value={stats.percentage} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-base font-semibold">{profile?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Roll Number</p>
                  <p className="text-base font-semibold">{profile?.rollNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm">{profile?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-sm">{profile?.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Fingerprint Status:</span>
                  <Badge variant={profile?.isFingerprintRegistered ? 'success' : 'destructive'} className="px-3 py-1">
                    {profile?.isFingerprintRegistered ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Registered (ID: {profile?.fingerprintId})
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        Not Registered
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Attendance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Attendance
              </CardTitle>
              <CardDescription>Your last 5 records</CardDescription>
            </CardHeader>
            <CardContent>
              {recentAttendance.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Calendar className="h-16 w-16 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No attendance records yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAttendance.map((record) => (
                    <div key={record._id} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                      <div className="flex items-center gap-3">
                        {record.status === 'present' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                        {record.status === 'absent' && <XCircle className="h-5 w-5 text-red-600" />}
                        {record.status === 'late' && <Clock className="h-5 w-5 text-yellow-600" />}
                        <div>
                          <p className="text-sm font-semibold">{record.class?.name || 'Unknown Class'}</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(record.date)} • {record.markedAt && formatTime(record.markedAt)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={record.status === 'present' ? 'success' : 'destructive'}>
                        {record.status.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* All Classes Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              All Available Classes
            </CardTitle>
            <CardDescription>Browse and enroll in classes</CardDescription>
          </CardHeader>
          <CardContent>
            {allClasses.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <BookOpen className="h-16 w-16 mx-auto mb-3 opacity-30" />
                <p>No classes available yet</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {allClasses.map((classItem) => (
                  <Card key={classItem._id} className="border-2 hover:border-blue-300 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{classItem.name}</CardTitle>
                          <Badge variant="outline" className="text-xs">{classItem.code}</Badge>
                        </div>
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500">Subject</p>
                        <p className="text-sm font-semibold">{classItem.subject}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Teacher</p>
                        <p className="text-sm">{classItem.teacher}</p>
                      </div>
                      {isEnrolledInClass(classItem._id) ? (
                        <Badge variant="success" className="w-full justify-center py-2">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Enrolled
                        </Badge>
                      ) : (
                        <Button 
                          onClick={() => handleEnrollInClass(classItem._id)}
                          disabled={enrollingClass === classItem._id}
                          className="w-full"
                          size="sm"
                        >
                          {enrollingClass === classItem._id ? (
                            'Enrolling...'
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Enroll in Class
                            </>
                          )}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Attendance Warning */}
        {stats.percentage < 75 && stats.total > 0 && (
          <Card className="mt-6 border-l-4 border-l-red-500 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-red-900 mb-1 text-lg">
                    ⚠️ Low Attendance Warning
                  </h3>
                  <p className="text-red-800">
                    Your attendance is {stats.percentage.toFixed(1)}%. You need at least 75% to be eligible for exams.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}