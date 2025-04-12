
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, UserPlus, X } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface TeamCollaborationProps {
  members: TeamMember[];
  onInviteMember: (email: string) => void;
  onUpdateRole: (memberId: string, role: string) => void;
}

const TeamCollaboration: React.FC<TeamCollaborationProps> = ({
  members,
  onInviteMember,
  onUpdateRole
}) => {
  const [inviteEmail, setInviteEmail] = useState('');

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      onInviteMember(inviteEmail);
      setInviteEmail('');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Mời thành viên mới</h3>
        <div className="flex gap-4">
          <Input
            type="email"
            placeholder="Email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleInvite}>
            <UserPlus className="mr-2 h-4 w-4" />
            Mời
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Thành viên ({members.length})</h3>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">{member.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={member.role}
                  onValueChange={(value) => onUpdateRole(member.id, value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Chủ sở hữu</SelectItem>
                    <SelectItem value="admin">Quản trị viên</SelectItem>
                    <SelectItem value="editor">Biên tập viên</SelectItem>
                    <SelectItem value="viewer">Người xem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TeamCollaboration;
