
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserPlus, Users } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'editor' | 'viewer';
}

interface TeamCollaborationProps {
  members: TeamMember[];
  onInviteMember: (email: string) => void;
  onUpdateRole: (memberId: string, role: 'editor' | 'viewer') => void;
}

const TeamCollaboration: React.FC<TeamCollaborationProps> = ({
  members,
  onInviteMember,
  onUpdateRole,
}) => {
  const [inviteEmail, setInviteEmail] = React.useState('');

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h3 className="text-lg font-semibold">Thành viên nhóm</h3>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="email"
            placeholder="Email thành viên"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="w-64"
          />
          <Button
            onClick={() => {
              onInviteMember(inviteEmail);
              setInviteEmail('');
            }}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Mời
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">{member.email}</p>
              </div>
            </div>
            <select
              value={member.role}
              onChange={(e) => onUpdateRole(member.id, e.target.value as 'editor' | 'viewer')}
              className="p-2 rounded border"
            >
              <option value="editor">Biên tập viên</option>
              <option value="viewer">Người xem</option>
            </select>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TeamCollaboration;
