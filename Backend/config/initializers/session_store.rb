Rails.application.config.session_store :cookie_store,
  key: "_budget_buddy_session",
  same_site: :none,
  secure: false   # set true if using HTTPS
