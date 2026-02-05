# app/controllers/api/users_controller.rb
class Api::UsersController < ApplicationController
  skip_before_action :verify_authenticity_token
  
  def create
    Rails.logger.info "=== USERS#CREATE CALLED ==="
    Rails.logger.info "Raw params: #{params.inspect}"
    Rails.logger.info "User params: #{user_params.inspect}"
    
    user_data = user_params.dup
    user_data[:email] = user_data[:email]&.downcase&.strip
    user = User.new(user_data)
    
    Rails.logger.info "Created user object with: name=#{user.name}, email=#{user.email}, has_password=#{user.password.present?}"
    
    if user.save
      # Generate token for new user
      token = user.generate_auth_token
      
      Rails.logger.info "✅ New user created successfully!"
      Rails.logger.info "   User ID: #{user.id}"
      Rails.logger.info "   Email: #{user.email}"
      Rails.logger.info "   Name: #{user.name}"
      Rails.logger.info "   Generated token: #{token[0..20]}..."
      Rails.logger.info "   Token expires at: #{user.token_expires_at}"
      
      render json: { 
        user: user.as_json(only: [:id, :name, :email]),
        token: token,
        status: "success" 
      }, status: :created
    else
      Rails.logger.error "❌ User creation failed!"
      Rails.logger.error "   Errors: #{user.errors.full_messages}"
      Rails.logger.error "   Password digest: #{user.password_digest.present? ? 'YES' : 'NO'}"
      
      render json: { 
        errors: user.errors.full_messages,
        status: "error" 
      }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password)
  end
end