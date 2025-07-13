import React, { useState } from 'react';
import { 
  Users, Plus, UserPlus, Shield, Crown, Mail, Phone, Clock, 
  CheckCircle, AlertCircle, MoreVertical, Edit, Trash2, MessageSquare,
  FileText, Activity, Calendar, Video, Settings
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, Avatar as AvatarComponent } from './ui/avatar';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useResponsive } from './ui/use-responsive';

interface TeamCollaborationProps {
  userData: any;
}

const teamMembers = [
  {
    id: 1,
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    role: 'project-manager',
    avatar: 'SC',
    status: 'active',
    joinedDate: '2024-12-15',
    lastActive: '2 hours ago',
    permissions: ['document-edit', 'analytics-view', 'team-manage'],
    expertise: ['Environmental Science', 'Project Management'],
    location: 'San Francisco, CA'
  },
  {
    id: 2,
    name: 'David Rodriguez',
    email: 'david.r@example.com',
    role: 'technical-lead',
    avatar: 'DR',
    status: 'active',
    joinedDate: '2024-12-18',
    lastActive: '5 minutes ago',
    permissions: ['document-edit', 'analytics-view'],
    expertise: ['Carbon Accounting', 'Data Analysis'],
    location: 'Austin, TX'
  },
  {
    id: 3,
    name: 'Emma Thompson',
    email: 'emma.thompson@example.com',
    role: 'validator',
    avatar: 'ET',
    status: 'pending',
    joinedDate: '2024-12-20',
    lastActive: 'Never',
    permissions: ['document-view'],
    expertise: ['Third-party Validation', 'VCS Standards'],
    location: 'Denver, CO'
  },
  {
    id: 4,
    name: 'Michael Kim',
    email: 'michael.kim@example.com',
    role: 'consultant',
    avatar: 'MK',
    status: 'invited',
    joinedDate: null,
    lastActive: null,
    permissions: ['analytics-view'],
    expertise: ['Methane Projects', 'LDAR Systems'],
    location: 'Houston, TX'
  }
];

const roleConfig = {
  'project-owner': {
    label: 'Project Owner',
    icon: Crown,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    description: 'Full project control and ownership'
  },
  'project-manager': {
    label: 'Project Manager',
    icon: Shield,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    description: 'Manage project operations and team'
  },
  'technical-lead': {
    label: 'Technical Lead',
    icon: Settings,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    description: 'Technical oversight and implementation'
  },
  'validator': {
    label: 'Validator',
    icon: CheckCircle,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    description: 'Third-party validation and verification'
  },
  'consultant': {
    label: 'Consultant',
    icon: Users,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-900/20',
    description: 'Advisory and consulting services'
  }
};

const recentActivity = [
  {
    id: 1,
    user: 'Sarah Chen',
    action: 'Updated project methodology document',
    timestamp: '2 hours ago',
    type: 'document'
  },
  {
    id: 2,
    user: 'David Rodriguez',
    action: 'Completed emissions calculation review',
    timestamp: '4 hours ago',
    type: 'review'
  },
  {
    id: 3,
    user: 'Emma Thompson',
    action: 'Joined the project team',
    timestamp: '1 day ago',
    type: 'team'
  },
  {
    id: 4,
    user: 'System',
    action: 'Validation request submitted to Emma Thompson',
    timestamp: '2 days ago',
    type: 'system'
  }
];

export function TeamCollaboration({ userData }: TeamCollaborationProps) {
  const { isMobile } = useResponsive();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('consultant');

  const handleInviteTeamMember = () => {
    // Handle team member invitation
    console.log('Inviting:', inviteEmail, 'as', inviteRole);
    setIsInviteDialogOpen(false);
    setInviteEmail('');
    setInviteRole('consultant');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Pending</Badge>;
      case 'invited':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">Invited</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const renderTeamMemberCard = (member: any) => {
    const roleInfo = roleConfig[member.role as keyof typeof roleConfig];
    const RoleIcon = roleInfo?.icon || Users;

    return (
      <Card key={member.id} className="relative">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">{member.avatar}</span>
              </div>
              <div className="flex-1">
                <CardTitle className="text-base">{member.name}</CardTitle>
                <CardDescription className="text-sm">
                  <div className="flex items-center gap-2">
                    <RoleIcon className={`h-3 w-3 ${roleInfo?.color}`} />
                    <span>{roleInfo?.label}</span>
                  </div>
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(member.status)}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Role
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Email:</span>
              <div className="font-medium truncate">{member.email}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Location:</span>
              <div className="font-medium">{member.location}</div>
            </div>
            {member.joinedDate && (
              <div>
                <span className="text-muted-foreground">Joined:</span>
                <div className="font-medium">{member.joinedDate}</div>
              </div>
            )}
            {member.lastActive && (
              <div>
                <span className="text-muted-foreground">Last Active:</span>
                <div className="font-medium">{member.lastActive}</div>
              </div>
            )}
          </div>

          <div>
            <span className="text-sm text-muted-foreground">Expertise:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {member.expertise.map((skill: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              <MessageSquare className="h-3 w-3 mr-1" />
              Message
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Video className="h-3 w-3 mr-1" />
              Call
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold">Team Collaboration</h1>
          <p className="text-muted-foreground">Manage your project team and collaborate effectively</p>
        </div>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your carbon credit project team
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleConfig).map(([key, config]) => (
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
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInviteTeamMember}>
                  Send Invitation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {teamMembers.map(renderTeamMemberCard)}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Team Activity
              </CardTitle>
              <CardDescription>
                Track what your team members have been working on
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      activity.type === 'document' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' :
                      activity.type === 'review' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' :
                      activity.type === 'team' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600' :
                      'bg-gray-100 dark:bg-gray-900/20 text-gray-600'
                    }`}>
                      {activity.type === 'document' ? <FileText className="h-3 w-3" /> :
                       activity.type === 'review' ? <CheckCircle className="h-3 w-3" /> :
                       activity.type === 'team' ? <Users className="h-3 w-3" /> :
                       <Activity className="h-3 w-3" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role Permissions
              </CardTitle>
              <CardDescription>
                Understand what each role can do in your project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(roleConfig).map(([key, config]) => {
                  const RoleIcon = config.icon;
                  return (
                    <div key={key} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center`}>
                          <RoleIcon className={`h-4 w-4 ${config.color}`} />
                        </div>
                        <div>
                          <h4 className="font-medium">{config.label}</h4>
                          <p className="text-sm text-muted-foreground">{config.description}</p>
                        </div>
                      </div>
                      <div className="ml-11">
                        <div className="text-sm space-y-1">
                          {key === 'project-owner' && (
                            <>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span>Full project control</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span>Manage team members</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span>Financial management</span>
                              </div>
                            </>
                          )}
                          {key === 'project-manager' && (
                            <>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span>Edit documents</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span>View analytics</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span>Manage team</span>
                              </div>
                            </>
                          )}
                          {key === 'technical-lead' && (
                            <>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span>Edit technical documents</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span>View detailed analytics</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <AlertCircle className="h-3 w-3 text-yellow-600" />
                                <span>Limited team management</span>
                              </div>
                            </>
                          )}
                          {key === 'validator' && (
                            <>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span>View all documents</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span>Submit validation reports</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <AlertCircle className="h-3 w-3 text-yellow-600" />
                                <span>Read-only access</span>
                              </div>
                            </>
                          )}
                          {key === 'consultant' && (
                            <>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span>View analytics</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span>Provide recommendations</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <AlertCircle className="h-3 w-3 text-yellow-600" />
                                <span>Limited document access</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}