# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    # Authentication routes
    post '/signup', to: 'users#create'
    post '/login', to: 'sessions#create'
    delete '/logout', to: 'sessions#destroy'
    get '/current_user', to: 'sessions#show'
    
    # Debug routes (remove in production)
    get '/debug/check_user', to: 'debug#check_user'
    post '/debug/test_password', to: 'debug#test_password'
    
    # Resource routes
    resources :incomes, only: [:create, :index]
    resources :budgets, only: [:create, :index]
    resources :expenses, only: [:index, :create]
  end
end