import { Contact } from '@/services/contactService';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, User } from 'lucide-react';

interface ContactDetailsProps {
  contact: Contact;
  showDetails?: boolean;
}

const ContactDetails = ({ contact, showDetails = false }: ContactDetailsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{contact.name}</span>
      </div>
      
      {contact.ecclesiasticalTitle && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {contact.ecclesiasticalTitle}
          </Badge>
        </div>
      )}
      
      {showDetails && (
        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3" />
            <span>{contact.number}</span>
          </div>
          {contact.verifiedName && (
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3" />
              <span>Verificado: {contact.verifiedName}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactDetails; 