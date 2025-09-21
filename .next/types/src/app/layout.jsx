import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
var inter = Inter({ subsets: ['latin'] });
export var metadata = {
    title: 'Vocab Queue Master',
    description: 'Master your vocabulary with spaced repetition',
};
export default function RootLayout(_a) {
    var children = _a.children;
    return (<html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>);
}
//# sourceMappingURL=layout.jsx.map