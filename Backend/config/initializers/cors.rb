Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'localhost:3000', 'http://localhost:3000', 'http://localhost:8081', 'http://192.168.8.189:8081', '*'

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: false,
      expose: ['Set-Cookie', 'Authorization']
  end
end
