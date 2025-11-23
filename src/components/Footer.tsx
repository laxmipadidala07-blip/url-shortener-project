// src/components/Footer.tsx
// Site footer with Windows 11 inspired design

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Copyright */}
          <p className="text-sm text-gray-600">
            © {currentYear} TinyLink. All rights reserved.
          </p>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              Terms
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              Documentation
            </a>
          </div>
        </div>

        {/* Attribution */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Built with Next.js, Drizzle ORM, and Neon Postgres
          </p>
        </div>
      </div>
    </footer>
  );
}