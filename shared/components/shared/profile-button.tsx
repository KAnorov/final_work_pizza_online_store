
import { Button } from "../ui";
import { signOut, useSession } from "next-auth/react";
import { User } from "lucide-react";


interface Props {
  onClickSignIn?: () => void
  className?: string;
}

export const ProfileButton: React.FC<Props> = ({ className, onClickSignIn }) => {
  const { data: session } = useSession();
 

  return (
    <div className={className}>
      {!session ? (
        <Button onClick={onClickSignIn} variant="outline" className="flex items-center gap-1">
          <User size={18} />
          Войти
        </Button>
      ) : (
        <Button
          onClick={() => signOut(
            { callbackUrl: '/' }
          )}
          variant="secondary" className="flex items-center gap-2">
          Выйти
        </Button>
      )}
    </div>
  );
};