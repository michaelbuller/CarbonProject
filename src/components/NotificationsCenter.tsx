import React, { useState } from 'react';
import { 
  Bell, BellRing, Check, X, Clock, AlertTriangle, Info, 
  CheckCircle, FileText, Users, DollarSign, Calendar,
  Settings, Filter, MoreVertical, Archive, Trash2, Star,
  Mail, MessageSquare, Shield
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Separator } from './ui/separator';
import { useResponsive } from './ui/use-responsive';

interface NotificationsCenterProps {
  userData: any;
}

const notifications = [
  {
    id: 1,
    type: 'validation',
    title: 'Validation Review Complete',
    message: 'Emma Thompson has completed the initial validation review. 3 items require attention.',
    timestamp: '2 hours ago',
    read: false,
    priority: 'high',
    actionRequired: true,
    category: 'project',
    avatar: 'ET',
    actions: [
      { label: 'View Report', action: 'view-report' },
      { label: 'Schedule Meeting', action: 'schedule-meeting' }
    ]
  },
  {
    id: 2,
    type: 'deadline',
    title: 'Document Submission Due Soon',
    message: 'Methodology documents must be submitted to VCS Registry by January 10, 2025 (12 days remaining).',
    timestamp: '4 hours ago',
    read: false,
    priority: 'critical',
    actionRequired: true,
    category: 'compliance',
    avatar: null,
    actions: [
      { label: 'Submit Documents', action: 'submit-docs' },
      { label: 'Request Extension', action: 'request-extension' }
    ]
  },
  {
    id: 3,
    type: 'team',
    title: 'Michael Kim Accepted Invitation',
    message: 'Michael Kim has joined your project team as a Methane Systems Consultant.',
    timestamp: '1 day ago',
    read: false,
    priority: 'medium',
    actionRequired: false,
    category: 'team',
    avatar: 'MK',
    actions: [
      { label: 'Send Welcome', action: 'send-welcome' }
    ]
  },
  {
    id: 4,
    type: 'system',
    title: 'Analytics Report Generated',
    message: 'Your monthly project analytics report is ready for review.',
    timestamp: '1 day ago',
    read: true,
    priority: 'low',
    actionRequired: false,
    category: 'system',
    avatar: null,
    actions: [
      { label: 'View Report', action: 'view-analytics' }
    ]
  },
  {
    id: 5,
    type: 'financial',
    title: 'Credit Pre-Sale Opportunity',
    message: 'Buyer interested in pre-purchasing 5,000 credits at $12.50 each. Offer expires in 48 hours.',
    timestamp: '2 days ago',
    read: true,
    priority: 'high',
    actionRequired: true,
    category: 'marketplace',
    avatar: null,
    actions: [
      { label: 'View Offer', action: 'view-offer' },
      { label: 'Negotiate', action: 'negotiate' }
    ]
  },
  {
    id: 6,
    type: 'compliance',
    title: 'Monitoring Equipment Calibration Due',
    message: 'Your LDAR monitoring equipment requires calibration within 30 days to maintain compliance.',
    timestamp: '3 days ago',
    read: true,
    priority: 'medium',
    actionRequired: true,
    category: 'compliance',
    avatar: null,
    actions: [
      { label: 'Schedule Service', action: 'schedule-service' }
    ]
  },
  {
    id: 7,
    type: 'update',
    title: 'AI Assistant Enhanced',
    message: 'New AI capabilities added: advanced methodology comparison and automated compliance checking.',
    timestamp: '1 week ago',
    read: true,
    priority: 'low',
    actionRequired: false,
    category: 'system',
    avatar: null,
    actions: [
      { label: 'Try New Features', action: 'try-features' }
    ]
  }
];

const notificationTypes = {
  validation: {
    label: 'Validation',
    icon: CheckCircle,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20'
  },
  deadline: {
    label: 'Deadline',
    icon: AlertTriangle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/20'
  },
  team: {
    label: 'Team',
    icon: Users,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20'
  },
  financial: {
    label: 'Financial',
    icon: DollarSign,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/20'
  },
  compliance: {
    label: 'Compliance',
    icon: Shield,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20'
  },
  system: {
    label: 'System',
    icon: Settings,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-900/20'
  },
  update: {
    label: 'Update',
    icon: Info,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20'
  }
};

const priorityColors = {
  critical: 'border-l-red-500 dark:border-l-red-400',
  high: 'border-l-orange-500 dark:border-l-orange-400',
  medium: 'border-l-yellow-500 dark:border-l-yellow-400',
  low: 'border-l-green-500 dark:border-l-green-400'
};

