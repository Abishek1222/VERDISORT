export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-dark-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} VERDISORT. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a href="#" className="text-gray-500 hover:text-verde-400 text-sm transition-colors">Privacy Policy</a>
          <a href="#" className="text-gray-500 hover:text-verde-400 text-sm transition-colors">Terms of Service</a>
          <a href="#" className="text-gray-500 hover:text-verde-400 text-sm transition-colors">API Documentation</a>
        </div>
      </div>
    </footer>
  );
}
