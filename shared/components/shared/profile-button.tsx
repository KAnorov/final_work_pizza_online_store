
import { Button } from "../ui";
import { signIn, signOut, useSession } from "next-auth/react";
import { User } from "lucide-react";

interface Props {
    className?: string;
  }
  
  export const ProfileButton: React.FC<Props> = ({ className }) => {
    const { data: session } = useSession();
  
    return (
      <div className={className}>
        {!session ? (
          <Button onClick={() => signIn()} variant="outline" className="flex items-center gap-1">
            <User size={18}/>
            Войти
          </Button>
        ) : (
            <Button 
            onClick={() => signOut()}
            variant="secondary" className="flex items-center gap-2">
              {session.user?.image &&
          <img src={session.user.image}
            style={{ width: '40px', borderRadius: '50%' }} />}|
              <hr /> 
              Выйти
            </Button>
        )}
      </div>
    );
  };