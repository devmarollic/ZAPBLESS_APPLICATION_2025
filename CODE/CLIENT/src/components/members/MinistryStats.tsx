import { Contact } from '@/services/contactService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, UserPlus, Phone } from 'lucide-react';

interface MemberMembership {
  memberId: string;
  role: string;
}

interface MinistryStatsProps {
  contacts: Contact[] | undefined;
  memberMemberships: MemberMembership[];
}

const MinistryStats = ({ contacts, memberMemberships }: MinistryStatsProps) => {
  const totalMembers = memberMemberships.length;
  const members = memberMemberships.filter(m => m.role === 'member').length;
  const volunteers = memberMemberships.filter(m => m.role === 'volunteer').length;
  
  const verifiedContacts = contacts?.filter(contact => 
    memberMemberships.some(m => m.memberId === contact.id && contact.verifiedName)
  ).length || 0;

  const stats = [
    {
      title: "Total de Membros",
      value: totalMembers,
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Membros",
      value: members,
      icon: UserCheck,
      color: "bg-green-500"
    },
    {
      title: "Voluntários",
      value: volunteers,
      icon: UserPlus,
      color: "bg-purple-500"
    },
    {
      title: "Contatos Verificados",
      value: verifiedContacts,
      icon: Phone,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.title} className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-center gap-2">
                <div className={`p-2 rounded-full ${stat.color} text-white`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MinistryStats; 