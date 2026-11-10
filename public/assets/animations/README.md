# Animation assets

Both original Lottie exports are installed and wired:

- `auth-loading.json`: shown by `LoadingOverlay` while the Launch interface / Join interface authentication callback is pending. It loops and the submit button remains disabled until the callback resolves or rejects.
- `challenge-created.json`: played once by `SuccessAnimation` after Publish Challenge succeeds, alongside “Challenge created”. Feedback remains visible across the existing dashboard navigation until dismissed.

Both exports are self-contained and need no external image files. Reduced motion uses static loading/success fallbacks. The invitation falcon remains the local SVG/CSS animation.

The default authentication is still an immediate demo action; use the existing asynchronous `onSuccessLogin` / `onSuccessRegister` callbacks for real authentication. No artificial loading delay is introduced.
