export function Privacy() {
  return (
    <div className="static-page">
      <h1>Privacy Policy</h1>
      <p className="static-updated">Last updated: July 2026</p>

      <section>
        <h2>Data We Collect</h2>
        <p>
          When you sign in with Google, we access your email address, name, and
          profile picture via the Google UserInfo API. This information is used
          solely to display your account details in the app and is never shared
          with third parties.
        </p>
        <p>
          Your practice progress (which LeetCode problems you have marked as
          completed) is stored locally in your browser when you are not signed
          in, or in your Google Drive AppData folder when you are signed in.
        </p>
      </section>

      <section>
        <h2>How We Use Your Data</h2>
        <p>
          The practice progress data is used only to restore your progress when
          you return to the app. No analytics, tracking, or advertising services
          are used. We do not sell, rent, or share your personal information
          with anyone.
        </p>
      </section>

      <section>
        <h2>Google Drive AppData</h2>
        <p>
          With your permission, the app stores practice progress in a hidden
          Google Drive AppData folder that is only accessible by this
          application. Google's
          {" "}<a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>
          {" "}governs the security of data stored through their services.
        </p>
      </section>

      <section>
        <h2>Data Retention</h2>
        <p>
          You can delete your practice data at any time using the Reset button
          on the Practice page. To revoke the app's access to your Google
          account, visit your
          {" "}<a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer">Google Account permissions page</a>.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          If you have questions about this privacy policy, please open an issue
          on the project's GitHub repository.
        </p>
      </section>
    </div>
  );
}
