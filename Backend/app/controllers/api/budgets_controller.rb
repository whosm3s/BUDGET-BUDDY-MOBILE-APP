class Api::BudgetsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :authorize_request

  def index
  
    budgets = current_user.budgets.order(created_at: :asc)
    render json: budgets
  end

  def show
    budget = current_user.budgets.last
    if budget
      render json: budget
    else
      render json: { needs_percent: 0, wants_percent: 0, savings_percent: 0 }
    end
  end

  def create
    budget = current_user.budgets.new(budget_params)

    if budget.save
      render json: budget, status: :created
    else
      puts budget.errors.full_messages  
      render json: { errors: budget.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def budget_params
    params.require(:budget).permit(:needs_percent, :wants_percent, :savings_percent)
  end
end
