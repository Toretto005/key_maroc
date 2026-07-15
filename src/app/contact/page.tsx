export default function ContactPage() {
  return (
    <div className="min-h-full bg-slate-50 py-20 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Contact Us</h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-8">
          Have a question or need support with the platform? We're here to help.
        </p>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-slate-700 font-medium text-lg">Email us at:</p>
          <a href="mailto:support@sarouti.ma" className="text-blue-600 font-bold text-2xl hover:underline">
            support@sarouti.ma
          </a>
        </div>
      </div>
    </div>
  );
}
