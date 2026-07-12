import LoginForm from '@/features/auth/components/LoginForm';
import { Card, CardContent } from '@/shared/components/ui/card';

export default function LoginPage() {
  return (
    <Card>
      <CardContent>
        <LoginForm />
        Hello from shadcn
      </CardContent>
    </Card>
  );
}
