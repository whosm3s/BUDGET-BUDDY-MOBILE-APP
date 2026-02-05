# app/controllers/api/sessions_controller.rb
class Api::SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token
  
  def show
    # Debug logging
    Rails.logger.info "=== SESSIONS#SHOW CALLED ==="
    
    # Try to get user from token in header
    token = request.headers['Authorization']&.split(' ')&.last
    
    Rails.logger.info "Token received: #{token.present? ? 'YES' : 'NO'}"
    Rails.logger.info "Full Authorization header: #{request.headers['Authorization']}"
    
    if token.present?
      Rails.logger.info "Token: #{token[0..20]}..." if token.length > 20
      
      # Try to find user by token
      user = User.find_by(auth_token: token)
      
      if user
        Rails.logger.info "Found user by token: #{user.email}"
        Rails.logger.info "Token expires at: #{user.token_expires_at}"
        Rails.logger.info "Current time: #{Time.current}"
        
        if user.token_expires_at && user.token_expires_at > Time.current
          Rails.logger.info "Token is valid!"
          render json: { 
            user: user.as_json(only: [:id, :name, :email]),
            status: "success" 
          }
          return
        else
          Rails.logger.info "Token expired or no expiration time"
        end
      else
        Rails.logger.info "No user found with this token"
      end
    else
      Rails.logger.info "No token provided in request"
    end
    
    # No valid token found
    Rails.logger.info "Returning null user response"
    render json: { 
      user: nil,
      status: "error",
      message: "Not authenticated",
      debug: { 
        token_present: token.present?,
        authorization_header: request.headers['Authorization']
      }
    }
  end

  def create
    Rails.logger.info "=== SESSIONS#CREATE CALLED ==="
    Rails.logger.info "Params: #{params.inspect}"
    
    email = params[:email]&.downcase&.strip
    password = params[:password]
    
    Rails.logger.info "Login attempt - Email: #{email}, Password length: #{password&.length}"
    
    user = User.find_by(email: email)
    
    if user.nil?
      Rails.logger.info "❌ User not found for email: #{email}"
      render json: { 
        error: "Invalid email or password",
        status: "error" 
      }, status: :unauthorized
      return
    end

    Rails.logger.info "✅ User found: #{user.email}"
    
    if user.authenticate(password)
      token = user.generate_auth_token
      user.reload
      
      Rails.logger.info "✅ User authenticated: #{user.email}"
      Rails.logger.info "Generated token: #{token[0..20]}..."
      Rails.logger.info "Token expires at: #{user.token_expires_at}"
      Rails.logger.info "Token in DB: #{user.auth_token[0..20]}..."
      
      render json: { 
        user: user.as_json(only: [:id, :name, :email]),
        token: token,
        status: "success" 
      }
    else
      Rails.logger.info "❌ Password authentication failed for: #{email}"
      render json: { 
        error: "Invalid email or password",
        status: "error" 
      }, status: :unauthorized
    end
  end

  def destroy
    Rails.logger.info "=== SESSIONS#DESTROY CALLED ==="
    
    token = request.headers['Authorization']&.split(' ')&.last
    if token.present?
      user = User.find_by(auth_token: token)
      if user
        user.clear_auth_token
        Rails.logger.info "User logged out: #{user.email}"
      end
    end
    
    render json: { 
      message: 'Logged out',
      status: "success" 
    }
  end
end