class Api::SessionsController < ApplicationController
  def current_user
    if current_user = User.find_by(id: session[:user_id])
      render json: { user: current_user }
    else
      render json: { user: nil }
    end
  end
end