export function NotificationsCenter({ userData }: NotificationsCenterProps) {
  const { isMobile } = useResponsive();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filteredNotifications = notifications
    .filter(notification => 
      selectedFilter === 'all' || notification.type === selectedFilter
    )
    .filter(notification =>
      selectedCategory === 'all' || notification.category === selectedCategory
    )
    .filter(notification =>
      !showUnreadOnly || !notification.read
    );

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => 
    !n.read && (n.priority === 'critical' || n.priority === 'high')
  ).length;

  const markAsRead = (notificationId: number) => {
    // Implementation for marking notification as read
    console.log('Mark as read:', notificationId);
  };

  const markAllAsRead = () => {
    // Implementation for marking all notifications as read
    console.log('Mark all as read');
  };

  const handleNotificationAction = (notificationId: number, action: string) => {
    // Implementation for notification actions
    console.log('Handle action:', action, 'for notification:', notificationId);
  };

  const renderNotificationCard = (notification: any) => {
    const notificationType = notificationTypes[notification.type as keyof typeof notificationTypes];
    const NotificationIcon = notificationType?.icon || Bell;
    const priorityClass = priorityColors[notification.priority as keyof typeof priorityColors];

    return (
      <Card 
        key={notification.id} 
        className={`border-l-4 ${priorityClass} ${notification.read ? 'opacity-75' : ''}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full ${notificationType?.bgColor} flex items-center justify-center relative`}>
                {notification.avatar ? (
                  <span className="text-sm font-medium">{notification.avatar}</span>
                ) : (
                  <NotificationIcon className={`h-5 w-5 ${notificationType?.color}`} />
                )}
                {!notification.read && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <CardTitle className="text-base flex items-center gap-2">
                  {notification.title}
                  {notification.actionRequired && (
                    <Badge variant="destructive" className="text-xs">Action Required</Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  {notification.message}
                </CardDescription>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {notification.timestamp}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {notificationType?.label}
                  </Badge>
                  <Badge variant="outline" className={`text-xs capitalize ${
                    notification.priority === 'critical' ? 'text-red-600 border-red-200' :
                    notification.priority === 'high' ? 'text-orange-600 border-orange-200' :
                    notification.priority === 'medium' ? 'text-yellow-600 border-yellow-200' :
                    'text-green-600 border-green-200'
                  }`}>
                    {notification.priority}
                  </Badge>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!notification.read && (
                  <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                    <Check className="h-4 w-4 mr-2" />
                    Mark as Read
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Star className="h-4 w-4 mr-2" />
                  Star
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        {notification.actions.length > 0 && (
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {notification.actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={index === 0 ? "default" : "outline"}
                  onClick={() => handleNotificationAction(notification.id, action.action)}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">Stay updated on your project progress and important alerts</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-600" />
              Total Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{notifications.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BellRing className="h-4 w-4 text-orange-600" />
              Unread
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Urgent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{urgentCount}</div>
            <p className="text-xs text-muted-foreground">High priority</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="urgent">Urgent</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(notificationTypes).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <config.icon className={`h-4 w-4 ${config.color}`} />
                      <span>{config.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="marketplace">Marketplace</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2 ml-auto">
              <Switch
                id="unread-only"
                checked={showUnreadOnly}
                onCheckedChange={setShowUnreadOnly}
              />
              <Label htmlFor="unread-only" className="text-sm">
                Unread only
              </Label>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.map(renderNotificationCard)}
            
            {filteredNotifications.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No notifications found</h3>
                  <p className="text-muted-foreground">
                    {showUnreadOnly || selectedFilter !== 'all' || selectedCategory !== 'all'
                      ? 'Try adjusting your filter criteria'
                      : 'You\'re all caught up!'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          <div className="space-y-4">
            {notifications
              .filter(n => !n.read)
              .map(renderNotificationCard)}
          </div>
        </TabsContent>

        <TabsContent value="urgent" className="space-y-4">
          <div className="space-y-4">
            {notifications
              .filter(n => n.priority === 'critical' || n.priority === 'high')
              .map(renderNotificationCard)}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Customize how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Email Notifications</h4>
                {Object.entries(notificationTypes).map(([key, config]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <config.icon className={`h-4 w-4 ${config.color}`} />
                      <Label htmlFor={`email-${key}`}>{config.label} updates</Label>
                    </div>
                    <Switch id={`email-${key}`} defaultChecked />
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Push Notifications</h4>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-urgent">Urgent notifications only</Label>
                  <Switch id="push-urgent" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-all">All notifications</Label>
                  <Switch id="push-all" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Quiet Hours</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quiet-start">Start Time</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="9:00 PM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="21:00">9:00 PM</SelectItem>
                        <SelectItem value="22:00">10:00 PM</SelectItem>
                        <SelectItem value="23:00">11:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="quiet-end">End Time</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="7:00 AM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="06:00">6:00 AM</SelectItem>
                        <SelectItem value="07:00">7:00 AM</SelectItem>
                        <SelectItem value="08:00">8:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}