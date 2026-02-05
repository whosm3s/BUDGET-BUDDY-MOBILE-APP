class ApplicationController < ActionController::Base
  include ActionController::Cookies
  protect_from_forgery with: :null_session

  # JWT-based current_user
  def current_user
    @current_user
  end

  def authorize_request
    header = request.headers["Authorization"]
    token = header.split(" ").last if header

    if token.blank?
      render json: { error: "Unauthorized" }, status: :unauthorized
      return
    end

    @current_user = User.find_by_auth_token(token)
    
    if @current_user.blank?
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  rescue
    render json: { error: "Unauthorized" }, status: :unauthorized
  end
end
