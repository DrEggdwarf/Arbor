Rails.application.routes.draw do
  root "reports#index"

  resources :reports, only: [ :index, :create, :show, :update, :destroy ]

  get "up" => "rails/health#show", as: :rails_health_check
end
