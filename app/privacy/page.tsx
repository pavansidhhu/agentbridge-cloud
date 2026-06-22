'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <motion.div 
      className="container legal-layout"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className="legal-header">
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-meta">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </header>

      <article className="legal-content">
        <p>
          At AgentBridge, we value your privacy above all else. This software and cloud platform is built to execute automations locally on your hardware. We collect only the absolute minimum amount of telemetry required to check app version compatibility, prevent abuse, and manage configurations.
        </p>

        <h2>Information We Collect</h2>
        <p>
          When you connect the AgentBridge Desktop application to the cloud, the following telemetry data is securely synchronized with our databases:
        </p>
        <ul>
          <li><strong>Google Account Email:</strong> Extracted securely post-login to verify identity and enable features.</li>
          <li><strong>App Version:</strong> To ensure your client is up-to-date and notify you of critical updates.</li>
          <li><strong>Last Active Timestamp:</strong> To track platform usage and active sessions.</li>
          <li><strong>Operating System & Country:</strong> Automatically parsed from Vercel edge header fields to analyze regional usage.</li>
        </ul>

        <h2>Information We NEVER Collect</h2>
        <p>
          Because all automation browser sessions execute completely locally on your machine, we do not have access to, nor do we store, any of the following private data:
        </p>
        <ul>
          <li><strong>Gemini Prompts & Responses:</strong> Your queries and responses stay strictly inside your local browser instances.</li>
          <li><strong>Browser History:</strong> No browsing logs, cookies (other than local automation session cookies), or page contents are sent to the cloud.</li>
          <li><strong>Passwords & Credentials:</strong> We never see or store your Google account password or session cookies on our servers.</li>
        </ul>

        <h2>Data Security</h2>
        <p>
          All communications between the AgentBridge PyQt Desktop app and the Vercel serverless backend are encrypted using standard HTTPS protocol. Database storage is protected under secure MongoDB Atlas credentials and limited system accessibility.
        </p>

        <h2>Contact & Open Source</h2>
        <p>
          If you have questions about this privacy statement, or want to audit the source code, please visit our repository or contact system administration.
        </p>

        <div style={{ marginTop: '3rem' }}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ display: 'inline-block' }}>
            <Link href="/" className="btn btn-secondary">
              ← Back to Home
            </Link>
          </motion.div>
        </div>
      </article>
    </motion.div>
  );
}
