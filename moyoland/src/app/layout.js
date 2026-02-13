import './globals.css';
import PixelBackdrop from '@/components/PixelBackdrop';
import CurlyCursor from '@/components/CurlyCursor';
import BootLoader from '@/components/BootLoader';

export const metadata = {
  title: 'MOYOLAND',
  description: 'Portfolio of Moyosore Ogunjobi',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <BootLoader />
        <PixelBackdrop />
        <div className="film-grain" aria-hidden="true" />
        {children}
        <CurlyCursor />
      </body>
    </html>
  );
}
