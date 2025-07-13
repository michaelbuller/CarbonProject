import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, Clock, Plus, Users, Video, MapPin, 
  Bell, CheckCircle, AlertTriangle, FileText, ExternalLink,
  ChevronLeft, ChevronRight, Filter, Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useResponsive } from './ui/use-responsive';

interface CalendarSchedulingProps {
  userData: any;
}

const upcomingEvents = [
  {
    id: 1,
    title: 'Methodology Review Meeting',
    type: 'meeting',
    date: '2024-12-28',
    time: '2:00 PM',
    duration: '1 hour',
    attendees: ['Sarah Chen', 'David Rodriguez'],
    location: 'Virtual - Zoom',
    status: 'confirmed',
    priority: 'high',
    description: 'Review and finalize project methodology before submission'
  },
  {
    id: 2,
    title: 'Third-party Validation Call',
    type: 'validation',
    date: '2025-01-05',
    time: '10:00 AM',
    duration: '2 hours',
    attendees: ['Emma Thompson', 'Sarah Chen'],
    location: 'Virtual - Teams',
    status: 'pending',
    priority: 'critical',
    description: 'Initial validation assessment and document review'
  },
  {
    id: 3,
    title: 'Document Submission Deadline',
    type: 'deadline',
    date: '2025-01-10',
    time: '11:59 PM',
    duration: null,
    attendees: [],
    location: 'VCS Registry Portal',
    status: 'upcoming',
    priority: 'critical',
    description: 'Final submission of all methodology documents to VCS'
  },
  {
    id: 4,
    title: 'Team Progress Check-in',
    type: 'meeting',
    date: '2025-01-12',
    time: '3:00 PM',
    duration: '30 minutes',
    attendees: ['Sarah Chen', 'David Rodriguez', 'Michael Kim'],
    location: 'Virtual - Zoom',
    status: 'scheduled',
    priority: 'medium',
    description: 'Weekly progress update and task alignment'
  },
  {
    id: 5,
    title: 'Monitoring Plan Workshop',
    type: 'workshop',
    date: '2025-01-15',
    time: '9:00 AM',
    duration: '4 hours',
    attendees: ['Sarah Chen', 'David Rodriguez', 'Emma Thompson'],
    location: 'Houston Office - Conference Room A',
    status: 'tentative',
    priority: 'medium',
    description: 'Collaborative workshop to develop monitoring and verification plan'
  }
];

const milestones = [
  {
    id: 1,
    title: 'Project Registration Complete',
    date: '2025-02-15',
    status: 'upcoming',
    category: 'registration',
    description: 'Official project registration with carbon standard'
  },
  {
    id: 2,
    title: 'First Monitoring Report',
    date: '2025-03-01',
    status: 'upcoming',
    category: 'monitoring',
    description: 'Submit first quarterly monitoring report'
  },
  {
    id: 3,
    title: 'Credit Issuance Expected',
    date: '2025-03-30',
    status: 'projected',
    category: 'credits',
    description: 'First batch of carbon credits expected to be issued'
  }
];

const eventTypes = {
  meeting: {
    label: 'Meeting',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    icon: Users
  },
  validation: {
    label: 'Validation',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    icon: CheckCircle
  },
  deadline: {
    label: 'Deadline',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    icon: AlertTriangle
  },
  workshop: {
    label: 'Workshop',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    icon: FileText
  }
};

const priorityColors = {
  critical: 'border-l-red-500 dark:border-l-red-400',
  high: 'border-l-orange-500 dark:border-l-orange-400',
  medium: 'border-l-yellow-500 dark:border-l-yellow-400',
  low: 'border-l-green-500 dark:border-l-green-400'
};

export function CalendarScheduling({ userData }: CalendarSchedulingProps) {
  const { isMobile } = useResponsive();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const filteredEvents = upcomingEvents
    .filter(event => 
      selectedFilter === 'all' || event.type === selectedFilter
    )
    .filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Pending</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">Scheduled</Badge>;
      case 'tentative':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">Tentative</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const renderEventCard = (event: any) => {
    const eventType = eventTypes[event.type as keyof typeof eventTypes];
    const EventIcon = eventType?.icon || CalendarIcon;
    const priorityClass = priorityColors[event.priority as keyof typeof priorityColors];

    return (
      <Card key={event.id} className={`border-l-4 ${priorityClass}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${eventType?.bgColor} flex items-center justify-center`}>
                <EventIcon className={`h-5 w-5 ${eventType?.color}`} />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base">{event.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="h-3 w-3" />
                  <span>{formatDate(event.date)} at {event.time}</span>
                  {event.duration && (
                    <>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>{event.duration}</span>
                    </>
                  )}
                </CardDescription>
              </div>
            </div>
            {getStatusBadge(event.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{event.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
            )}
            {event.attendees.length > 0 && (
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span>{event.attendees.length} attendees</span>
              </div>
            )}
          </div>

          {event.attendees.length > 0 && (
            <div>
              <span className="text-sm text-muted-foreground">Attendees:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {event.attendees.map((attendee: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {attendee}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {event.type === 'meeting' && (
              <Button size="sm" variant="outline" className="flex-1">
                <Video className="h-3 w-3 mr-1" />
                Join Call
              </Button>
            )}
            <Button size="sm" variant="outline" className="flex-1">
              <Bell className="h-3 w-3 mr-1" />
              Set Reminder
            </Button>
            {event.location.includes('Portal') && (
              <Button size="sm" variant="outline" className="flex-1">
                <ExternalLink className="h-3 w-3 mr-1" />
                Open Link
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold">Calendar & Scheduling</h1>
          <p className="text-muted-foreground">Manage project timelines, meetings, and deadlines</p>
        </div>
        <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule New Event</DialogTitle>
              <DialogDescription>
                Create a new meeting, deadline, or milestone
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="event-title">Event Title</Label>
                <Input id="event-title" placeholder="Enter event title" />
              </div>
              <div>
                <Label htmlFor="event-type">Event Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(eventTypes).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <config.icon className={`h-4 w-4 ${config.color}`} />
                          <span>{config.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="event-date">Date</Label>
                  <Input id="event-date" type="date" />
                </div>
                <div>
                  <Label htmlFor="event-time">Time</Label>
                  <Input id="event-time" type="time" />
                </div>
              </div>
              <div>
                <Label htmlFor="event-description">Description</Label>
                <Textarea id="event-description" placeholder="Event details..." rows={3} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateEventOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateEventOpen(false)}>
                  Create Event
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {Object.entries(eventTypes).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <config.icon className={`h-4 w-4 ${config.color}`} />
                      <span>{config.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Events List */}
          <div className="space-y-4">
            {filteredEvents.map(renderEventCard)}
            
            {filteredEvents.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No events found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || selectedFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'No upcoming events scheduled'
                    }
                  </p>
                  <Button onClick={() => setIsCreateEventOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule First Event
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Project Milestones
              </CardTitle>
              <CardDescription>
                Track major project deliverables and deadlines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      milestone.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' :
                      milestone.status === 'upcoming' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' :
                      'bg-gray-100 dark:bg-gray-900/20 text-gray-600'
                    }`}>
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{milestone.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {formatDate(milestone.date)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {milestone.category}
                        </Badge>
                        <Badge className={
                          milestone.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          milestone.status === 'upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        }>
                          {milestone.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Calendar View
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium px-4">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Calendar View Coming Soon</h3>
                <p className="text-muted-foreground">
                  Interactive calendar with drag-and-drop scheduling will be available soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}