class Api::DebugController < ApplicationController
  skip_before_action :verify_authenticity_token

  def check_user
    email = params[:email]&.downcase&.strip
    
    user = User.find_by(email: email)
    
    if user.nil?
      render json: {
        found: false,
        email: email,
        message: "User not found"
      }
    else
      render json: {
        found: true,
        email: email,
        name: user.name,
        id: user.id,
        has_password_digest: user.password_digest.present?,
        has_auth_token: user.auth_token.present?,
        auth_token: user.auth_token.present? ? user.auth_token[0..20] + "..." : "NO TOKEN",
        token_expires_at: user.token_expires_at,
        created_at: user.created_at
      }
    end
  end

  def test_password
    email = params[:email]&.downcase&.strip
    password = params[:password]
    
    user = User.find_by(email: email)
    
    if user.nil?
      render json: {
        status: "error",
        message: "User not found"
      }
      return
    end

    if user.authenticate(password)
      render json: {
        status: "success",
        message: "Password is correct",
        user: user.as_json(only: [:id, :name, :email])
      }
    else
      render json: {
        status: "error",
        message: "Password is incorrect",
        hint: "Password digest exists: #{user.password_digest.present?}"
      }
    end
  end
end
