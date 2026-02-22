export default function Privacy() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
            <p className="text-gray-700">
              Das Group LLC (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates DealPilot, a HubSpot integration application. 
              This Privacy Policy explains how we collect, use, and protect your information when you use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
            <p className="text-gray-700 mb-3">
              When you use DealPilot, we may collect and process the following information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>HubSpot account information and authentication tokens</li>
              <li>Deal data including names, amounts, stages, and associated contacts</li>
              <li>Task and activity data created through the application</li>
              <li>Usage analytics and error logs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">How We Use Your Information</h2>
            <p className="text-gray-700 mb-3">
              We use the collected information to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Provide AI-powered deal analysis and recommendations</li>
              <li>Generate personalized follow-up emails and next steps</li>
              <li>Create and manage tasks in your HubSpot account</li>
              <li>Improve and optimize our service</li>
              <li>Provide customer support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
            <p className="text-gray-700">
              We implement industry-standard security measures to protect your data, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
              <li>Encrypted data transmission (HTTPS/TLS)</li>
              <li>Secure token storage and authentication</li>
              <li>Regular security audits and updates</li>
              <li>Limited data retention policies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Third-Party Services</h2>
            <p className="text-gray-700">
              DealPilot integrates with:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
              <li><strong>HubSpot:</strong> To access and manage your CRM data</li>
              <li><strong>OpenAI:</strong> To generate AI-powered insights and content</li>
            </ul>
            <p className="text-gray-700 mt-3">
              These services have their own privacy policies governing their use of your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Data Retention</h2>
            <p className="text-gray-700">
              We retain your data only as long as necessary to provide our services. 
              Authentication tokens are stored temporarily and can be revoked at any time through your HubSpot account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
            <p className="text-gray-700">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
              <li>Access your personal data</li>
              <li>Request data deletion</li>
              <li>Revoke app permissions at any time</li>
              <li>Opt out of data collection by uninstalling the app</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
            <p className="text-gray-700">
              If you have questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="text-gray-700 mt-3">
              <strong>Email:</strong> <a href="mailto:support@dasgroupllc.com" className="text-blue-600 hover:underline">support@dasgroupllc.com</a>
              <br />
              <strong>Company:</strong> Das Group LLC
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. 
              We will notify you of any significant changes by posting the new policy on this page and updating the &quot;Last Updated&quot; date.
            </p>
            <p className="text-gray-700 mt-3">
              <strong>Last Updated:</strong> February 22, 2025
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="text-blue-600 hover:underline">← Back to Home</a>
        </div>
      </div>
    </main>
  );
}
